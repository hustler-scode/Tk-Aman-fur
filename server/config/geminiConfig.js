const dotenv = require("dotenv");
dotenv.config();

/**
 * Gemini API Configuration
 * Securely retrieves API key from environment variables.
 * Never exposes the key to the client/frontend.
 */
const getApiKey = () => {
	const key = process.env.GEMINI_API_KEY;
	if (!key || key === "your_gemini_api_key_here") {
		console.warn(
			"[GeminiConfig Warning] GEMINI_API_KEY is not configured or using default placeholder in .env"
		);
	}
	return key;
};

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const DEFAULT_CONFIG = {
	temperature: 0.3, // Low temperature for highly factual, precise response relying on provided context
	topP: 0.8,
	topK: 40,
	maxOutputTokens: 1024,
};

module.exports = {
	getApiKey,
	GEMINI_MODEL,
	DEFAULT_CONFIG,
};
