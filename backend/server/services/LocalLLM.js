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
     * @param {Object} options - Additional options for the generation
     * @param {number} [options.maxLength=150] - Maximum length of the summary
     * @param {number} [options.temperature=0.7] - Controls randomness (0-1)
     * @returns {Promise<string>} The generated summary
     */
    async summarise(text, { maxLength = 150, temperature = 0.7 } = {}) {
        try {
            const prompt = `Please provide a concise summary of the following text, keeping it under ${maxLength} characters:\n\n${text}`;
            const response = await this.ollama.chat({
                model: this.model,
                messages: [{ role: 'user', content: prompt }],
                temperature: temperature,
            })
            return response.message.content.trim();
        } catch (error) {
            const message = "LocalLLMSummarisationError: Failed to generate summary - " + error.message;
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
    async generate_tags(text, { maxTags = 5, temperature = 0.2 } = {}) {
        try {
            const prompt = `Analyze the following text and extract ${maxTags} key tags that best represent its main topics. ` +
                `Return only a JSON array of tag strings, with no additional text or explanation.\n\n` +
                `Text: ${text.substring(0, 2000)}`; // Limit input length

            const response = await this.ollama.chat({
                model: this.model,
                messages: [
                    { 
                        role: 'system', 
                        content: 'You are a helpful assistant that analyzes text and extracts relevant tags. ' +
                                'Return only a JSON array of tag strings, with no additional text or explanation.'
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: temperature,
                format: 'json'
            });

            // Parse the response and ensure it's an array of strings
            let tags = [];
            try {
                const content = response.message.content.trim();
                // Handle cases where the response might be wrapped in markdown code blocks
                const jsonMatch = content.match(/\[.*\]/s);
                tags = JSON.parse(jsonMatch ? jsonMatch[0] : content);
                
                // Ensure we have an array of strings
                if (!Array.isArray(tags)) {
                    tags = [];
                }
                
                // Clean and format tags
                tags = tags
                    .filter(tag => tag && typeof tag === 'string')
                    .map(tag => 
                        tag.trim()
                           .toLowerCase()
                           .replace(/[^\w\s-]/g, '') // Remove special chars
                           .replace(/\s+/g, '-')      // Replace spaces with hyphens
                    )
                    .filter((tag, index, self) => 
                        tag.length > 0 && // Remove empty tags
                        self.indexOf(tag) === index // Remove duplicates
                    )
                    .slice(0, maxTags); // Ensure we don't exceed maxTags
            } catch (parseError) {
                console.error('LocalLLMTagGenerationError: Error parsing tags:', parseError);
                // Fallback to empty array if parsing fails
                return [];
            }
            return tags;
        } catch (error) {
            const message = "LocalLLMTagGenerationError: Failed to generate tags - " + error.message;
            console.error(message);
            throw new Error(message);
        }
    }
}

export default LocalLLM;
