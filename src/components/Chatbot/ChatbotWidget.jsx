import React, { useState, useEffect, useRef } from "react";
import {
	FiX,
	FiSend,
	FiRotateCcw
} from "react-icons/fi";
import { RiRobotLine } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi";
import ChatMessage from "./ChatMessage";
import ChatQuickPrompts from "./ChatQuickPrompts";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const INITIAL_WELCOME_MESSAGE = {
	id: "welcome-1",
	role: "assistant",
	content:
		"Hello! 👋 Welcome to **TK Craft Handcrafted Furniture**.\n\nI am your AI assistant powered by Gemini. I can help you with:\n- **Products & Pricing** (materials, dimensions, colors)\n- **Showroom Location & Hours** (Gerji Campus, Addis Ababa)\n- **Delivery & Shipping** (Addis Ababa & nationwide Ethiopia)\n- **Payment Options** (Telebirr, CBE Birr, Cash, Cards)\n- **Warranty & Returns** (Lifetime structural warranty)\n\nHow can I help you today?",
	matchedProducts: [],
	timestamp: new Date().toISOString(),
};

const ChatbotWidget = ({ onSelectProduct, onInquire, onNavigate }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [inputMessage, setInputMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [hasUnread, setHasUnread] = useState(true);
	const [messages, setMessages] = useState(() => {
		try {
			const saved = sessionStorage.getItem("tkcraft_chat_history");
			return saved ? JSON.parse(saved) : [INITIAL_WELCOME_MESSAGE];
		} catch (e) {
			return [INITIAL_WELCOME_MESSAGE];
		}
	});
	const [suggestedPrompts, setSuggestedPrompts] = useState([]);

	const messagesEndRef = useRef(null);
	const inputRef = useRef(null);

	// Persist messages to session storage
	useEffect(() => {
		try {
			sessionStorage.setItem("tkcraft_chat_history", JSON.stringify(messages));
		} catch (e) {
			// ignore session storage error
		}
	}, [messages]);

	// Auto scroll to bottom of chat
	useEffect(() => {
		if (isOpen) {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, isOpen, isLoading]);

	// Focus input on open
	useEffect(() => {
		if (isOpen) {
			setHasUnread(false);
			setTimeout(() => {
				inputRef.current?.focus();
			}, 200);
		}
	}, [isOpen]);

	const handleSendMessage = async (textToSend) => {
		const queryText = textToSend || inputMessage;
		if (!queryText || queryText.trim() === "" || isLoading) return;

		const userMsg = {
			id: `user-${Date.now()}`,
			role: "user",
			content: queryText.trim(),
			timestamp: new Date().toISOString(),
		};

		// Add user message to UI
		setMessages((prev) => [...prev, userMsg]);
		setInputMessage("");
		setIsLoading(true);

		// Format history for backend
		const historyForBackend = messages
			.filter((m) => m.role === "user" || m.role === "assistant")
			.map((m) => ({
				role: m.role,
				content: m.content,
			}));

		try {
			// Call backend Chat API
			const response = await fetch(`${API_BASE_URL}/api/chat`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: queryText.trim(),
					conversationHistory: historyForBackend,
				}),
			});

			if (!response.ok) {
				throw new Error(`Server returned HTTP ${response.status}`);
			}

			const data = await response.json();

			if (data && data.success) {
				const aiMsg = {
					id: `ai-${Date.now()}`,
					role: "assistant",
					content: data.reply,
					matchedProducts: data.matchedProducts || [],
					requiresHumanEscalation: data.requiresHumanEscalation || false,
					timestamp: data.timestamp || new Date().toISOString(),
				};

				setMessages((prev) => [...prev, aiMsg]);
				if (data.suggestedPrompts) {
					setSuggestedPrompts(data.suggestedPrompts);
				}
			} else {
				throw new Error(data.error || "Failed to receive response from chat service");
			}
		} catch (error) {
			console.error("[ChatbotWidget Error]:", error);

			// Fallback message if backend or network fails
			const errorMsg = {
				id: `error-${Date.now()}`,
				role: "assistant",
				content:
					"I am currently having trouble connecting to our backend server. Please verify the backend is running on `http://localhost:5000` or contact us directly at **contact@tkcraft.et** or **+251 911 234 567**.",
				requiresHumanEscalation: true,
				timestamp: new Date().toISOString(),
			};
			setMessages((prev) => [...prev, errorMsg]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const handleResetChat = () => {
		if (window.confirm("Are you sure you want to clear this conversation history?")) {
			setMessages([INITIAL_WELCOME_MESSAGE]);
			setSuggestedPrompts([]);
			try {
				sessionStorage.removeItem("tkcraft_chat_history");
			} catch (e) {}
		}
	};

	return (
		<div className="fixed bottom-5 right-5 z-50 font-sans">
			{/* Floating Chat Trigger Button */}
			{!isOpen && (
				<button
					onClick={() => setIsOpen(true)}
					className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-primary-900 via-primary-800 to-amber-900 text-white rounded-full shadow-2xl hover:shadow-amber-900/30 hover:scale-105 active:scale-95 transition-all duration-300 border border-amber-500/30 cursor-pointer"
					aria-label="Open AI Furniture Assistant"
				>
					<div className="relative">
						<HiSparkles className="w-5 h-5 text-amber-300 animate-pulse" />
						{hasUnread && (
							<span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-primary-900" />
						)}
					</div>
					<span className="text-sm font-medium tracking-wide pr-1">
						Ask TK Craft AI
					</span>
				</button>
			)}

			{/* Chat Modal Window */}
			{isOpen && (
				<div className="w-[370px] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-grey-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
					{/* Header */}
					<div className="bg-primary-900 text-white p-4 flex items-center justify-between shadow-sm border-b border-primary-800">
						<div className="flex items-center gap-3">
							<div className="w-9 h-9 rounded-full bg-amber-800/80 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 shadow-inner">
								<RiRobotLine className="w-5 h-5" />
							</div>
							<div>
								<div className="font-semibold text-sm leading-tight flex items-center gap-1.5">
									<span>TK Craft Assistant</span>
									<span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
										Gemini AI
									</span>
								</div>
								<div className="text-[11px] text-grey-300 flex items-center gap-1.5 mt-0.5">
									<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
									<span>Online • Official Furniture Bot</span>
								</div>
							</div>
						</div>

						{/* Header Controls */}
						<div className="flex items-center gap-1">
							<button
								onClick={handleResetChat}
								title="Reset Conversation"
								className="p-1.5 text-grey-300 hover:text-white hover:bg-primary-800 rounded-lg transition-colors"
							>
								<FiRotateCcw className="w-4 h-4" />
							</button>
							<button
								onClick={() => setIsOpen(false)}
								title="Minimize Chat"
								className="p-1.5 text-grey-300 hover:text-white hover:bg-primary-800 rounded-lg transition-colors"
							>
								<FiX className="w-5 h-5" />
							</button>
						</div>
					</div>

					{/* Messages Body */}
					<div className="flex-1 overflow-y-auto p-4 bg-grey-50/60 scroll-smooth">
						{messages.map((msg) => (
							<ChatMessage
								key={msg.id}
								message={msg}
								onSelectProduct={(id) => {
									if (onSelectProduct) onSelectProduct(id);
								}}
								onInquire={onInquire}
								onNavigate={onNavigate}
							/>
						))}

						{/* Typing / Loading Indicator */}
						{isLoading && (
							<div className="flex items-center gap-2 text-grey-400 text-xs my-2 ml-2">
								<div className="w-7 h-7 rounded-full bg-primary-900 text-amber-300 flex items-center justify-center text-xs">
									<RiRobotLine className="w-4 h-4" />
								</div>
								<div className="bg-white border border-grey-200/80 rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center gap-1.5 shadow-xs">
									<span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce" />
									<span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce [animation-delay:0.2s]" />
									<span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce [animation-delay:0.4s]" />
									<span className="text-[11px] text-grey-500 font-medium ml-1">
										Searching knowledge base...
									</span>
								</div>
							</div>
						)}

						<div ref={messagesEndRef} />
					</div>

					{/* Dynamic Quick Prompt Chips */}
					<ChatQuickPrompts
						dynamicPrompts={suggestedPrompts}
						onSelectPrompt={(pText) => handleSendMessage(pText)}
					/>

					{/* Input Footer */}
					<div className="p-3 bg-white border-t border-grey-200">
						<div className="flex items-center gap-2">
							<input
								ref={inputRef}
								type="text"
								value={inputMessage}
								onChange={(e) => setInputMessage(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="Ask about products, prices, delivery..."
								disabled={isLoading}
								className="flex-1 px-3.5 py-2.5 text-xs text-grey-800 placeholder-grey-400 bg-grey-50 border border-grey-300 focus:border-amber-600 focus:bg-white focus:outline-none rounded-xl transition-all"
							/>
							<button
								onClick={() => handleSendMessage()}
								disabled={isLoading || !inputMessage.trim()}
								className={`p-2.5 rounded-xl font-medium text-white transition-all duration-200 shrink-0 ${
									isLoading || !inputMessage.trim()
										? "bg-grey-300 cursor-not-allowed text-grey-500"
										: "bg-amber-800 hover:bg-amber-900 active:scale-95 shadow-sm cursor-pointer text-white"
								}`}
							>
								<FiSend className="w-4 h-4" />
							</button>
						</div>
						<div className="text-[10px] text-grey-400 text-center mt-2 flex items-center justify-center gap-1">
							<span>Official TK Craft AI</span>
							<span>•</span>
							<span>Strict grounded responses from catalog & FAQs</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ChatbotWidget;
