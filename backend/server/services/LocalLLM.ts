import { Ollama } from 'ollama'
import { config } from '../config/config.js';
import { Question } from '../types/quiz.types.js';


class LocalLLM {
    ollama: Ollama;
    model: string;
    host: string;
    /**
     * Initialize the LocalLLM client
     * @param {string} model - The model to use for text generation (default: 'llama2')
     */
    constructor(model: string = 'gemma3:1b') {
        this.host = config.llmHost;
        this.ollama = new Ollama({ host: this.host });
        this.model = model;
        this._initializeModel();
    }

    /**
     * Initialize the model by ensuring it's downloaded
     * @private
     */
    async _initializeModel() {
        try {
            console.log(`Checking for model: ${this.model}`);
            // This will automatically pull the model if it doesn't exist
            const response = await this.ollama.pull({ model: this.model, stream: false });
            console.log(`Model ${this.model} is ready to use`);
            return response;
        } catch (error) {
            const message = `Failed to initialize model ${this.model}: ${error}`;
            console.error(message);
        }
    }

    /**
     * Generate a summary of the input text
     * @param {string} text - The text to summarize
     * @param {number} [maxLength=150] - Maximum length of the summary
     * @returns {Promise<string>} The generated summary
     */
    async summarise(text: string, maxLength: number = 150) {
        try {
            const prompt = `Create a summary of the following text, keeping it under ${maxLength} characters and return nothing else. No pleasantries. Text: ${text}`;
            console.log('Summarise Prompt: ', prompt);
            const response = await this.ollama.chat({
                model: this.model,
                messages: [{ role: 'user', content: prompt }]
            })
            return response.message.content.trim().replace(',', '');
        } catch (error) {
            const message = "LocalLLMSummarisationError: Failed to generate summary - " + error;
            console.error(message);
            throw new Error(message);
        }
    }

    /**
     * Generate a title from a document with a max length of 25 characters which is configurable.
     * @param {string} text - The text to analyze
     * @param {Object} options - Additional options
     * @param {number} [options.maxLength=25] - Maximum length of the title
     * @returns {Promise<string>} The generated title
     */
    async generate_title(text: string, { maxLength = 25 } = {}) {
        try {
            const prompt = `Generate a concise title for this text, keeping it under ${maxLength} characters and return nothing else. No pleasantries. Text: ${text}`;
            console.log('Title Prompt: ', prompt);
            const response = await this.ollama.chat({
                model: this.model,
                messages: [{ role: 'user', content: prompt }]
            })
            return response.message.content.trim();
        } catch (error) {
            const message = "LocalLLMTitleGenerationError: Failed to generate title - " + error;
            console.error(message);
            throw new Error(message);
        }
    }
    /**
     * Generate a list of relevant tags for the input text
     * @param {string} text - The text to analyze
     * @param {Object} options - Additional options
     * @param {number} [options.maxTags=5] - Maximum number of tags to generate
     * @returns {Promise<string[]>} Array of generated tags
     */
    async generate_tags(text: string, { maxTags = 2 } = {}) {
        try {
            const prompt = `Analyze the following text and extract up to ${maxTags} key tags that best represent its main topics. ` +
                `Return only a JSON array of tag strings, with no additional text or explanation.\n\n` +
                `Text: ${text.substring(0, 2000)}`; // Limit input length
            console.log('Tags Prompt: ', prompt);
            const response = await this.ollama.chat({
                model: this.model,
                messages: [
                    { 
                        role: 'system', 
                        content: 'You are a helpful assistant that analyzes text and extracts relevant single word tags. ' +
                                 'Return only comma separated tags, with no additional text or explanation.'
                    },
                    { role: 'user', content: prompt }
                ],
            });

            // TODO Parse the response from an array string into a list of strings.
            let tags = [];
            try {
                let content = response.message.content;
                console.log('Tags Response before split: ', content)
                tags = content.split(',').map(tag => tag.trim());
                console.log('Tags Response after split: ', tags)
                return tags;
            } catch (parseError) {
                console.error('LocalLLMTagGenerationError: Error parsing tags:', parseError);
                // Fallback to empty array if parsing fails
                return [];
            }
        } catch (error) {
            const message = "LocalLLMTagGenerationError: Failed to generate tags - " + error;
            console.error(message);
            throw new Error(message);
        }
    }

    /**
     * Generate quiz questions from a document title and summary
     * @param {string} title - The document title
     * @param {string} summary - The document summary
     * @returns {Promise<Question[]>} Array of 3 quiz questions
     */
    async generate_quiz(title: string, summary: string): Promise<Question[]> {
        try {
            const prompt = `Generate exactly 3 multiple-choice quiz questions based on the following document.

Document Title: ${title}

Document Summary: ${summary}

Return a JSON array with exactly 3 question objects. Each question must have:
- "questionText": A clear question about the document content
- "options": An array of exactly 4 answer choices
- "correctAnswerIndex": The index (0-3) of the correct answer

Requirements:
- Questions should test understanding, not just recall
- All 4 options should be plausible
- Only one answer should be correct
- Questions should cover different aspects of the document

Return ONLY the JSON array, nothing else. No markdown, no explanation.`;

            console.log('Quiz Prompt: ', prompt);
            const response = await this.ollama.chat({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a quiz generator that creates educational multiple-choice questions. You must return ONLY valid JSON with no additional text, markdown, or explanation.'
                    },
                    { role: 'user', content: prompt }
                ],
            });

            let content = response.message.content.trim();
            console.log('Quiz Response: ', content);

            // Try to extract JSON if wrapped in markdown code blocks
            const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch) {
                content = jsonMatch[1].trim();
            }

            // Parse and validate the response
            let questions: Question[];
            try {
                questions = JSON.parse(content);
            } catch (parseError) {
                console.error('LocalLLMQuizGenerationError: Failed to parse JSON:', parseError);
                throw new Error('Failed to parse quiz response as JSON');
            }

            // Validate structure
            if (!Array.isArray(questions) || questions.length !== 3) {
                throw new Error('Quiz response must be an array of exactly 3 questions');
            }

            for (let i = 0; i < questions.length; i++) {
                const q = questions[i];
                if (!q.questionText || typeof q.questionText !== 'string') {
                    throw new Error(`Question ${i + 1} missing valid questionText`);
                }
                if (!Array.isArray(q.options) || q.options.length !== 4) {
                    throw new Error(`Question ${i + 1} must have exactly 4 options`);
                }
                if (typeof q.correctAnswerIndex !== 'number' || q.correctAnswerIndex < 0 || q.correctAnswerIndex > 3) {
                    throw new Error(`Question ${i + 1} has invalid correctAnswerIndex`);
                }
            }

            return questions;
        } catch (error) {
            const message = "LocalLLMQuizGenerationError: Failed to generate quiz - " + error;
            console.error(message);
            throw new Error(message);
        }
    }
}

export default LocalLLM;
