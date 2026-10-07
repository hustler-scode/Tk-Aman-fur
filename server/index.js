const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const chatRoutes = require("./routes/chatRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
	origin: "*", // Allows requests from React frontend
	methods: ["GET", "POST", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// API Routes
app.use("/api", chatRoutes);

// Root Health Check
app.get("/", (req, res) => {
	res.json({
		name: "TK Craft Furniture Backend API",
		status: "running",
		endpoints: {
			chat: "POST /api/chat",
			faqs: "GET /api/chat/faqs",
			products: "GET /api/chat/products",
			health: "GET /api/chat/health"
		}
	});
});

// Error handling for 404
app.use((req, res) => {
	res.status(404).json({ error: "Endpoint not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
	console.error("[Unhandled Server Error]:", err);
	res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// Start Server
app.listen(PORT, () => {
	console.log(`=======================================================`);
	console.log(`🚀 TK Craft Furniture Backend running on http://localhost:${PORT}`);
	console.log(`💬 Gemini Chatbot API ready at http://localhost:${PORT}/api/chat`);
	console.log(`=======================================================`);
});

module.exports = app;
