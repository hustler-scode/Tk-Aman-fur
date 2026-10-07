const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// Router definition
router.post("/chat", chatController.handleChatMessage);
router.get("/chat/faqs", chatController.getAllFaqs);
router.get("/chat/products", chatController.getProductsCatalog);
router.get("/chat/health", chatController.getHealthCheck);

module.exports = router;
