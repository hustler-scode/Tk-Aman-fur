const chatService = require("../services/chatService");
const { products, faqs, storeInfo } = require("../data/knowledgeBase");

/**
 * Chat Controller
 * Handles HTTP requests for chatbot endpoints.
 */

// POST /api/chat - Main chatbot message endpoint
exports.handleChatMessage = async (req, res) => {
	try {
		const { message, conversationHistory } = req.body;

		if (!message || typeof message !== "string" || message.trim() === "") {
			return res.status(400).json({
				success: false,
				error: "Invalid request payload. 'message' string is required."
			});
		}

		const result = await chatService.processChatMessage({
			message,
			conversationHistory: Array.isArray(conversationHistory) ? conversationHistory : []
		});

		return res.status(200).json(result);
	} catch (error) {
		console.error("[ChatController Error]:", error);
		return res.status(500).json({
			success: false,
			error: "An error occurred while processing your request.",
			details: error.message
		});
	}
};

// GET /api/chat/faqs - Retrieve all FAQs categorized
exports.getAllFaqs = async (req, res) => {
	try {
		return res.status(200).json({
			success: true,
			count: faqs.length,
			faqs: faqs
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: "Failed to fetch FAQs"
		});
	}
};

// GET /api/chat/products - Retrieve products catalog for chatbot
exports.getProductsCatalog = async (req, res) => {
	try {
		const { category, search } = req.query;

		let result = [...products];

		if (category && category !== "All") {
			result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
		}

		if (search) {
			const s = search.toLowerCase();
			result = result.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
		}

		return res.status(200).json({
			success: true,
			count: result.length,
			products: result
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: "Failed to fetch products"
		});
	}
};

// GET /api/chat/health - API Health check endpoint
exports.getHealthCheck = (req, res) => {
	const hasApiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here");
	return res.status(200).json({
		status: "online",
		service: "TK Craft Gemini AI Chatbot Service",
		geminiConfigured: hasApiKey,
		timestamp: new Date().toISOString()
	});
};
