import React from "react";
import { FiMessageSquare, FiTruck, FiMapPin, FiCreditCard, FiShield } from "react-icons/fi";

const DEFAULT_PROMPTS = [
	{ text: "Where is your store located?", icon: FiMapPin },
	{ text: "What are your delivery options?", icon: FiTruck },
	{ text: "What payment methods do you accept?", icon: FiCreditCard },
	{ text: "What is your warranty policy?", icon: FiShield },
	{ text: "Show me living room chairs", icon: FiMessageSquare },
];

const ChatQuickPrompts = ({ dynamicPrompts = [], onSelectPrompt }) => {
	const promptsToRender = dynamicPrompts && dynamicPrompts.length > 0
		? dynamicPrompts.slice(0, 4)
		: DEFAULT_PROMPTS.map(p => p.text);

	return (
		<div className="px-4 py-2 border-t border-grey-100 bg-grey-50/50">
			<div className="text-[11px] font-medium text-grey-400 mb-1.5 flex items-center gap-1">
				Suggested Questions:
			</div>
			<div className="flex flex-wrap gap-1.5">
				{promptsToRender.map((promptText, idx) => (
					<button
						key={idx}
						onClick={() => onSelectPrompt(promptText)}
						className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-grey-700 bg-white border border-grey-200/90 hover:border-amber-600 hover:text-amber-800 hover:bg-amber-50/30 rounded-full transition-all duration-200 shadow-2xs text-left"
					>
						<span>{promptText}</span>
					</button>
				))}
			</div>
		</div>
	);
};

export default ChatQuickPrompts;
