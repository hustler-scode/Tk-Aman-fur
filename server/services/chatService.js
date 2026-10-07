const geminiService = require("./geminiService");
const { products, faqs, storeInfo } = require("../data/knowledgeBase");

/**
 * Chat Service
 * Handles business logic, query matching, backend information retrieval,
 * prompt construction with strict AI guardrails, and invoking Gemini Service.
 */
class ChatService {
	constructor() {
		// Strict system instructions for Gemini AI persona & grounding constraints
		this.SYSTEM_INSTRUCTION = `You are the official AI Customer Support Assistant for "TK Craft", a handcrafted luxury & architectural furniture brand based in Addis Ababa, Ethiopia.

STRICT BEHAVIORAL RULES AND BOUNDARIES:
1. TRUTHFULNESS & GROUNDING: You MUST answer customer questions ONLY using the exact information provided in the "BACKGROUND CONTEXT & KNOWLEDGE BASE" section below.
2. NO HALLUCINATION: If the requested information is not available in the provided context, clearly tell the customer that you do not have that specific information in your records, and invite them to contact our human support team at contact@tkcraft.et or +251 911 234 567. NEVER invent or assume prices, materials, dimensions, policies, or product availability.
3. BRAND VOICE: Be warm, professional, architectural, elegant, and helpful. 
4. PRICING & CURRENCY: Always format prices in Ethiopian Birr (ETB / Birr) as provided (e.g., "34,900 Birr").
5. STORE LOCATION: Always reference our showroom location accurately (Unity University Gerji Campus, Bole Sub-City, Addis Ababa, near Korean Hospital MCM) when asked about physical locations.
6. FORMATTING: Use clean bullet points and bold text where appropriate for readability.`;
	}

	/**
	 * Processes a customer's message and returns AI answer along with matched products & metadata.
	 *
	 * @param {Object} payload
	 * @param {string} payload.message - Customer message.
	 * @param {Array} payload.conversationHistory - Multi-turn chat history.
	 * @returns {Promise<Object>} Processed response object containing AI text, matched products, and quick suggestions.
	 */
	async processChatMessage({ message, conversationHistory = [] }) {
		if (!message || typeof message !== "string" || message.trim() === "") {
			throw new Error("Message parameter is required and cannot be empty.");
		}

		const cleanQuery = message.trim();

		// 1. Retrieve relevant Knowledge Base Context
		const { contextString, matchedProducts, matchedFaqs, requiresHumanEscalation } =
			this._retrieveKnowledgeContext(cleanQuery);

		// 2. Invoke Gemini Service with strict system prompt & retrieved context
		const aiResponseText = await geminiService.generateChatResponse({
			systemInstruction: this.SYSTEM_INSTRUCTION,
			userMessage: cleanQuery,
			retrievedContext: contextString,
			conversationHistory: conversationHistory.slice(-6) // Keep last 6 turns for context efficiency
		});

		// 3. Format response payload for React frontend
		return {
			success: true,
			reply: aiResponseText,
			timestamp: new Date().toISOString(),
			matchedProducts: matchedProducts,
			matchedFaqs: matchedFaqs.map(f => f.question),
			requiresHumanEscalation: requiresHumanEscalation,
			suggestedPrompts: this._generateNextSuggestedPrompts(cleanQuery, matchedProducts)
		};
	}

	/**
	 * Retrieves relevant products, FAQs, and store information matching user query keywords.
	 */
	_retrieveKnowledgeContext(query) {
		const lowerQuery = query.toLowerCase();

		const STOP_WORDS = new Set([
			"a", "an", "the", "and", "or", "but", "is", "are", "was", "were", "be", "been", "being",
			"in", "on", "at", "to", "for", "with", "about", "against", "between", "into", "through",
			"during", "before", "after", "above", "below", "from", "up", "down", "over", "under",
			"then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both",
			"each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only",
			"own", "same", "so", "than", "too", "very", "can", "will", "just", "should", "now",
			"you", "your", "yours", "do", "does", "did", "have", "has", "had", "what", "which",
			"who", "whom", "this", "that", "these", "those", "tell", "show", "give"
		]);

		// Keyword tokenization with stop-words removal
		const tokens = lowerQuery
			.replace(/[^\w\s]/gi, "")
			.split(/\s+/)
			.filter(t => t.length > 2 && !STOP_WORDS.has(t));

		// 1. Search Products
		const matchedProducts = products.filter(p => {
			const textToSearch = `${p.name} ${p.category} ${p.material} ${p.description} ${p.materialsDescription} ${p.keywords.join(" ")}`.toLowerCase();
			return tokens.some(token => textToSearch.includes(token));
		});

		// 2. Search FAQs
		const matchedFaqs = faqs.filter(f => {
			const textToSearch = `${f.question} ${f.answer} ${f.category} ${f.keywords.join(" ")}`.toLowerCase();
			return tokens.some(token => textToSearch.includes(token));
		});

		// 3. Check for general store/location/contact questions
		const isStoreQuery = tokens.some(t =>
			["location", "where", "address", "gerji", "hours", "contact", "phone", "email", "open", "showroom", "store"].includes(t)
		);

		// 4. Check for human escalation triggers
		const isEscalationQuery = tokens.some(t =>
			["human", "agent", "person", "representative", "speak", "complaint", "manager", "dispute"].includes(t)
		);

		// Build structured context text for Gemini
		let contextParts = [];

		// Always include Store Info for grounding context
		contextParts.push(`--- STORE & SHOWROOM INFORMATION ---
Name: ${storeInfo.name}
Address: ${storeInfo.address}, ${storeInfo.city}, ${storeInfo.country}
Landmark: ${storeInfo.landmark}
Coordinates: ${storeInfo.coordinates}
Phone: ${storeInfo.phone} | Mobile: ${storeInfo.phoneMobile}
Email: ${storeInfo.email}
Hours: ${storeInfo.operatingHours.monSat} | ${storeInfo.operatingHours.sun}
SLA: ${storeInfo.responseSLA}`);

		// Add Matched Products
		if (matchedProducts.length > 0) {
			const productDetails = matchedProducts.slice(0, 4).map(p => 
`[PRODUCT MATCH]
Name: ${p.name} (ID: ${p.id})
Category: ${p.category} | Material: ${p.material}
Price: ${p.price.toLocaleString()} ETB (Old Price: ${p.oldPrice ? p.oldPrice.toLocaleString() + " ETB" : "N/A"})
Status: ${p.inStock ? "In Stock" : "Out of Stock"} | Rating: ${p.rating}/5.0 (${p.badge || "Standard"})
Dimensions: ${p.dimensions}
Materials: ${p.materialsDescription}
Description: ${p.description}
Craftsmanship: ${p.craftsmanship}
Care Notes: ${p.careNotes}`
			).join("\n\n");

			contextParts.push(`--- MATCHED FURNITURE PRODUCTS (${matchedProducts.length}) ---\n${productDetails}`);
		} else if (!isStoreQuery && matchedFaqs.length === 0) {
			// If no direct product or FAQ matched, provide brief catalog summary for reference
			const productCatalogSummary = products.map(p => `- ${p.name} (${p.category}, ${p.price.toLocaleString()} Birr, Material: ${p.material})`).join("\n");
			contextParts.push(`--- ALL AVAILABLE PRODUCTS SUMMARY ---\n${productCatalogSummary}`);
		}

		// Add Matched FAQs
		if (matchedFaqs.length > 0) {
			const faqDetails = matchedFaqs.slice(0, 3).map(f =>
`[FAQ MATCH - ${f.category}]
Q: ${f.question}
A: ${f.answer}`
			).join("\n\n");

			contextParts.push(`--- RELEVANT FREQUENTLY ASKED QUESTIONS ---\n${faqDetails}`);
		} else {
			// Include general policy FAQs as default baseline
			const baselineFaqs = faqs.slice(0, 4).map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
			contextParts.push(`--- GENERAL BUSINESS POLICIES & FAQS ---\n${baselineFaqs}`);
		}

		// Flag if no specific item or policy matched query
		if (matchedProducts.length === 0 && matchedFaqs.length === 0 && !isStoreQuery) {
			contextParts.push(`--- NOTICE FOR AI ---
NOTE: The customer query "${query}" did not directly match a specific product or policy entry in our database. If this is a request for items or services outside our catalog or unknown policies, state politely that you do not have this information and recommend contacting contact@tkcraft.et.`);
		}

		return {
			contextString: contextParts.join("\n\n"),
			matchedProducts: matchedProducts.slice(0, 4),
			matchedFaqs: matchedFaqs,
			requiresHumanEscalation: isEscalationQuery
		};
	}

	/**
	 * Generates dynamic quick response suggestion prompts based on the context.
	 */
	_generateNextSuggestedPrompts(query, matchedProducts) {
		if (matchedProducts && matchedProducts.length > 0) {
			return [
				`Tell me more about ${matchedProducts[0].name}`,
				"What are your delivery options?",
				"What payment methods do you accept?",
				"Can I customize the dimensions?"
			];
		}

		const lower = query.toLowerCase();
		if (lower.includes("deliver") || lower.includes("ship")) {
			return [
				"Do you offer free assembly?",
				"How long does delivery take in Addis Ababa?",
				"What is your return policy?"
			];
		}

		if (lower.includes("price") || lower.includes("cost") || lower.includes("payment")) {
			return [
				"Do you accept Telebirr or CBE Birr?",
				"Is cash on delivery available?",
				"Show me living room furniture"
			];
		}

		return [
			"What are your delivery options?",
			"Where is your store located?",
			"Show me lounge chairs",
			"What is your warranty policy?"
		];
	}
}

module.exports = new ChatService();
