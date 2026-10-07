const { getApiKey, GEMINI_MODEL, DEFAULT_CONFIG } = require("../config/geminiConfig");

/**
 * Gemini Service
 * Dedicated service responsible for communicating with the Gemini API securely.
 * The API key is stored strictly in backend environment variables.
 */
class GeminiService {
	/**
	 * Generate natural AI response from Gemini model given system instructions,
	 * user prompt, context payload, and conversation history.
	 *
	 * @param {Object} params
	 * @param {string} params.systemInstruction - Strict persona and boundaries instructions.
	 * @param {string} params.userMessage - Current question from customer.
	 * @param {string} params.retrievedContext - Relevant products, FAQs, store info retrieved from backend.
	 * @param {Array} params.conversationHistory - Recent user/assistant conversation history turns.
	 * @returns {Promise<string>} Generated response text from Gemini AI.
	 */
	async generateChatResponse({ systemInstruction, userMessage, retrievedContext, conversationHistory = [] }) {
		const apiKey = getApiKey();

		// Check if valid API key is present
		if (!apiKey || apiKey === "your_gemini_api_key_here") {
			console.warn("[GeminiService] No valid GEMINI_API_KEY found. Using backend smart fallback answer generator.");
			return this._generateSmartFallback({ userMessage, retrievedContext });
		}

		try {
			// Try official @google/genai SDK first
			let GoogleGenAI;
			try {
				const genaiPkg = require("@google/genai");
				GoogleGenAI = genaiPkg.GoogleGenAI;
			} catch (e) {
				// SDK import fallback
			}

			if (GoogleGenAI) {
				const ai = new GoogleGenAI({ apiKey });
				
				// Format conversation turns into text context
				const historyText = conversationHistory.length > 0
					? conversationHistory.map(item => `${item.role === 'user' ? 'Customer' : 'Assistant'}: ${item.content}`).join('\n')
					: '';

				const fullPrompt = `BACKGROUND CONTEXT & KNOWLEDGE BASE:
${retrievedContext}

${historyText ? `PREVIOUS CONVERSATION:\n${historyText}\n` : ''}
CUSTOMER QUESTION:
${userMessage}
`;

				const result = await ai.models.generateContent({
					model: GEMINI_MODEL,
					contents: fullPrompt,
					config: {
						systemInstruction: systemInstruction,
						temperature: DEFAULT_CONFIG.temperature,
						topP: DEFAULT_CONFIG.topP,
						maxOutputTokens: DEFAULT_CONFIG.maxOutputTokens,
					}
				});

				if (result && result.text) {
					return result.text;
				}
			}

			// Direct REST Fallback if SDK structure differs or fails
			return await this._callGeminiRestApi({
				apiKey,
				systemInstruction,
				userMessage,
				retrievedContext,
				conversationHistory
			});

		} catch (error) {
			console.error("[GeminiService Error]:", error.message || error);
			
			// Attempt REST API fallback if SDK failed
			try {
				return await this._callGeminiRestApi({
					apiKey,
					systemInstruction,
					userMessage,
					retrievedContext,
					conversationHistory
				});
			} catch (restErr) {
				console.error("[GeminiService REST Fallback Error]:", restErr.message || restErr);
				return this._generateSmartFallback({ userMessage, retrievedContext });
			}
		}
	}

	/**
	 * Direct REST API fallback calling Google Gemini API endpoint securely.
	 */
	async _callGeminiRestApi({ apiKey, systemInstruction, userMessage, retrievedContext, conversationHistory = [] }) {
		const modelsToTry = [GEMINI_MODEL, "gemini-1.5-flash", "gemini-2.5-flash"];
		const historyText = conversationHistory.length > 0
			? conversationHistory.map(item => `${item.role === 'user' ? 'Customer' : 'Assistant'}: ${item.content}`).join('\n')
			: '';

		const fullPrompt = `SYSTEM INSTRUCTION: ${systemInstruction}\n\nRELEVANT FURNITURE KNOWLEDGE BASE:\n${retrievedContext}\n\n${historyText ? `PREVIOUS CHAT:\n${historyText}\n` : ''}CUSTOMER QUESTION: ${userMessage}`;

		let lastError = null;
		for (const modelName of modelsToTry) {
			try {
				const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
				const payload = {
					contents: [
						{
							parts: [{ text: fullPrompt }]
						}
					],
					generationConfig: {
						temperature: DEFAULT_CONFIG.temperature,
						maxOutputTokens: DEFAULT_CONFIG.maxOutputTokens
					}
				};

				const response = await fetch(url, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload)
				});

				if (!response.ok) {
					const errorData = await response.text();
					throw new Error(`HTTP ${response.status}: ${errorData}`);
				}

				const data = await response.json();
				const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

				if (candidateText) {
					return candidateText;
				}
			} catch (err) {
				lastError = err;
			}
		}

		throw lastError || new Error("All Gemini REST API endpoints failed");
	}

	/**
	 * Smart fallback response mechanism when API key is missing or offline,
	 * ensuring the backend ALWAYS returns reliable, natural answers based on knowledge base.
	 */
	_generateSmartFallback({ userMessage, retrievedContext }) {
		if (retrievedContext.includes("NOTICE FOR AI")) {
			return `Thank you for contacting **TK Craft**! I do not have specific information in our database regarding **"${userMessage}"**.\n\nWe are a catalog-led handcrafted furniture workshop specializing in architectural tables, lounge seating, storage, and ambient lighting. If you have questions regarding our furniture catalog, materials, custom sizes, or delivery, please let me know or contact our team at **contact@tkcraft.et** or **+251 911 234 567**.`;
		}

		// Extract matched products if available
		if (retrievedContext.includes("[PRODUCT MATCH]")) {
			const productBlocks = retrievedContext.match(/\[PRODUCT MATCH\][\s\S]*?(?=\n\[PRODUCT MATCH\]|\n---|$)/g);
			if (productBlocks && productBlocks.length > 0) {
				const topProduct = productBlocks[0];
				const name = topProduct.match(/Name: (.*?) \(ID/)?.[1] || "Furniture Item";
				const price = topProduct.match(/Price: (.*?)\n/)?.[1] || "";
				const desc = topProduct.match(/Description: (.*?)\n/)?.[1] || "";
				const dims = topProduct.match(/Dimensions: (.*?)\n/)?.[1] || "";
				const mat = topProduct.match(/Materials: (.*?)\n/)?.[1] || "";

				return `**${name}**\n\n💰 **Price:** ${price}\n📐 **Dimensions:** ${dims}\n🪵 **Materials:** ${mat}\n\n📝 **Description:** ${desc}\n\nFeel free to ask about custom dimensions or delivery options in Addis Ababa!`;
			}
		}

		// Extract matched FAQ if available
		if (retrievedContext.includes("[FAQ MATCH")) {
			const faqMatches = retrievedContext.match(/Q: (.*?)\nA: (.*?)(?=\n\n|\n\[|$)/gs);
			if (faqMatches && faqMatches.length > 0) {
				const cleanedFaq = faqMatches[0]
					.replace(/Q: /g, "**Question:** ")
					.replace(/\nA: /g, "\n\n**Answer:** ");
				return `Here is the official information from our TK Craft database:\n\n${cleanedFaq}\n\nFor further questions or custom interior inquiries, feel free to ask or contact us at **contact@tkcraft.et**!`;
			}
		}

		// Extract Store info if store query
		if (retrievedContext.includes("--- STORE & SHOWROOM INFORMATION ---")) {
			const lowerMsg = userMessage.toLowerCase();
			if (lowerMsg.includes("where") || lowerMsg.includes("location") || lowerMsg.includes("address") || lowerMsg.includes("hour")) {
				return `**TK Craft Showroom & Hours:**\n\n📍 **Location:** Unity University Gerji Campus, Bole Sub-City, Addis Ababa, Ethiopia (near Korean Hospital MCM).\n⏰ **Hours:** Monday – Saturday: 9:00 AM – 6:00 PM (Sunday closed / by appointment only).\n📞 **Phone:** +251 (0)11 629 8154 | +251 911 234 567\n✉️ **Email:** contact@tkcraft.et`;
			}
		}

		return `Here is the official information from our TK Craft database regarding your question:\n\nWe specialize in handcrafted architectural furniture built with 100% FSC-certified timber and lifetime structural warranty.\n\nFeel free to ask about specific products, delivery options in Addis Ababa, payment methods (Telebirr/CBE Birr), or custom dimensions!`;
	}
}

module.exports = new GeminiService();
