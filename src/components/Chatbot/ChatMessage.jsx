import React from "react";
import { FiUser, FiChevronRight, FiPhoneCall, FiMail, FiCheckCircle } from "react-icons/fi";
import { RiRobotLine } from "react-icons/ri";

const ChatMessage = ({ message, onSelectProduct, onInquire, onNavigate }) => {
	const isUser = message.role === "user";

	// Simple helper to parse basic markdown-like bold (**text**) and line breaks
	const renderFormattedText = (text) => {
		if (!text) return null;
		
		const paragraphs = text.split("\n\n");
		return paragraphs.map((para, pIdx) => {
			const lines = para.split("\n");
			return (
				<p key={pIdx} className={pIdx > 0 ? "mt-2.5" : ""}>
					{lines.map((line, lIdx) => {
						// Check bullet points
						const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ");
						const cleanLine = isBullet ? line.trim().substring(2) : line;

						// Simple bold replacement
						const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
						const lineContent = parts.map((part, idx) => {
							if (part.startsWith("**") && part.endsWith("**")) {
								return (
									<strong key={idx} className="font-semibold text-primary-900">
										{part.slice(2, -2)}
									</strong>
								);
							}
							return part;
						});

						return (
							<React.Fragment key={lIdx}>
								{lIdx > 0 && <br />}
								{isBullet ? (
									<span className="flex items-start gap-1.5 ml-1 my-0.5">
										<span className="text-primary-600 mt-1">•</span>
										<span>{lineContent}</span>
									</span>
								) : (
									lineContent
								)}
							</React.Fragment>
						);
					})}
				</p>
			);
		});
	};

	return (
		<div className={`flex gap-3 my-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
			{/* Avatar */}
			<div
				className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 font-medium ${
					isUser
						? "bg-amber-700 text-white shadow-sm"
						: "bg-primary-900 text-amber-400 border border-primary-700 shadow-sm"
				}`}
			>
				{isUser ? <FiUser className="w-4 h-4" /> : <RiRobotLine className="w-4 h-4" />}
			</div>

			{/* Bubble */}
			<div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
				isUser
					? "bg-amber-700 text-white rounded-tr-none shadow-sm"
					: "bg-white text-grey-800 border border-grey-200/80 rounded-tl-none shadow-sm"
			}`}>
				{/* Sender label */}
				<div className={`text-[10px] font-medium tracking-wide mb-1 ${
					isUser ? "text-amber-200 text-right" : "text-grey-400"
				}`}>
					{isUser ? "You" : "TK Craft AI"}
				</div>

				{/* Content */}
				<div className="whitespace-pre-line">
					{renderFormattedText(message.content)}
				</div>

				{/* Embedded Product Cards (if matches returned by backend) */}
				{message.matchedProducts && message.matchedProducts.length > 0 && (
					<div className="mt-3.5 pt-3 border-t border-grey-100">
						<div className="text-xs font-semibold text-grey-600 mb-2 flex items-center gap-1">
							<FiCheckCircle className="text-amber-600 w-3.5 h-3.5" /> Recommended Furniture Products:
						</div>
						<div className="space-y-2">
							{message.matchedProducts.map((product) => (
								<div
									key={product.id}
									className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-grey-50 border border-grey-200/60 hover:border-amber-500/40 transition-colors"
								>
									<div className="min-w-0 flex-1">
										<div className="font-semibold text-grey-900 text-xs truncate">
											{product.name}
										</div>
										<div className="text-[11px] text-grey-500 flex items-center gap-2 mt-0.5">
											<span>{product.category}</span>
											<span>•</span>
											<span className="font-medium text-amber-800">
												{Number(product.price).toLocaleString()} Birr
											</span>
										</div>
									</div>

									<button
										onClick={() => onSelectProduct && onSelectProduct(product.id)}
										className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-white bg-primary-900 hover:bg-primary-800 rounded-lg shrink-0 transition-colors shadow-xs"
									>
										<span>View</span>
										<FiChevronRight className="w-3 h-3" />
									</button>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Human Escalation Action Box */}
				{message.requiresHumanEscalation && (
					<div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900">
						<div className="font-semibold text-amber-950 flex items-center gap-1.5 mb-1">
							<FiPhoneCall className="w-3.5 h-3.5 text-amber-700" />
							Need personal assistance from our team?
						</div>
						<p className="text-[11px] text-amber-800 mb-2.5">
							Our interior consultants are ready to help with custom dimensions, showroom visits, or order inquiries.
						</p>
						<div className="flex flex-wrap gap-2">
							<button
								onClick={() => onNavigate && onNavigate("/contact")}
								className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors shadow-xs"
							>
								<FiMail className="w-3 h-3" />
								<span>Contact Us Page</span>
							</button>
							<a
								href="tel:+251911234567"
								className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-amber-900 bg-white border border-amber-300 hover:bg-amber-100 rounded-lg transition-colors"
							>
								<FiPhoneCall className="w-3 h-3" />
								<span>Call +251 911 234 567</span>
							</a>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ChatMessage;
