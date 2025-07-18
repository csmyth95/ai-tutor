import { Ollama } from 'ollama'


class LocalLLM {
    /**
     * Initialize the LocalLLM client
     * @param {string} host - Base URL of the Ollama API (default: http://localhost:11434)
     * @param {string} model - The model to use for text generation (default: 'llama2')
     */
    constructor(host = 'http://llm:11434', model = 'gemma3:1b') {
        this.ollama = new Ollama({ host: host });
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
            const message = `Failed to initialize model ${this.model}: ${error.message}`;
            console.error(message);
            throw new Error(message);
        }
    }

    /**
     * Generate a summary of the input text
     * @param {string} text - The text to summarize
     * @param {number} [maxLength=150] - Maximum length of the summary
     * @param {number} [temperature=0.7] - Controls randomness (0-1)
     * @returns {Promise<string>} The generated summary
     */
    async summarise(text, maxLength = 150, temperature = 0.7) {
        try {
            const prompt = `Create a short, concise summary of the following text, keeping it under ${maxLength} characters and return nothing else. No pleasantries. Text: ${text}`;
            console.log('Summarise Prompt: ', prompt);
            const response = await this.ollama.chat({
                model: this.model,
                messages: [{ role: 'user', content: prompt }],
                temperature: temperature,
            })
            return response.message.content.trim().replace(',', '');
        } catch (error) {
            const message = "LocalLLMSummarisationError: Failed to generate summary - " + error.message;
            console.error(message);
            throw new Error(message);
        }
    }

    /**
     * Generate a title from a document with a max length of 25 characters which is configurable.
     * @param {string} text - The text to analyze
     * @param {Object} options - Additional options
     * @param {number} [options.maxLength=25] - Maximum length of the title
     * @param {number} [options.temperature=0.2] - Controls randomness (0-1), lower for more focused titles
     * @returns {Promise<string>} The generated title
     */
    async generate_title(text, { maxLength = 25, temperature = 0.2 } = {}) {
        try {
            const prompt = `Generate a concise title for this text, keeping it under ${maxLength} characters and return nothing else. No pleasantries. Text: ${text}`;
            console.log('Title Prompt: ', prompt);
            const response = await this.ollama.chat({
                model: this.model,
                messages: [{ role: 'user', content: prompt }],
                temperature: temperature,
            })
            return response.message.content.trim();
        } catch (error) {
            const message = "LocalLLMTitleGenerationError: Failed to generate title - " + error.message;
            console.error(message);
            throw new Error(message);
        }
    }
    /**
     * Generate a list of relevant tags for the input text
     * @param {string} text - The text to analyze
     * @param {Object} options - Additional options
     * @param {number} [options.maxTags=5] - Maximum number of tags to generate
     * @param {number} [options.temperature=0.2] - Controls randomness (0-1), lower for more focused tags
     * @returns {Promise<string[]>} Array of generated tags
     */
    async generate_tags(text, { maxTags = 2, temperature = 0.2 } = {}) {
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
                temperature: temperature
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
            const message = "LocalLLMTagGenerationError: Failed to generate tags - " + error.message;
            console.error(message);
            throw new Error(message);
        }
    }
}

export default LocalLLM;
