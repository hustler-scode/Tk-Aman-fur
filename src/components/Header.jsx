import React, { useEffect, useState } from "react";
import Logo from "../assets/images/tk-logo.jpg";
import { CgMenuRight, CgClose } from "react-icons/cg";
import { IoIosHeart } from "react-icons/io";
import { useLanguage } from "../context/languagecontext";
import LanguageToggle from "./LanguageToggle";

const Header = ({
	currentPath,
	onNavigate,
	wishlistCount = 0,
	onWishlistClick,
	hasLightHeader = false,
}) => {
	const { t } = useLanguage();
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	const navItems = [
		{ name: t("nav.home", "Home"), path: "/" },
		{ name: t("nav.about", "About Us"), path: "/about" },
		{ name: t("nav.products", "Products"), path: "/products" },
		{ name: t("nav.testimonials", "Testimonials"), path: "/testimonials" },
		{ name: t("nav.contact", "Contact"), path: "/contact" },
	];

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Lock body scroll when mobile menu is open to prevent page scrolling behind drawer
	useEffect(() => {
		if (mobileOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [mobileOpen]);

	// Close mobile menu on ESC key
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape" && mobileOpen) {
				setMobileOpen(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [mobileOpen]);

	// Header is transparent only when unscrolled AND on pages that feature the dark hero banner
	const isTransparent = !scrolled && !hasLightHeader && !currentPath.startsWith("/products/");


	const handleNavClick = (path) => {
		onNavigate(path);
		setMobileOpen(false);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<>
			<header
				className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-300 ${
					scrolled
						? "bg-white/95 backdrop-blur-md shadow-sm py-3.5 text-primary"
						: "bg-gradient-to-b from-black/75 via-black/35 to-transparent py-4 sm:py-5 text-white"
				}`}
			>
				<div className='container mx-auto flex items-center justify-between'>
					{/* Brand Logo */}
					<button
						type='button'
						onClick={() => handleNavClick("/")}
						className='flex items-center gap-2.5 sm:gap-3 focus:outline-none group'
					>
						<div className='h-9 w-9 md:h-10 md:w-10 rounded-xl overflow-hidden bg-[#0a0f1d] flex items-center justify-center border border-white/20 shadow-md flex-shrink-0 group-hover:scale-105 transition-transform duration-200'>
							<img src={Logo} alt='TK Craft Logo' className='h-full w-full object-cover scale-110' />
						</div>
						<span
							className={`font-primary font-bold text-xl md:text-2xl tracking-tight transition-colors ${
								isTransparent ? "text-white" : "text-primary"
							}`}
						>
							{t("nav.brandName", "TK")} <span className='text-accent'>{t("nav.brandSub", "Craft")}</span>
						</span>
					</button>

					{/* Desktop Navigation Links */}
					<nav className='hidden md:flex items-center gap-6 lg:gap-8'>
						{navItems.map((item) => {
							const isActive =
								currentPath === item.path ||
								(item.path !== "/" && currentPath.startsWith(item.path));

							return (
								<button
									key={item.path}
									type='button'
									onClick={() => handleNavClick(item.path)}
									className={`text-sm font-medium tracking-wide transition-all duration-300 relative py-1.5 focus:outline-none group ${
										isTransparent
											? isActive
												? "text-white font-semibold"
												: "text-white/80 hover:text-white"
											: isActive
												? "text-accent font-semibold"
												: "text-grey-700 hover:text-accent"
									}`}
								>
									<span>{item.name}</span>
									<span
										className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-300 ease-out origin-left ${
											isActive
												? `opacity-100 scale-x-100 ${isTransparent ? "bg-white" : "bg-accent"}`
												: `opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-75 ${
														isTransparent ? "bg-white/70" : "bg-accent/70"
												  }`
										}`}
									/>
								</button>
							);
						})}
					</nav>

					{/* Right Actions (Language Toggle, Wishlist) */}
					<div className='hidden md:flex items-center gap-3'>
						{/* Language Toggle */}
						<LanguageToggle isTransparent={isTransparent} />

						{/* Saved Items badge */}
						<button
							type='button'
							onClick={() => {
								if (onWishlistClick) {
									onWishlistClick();
								} else {
									handleNavClick("/products");
								}
							}}
							className={`relative p-2 rounded-full transition-colors ${
								isTransparent
									? "text-white hover:bg-white/10"
									: "text-grey-700 hover:bg-grey-100"
							}`}
							title={`${wishlistCount} ${
								wishlistCount === 1
									? t("nav.savedItems", "saved item")
									: t("nav.savedItemsPlural", "saved items")
							}`}
						>
							<IoIosHeart className='text-2xl text-rose-500' />
							{wishlistCount > 0 && (
								<span className='absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow'>
									{wishlistCount}
								</span>
							)}
						</button>
					</div>

					{/* Mobile Controls (Language Toggle + Wishlist + Burger Menu Button) */}
					<div className='flex items-center gap-2 md:hidden'>
						<LanguageToggle isTransparent={isTransparent} />

						{wishlistCount > 0 && (
							<button
								type='button'
								onClick={() => {
									if (onWishlistClick) {
										onWishlistClick();
									} else {
										handleNavClick("/products");
									}
								}}
								className='relative p-2 text-rose-500'
								aria-label='Wishlist'
							>
								<IoIosHeart className='text-2xl' />
								<span className='absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm'>
									{wishlistCount}
								</span>
							</button>
						)}

						<button
							type='button'
							onClick={() => setMobileOpen((prev) => !prev)}
							aria-label={mobileOpen ? "Close menu" : "Open navigation menu"}
							className={`p-2 rounded-lg text-2xl transition-colors focus:outline-none ${
								isTransparent ? "text-white hover:bg-white/10" : "text-primary hover:bg-grey-100"
							}`}
						>
							{mobileOpen ? <CgClose /> : <CgMenuRight />}
						</button>
					</div>
				</div>
			</header>

			{/* Mobile Drawer (Rendered OUTSIDE <header> to avoid backdrop-filter containing block trapping & cut-off) */}
			{mobileOpen && (
				<div
					className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden flex justify-end animate-fade-in'
					onClick={() => setMobileOpen(false)}
				>
					<div
						className='bg-white w-[85%] max-w-sm h-full shadow-2xl flex flex-col justify-between overflow-y-auto'
						onClick={(e) => e.stopPropagation()}
					>
						<div className='p-5 sm:p-6 flex flex-col gap-3'>
							{/* Drawer Header with Logo and Close button */}
							<div className='pb-4 border-b border-grey-100 flex items-center justify-between'>
								<div className='flex items-center gap-2.5'>
									<div className='h-9 w-9 rounded-xl overflow-hidden bg-[#0a0f1d] flex items-center justify-center border border-grey-200'>
										<img src={Logo} alt='TK Craft Logo' className='h-full w-full object-cover scale-110' />
									</div>
									<span className='font-primary font-bold text-lg text-primary tracking-tight'>
										{t("nav.brandName", "TK")} <span className='text-accent'>{t("nav.brandSub", "Craft")}</span>
									</span>
								</div>
								<button
									type='button'
									onClick={() => setMobileOpen(false)}
									aria-label='Close navigation menu'
									className='p-2 rounded-lg text-grey-500 hover:text-primary hover:bg-grey-100 transition-colors'
								>
									<CgClose className='text-2xl' />
								</button>
							</div>

							{/* Mobile Language Switcher */}
							<div className='my-1'>
								<LanguageToggle variant='drawer' />
							</div>

							{/* Navigation Links */}
							<div className='flex flex-col gap-1.5 pt-2'>
								{navItems.map((item) => {
									const isActive =
										currentPath === item.path ||
										(item.path !== "/" && currentPath.startsWith(item.path));
									return (
										<button
											key={item.path}
											type='button'
											onClick={() => handleNavClick(item.path)}
											className={`text-left px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
												isActive
													? "bg-accent text-white shadow-md shadow-accent/20"
													: "text-grey-700 hover:bg-grey-100"
											}`}
										>
											{item.name}
										</button>
									);
								})}

								{/* Wishlist Link */}
								<button
									type='button'
									onClick={() => {
										setMobileOpen(false);
										if (onWishlistClick) {
											onWishlistClick();
										} else {
											handleNavClick("/products");
										}
									}}
									className='text-left px-4 py-3 rounded-xl text-base font-semibold transition-all flex items-center justify-between text-grey-700 hover:bg-grey-100'
								>
									<span className='inline-flex items-center gap-2.5'>
										<IoIosHeart className='text-rose-500 text-xl' />
										<span>{t("nav.likedItems", "Liked Items")}</span>
									</span>
									<span className='text-xs bg-rose-100 text-rose-600 px-2.5 py-0.5 rounded-full font-bold'>
										{wishlistCount}
									</span>
								</button>
							</div>
						</div>

						{/* Drawer Footer */}
						<div className='p-5 sm:p-6 border-t border-grey-100 bg-grey-50/50'>
							<p className='text-center text-xs text-grey-500 font-medium leading-relaxed'>
								{t("nav.workingHours", "Mon–Sat 9am–6pm | +251 (0)11 629 8154")}
							</p>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Header;

