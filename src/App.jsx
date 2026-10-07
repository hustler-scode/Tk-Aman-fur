import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import ContactPage from "./pages/ContactPage";
import ChatbotWidget from "./components/Chatbot/ChatbotWidget";

function App() {
	// Parse initial path from window.location
	const getPathFromLocation = () => {
		const path = window.location.pathname || "/";
		return path;
	};

	const [currentPath, setCurrentPath] = useState(getPathFromLocation());
	const [selectedProductId, setSelectedProductId] = useState("oak-lounge-chair");
	const [initialCategory, setInitialCategory] = useState("All");
	const [inquiryProduct, setInquiryProduct] = useState(null);
	const [wishlistOnly, setWishlistOnly] = useState(false);

	// Wishlist state (persisted in localStorage)
	const [wishlist, setWishlist] = useState(() => {
		try {
			const saved = localStorage.getItem("tkcraft_wishlist") || localStorage.getItem("furnicraft_wishlist");
			return saved ? JSON.parse(saved) : [];
		} catch (e) {
			return [];
		}
	});

	// Save wishlist to localStorage
	useEffect(() => {
		try {
			localStorage.setItem("tkcraft_wishlist", JSON.stringify(wishlist));
		} catch (e) {
			// ignore localStorage error
		}
	}, [wishlist]);

	// Listen to browser forward/back buttons
	useEffect(() => {
		const handlePopState = () => {
			const path = window.location.pathname || "/";
			setCurrentPath(path);
			if (path === "/wishlist") {
				setWishlistOnly(true);
			} else if (path === "/products") {
				setWishlistOnly(false);
			}
			if (path.startsWith("/products/")) {
				const id = path.replace("/products/", "");
				if (id) setSelectedProductId(id);
			}
		};
		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, []);

	// Navigate handler
	const navigate = (path) => {
		if (path === "/products") {
			setWishlistOnly(false);
		}
		setCurrentPath(path);
		try {
			window.history.pushState({}, "", path);
		} catch (e) {
			// fallback
		}
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// When heart icon in Header is clicked: route to liked products only
	const handleWishlistClick = () => {
		setWishlistOnly(true);
		if (currentPath !== "/products" && currentPath !== "/wishlist") {
			setCurrentPath("/products");
			try {
				window.history.pushState({}, "", "/products");
			} catch (e) {
				// fallback
			}
		}
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Select product to view detail
	const handleSelectProduct = (productId) => {
		setSelectedProductId(productId);
		navigate(`/products/${productId}`);
	};

	// Inquire about item flow: routes directly to Contact page with product reference pre-filled
	const handleInquire = (product) => {
		setInquiryProduct(product);
		navigate("/contact");
	};

	// Toggle wishlist
	const handleToggleWishlist = (product) => {
		setWishlist((prev) => {
			const exists = prev.some((item) => item.id === product.id);
			if (exists) {
				return prev.filter((item) => item.id !== product.id);
			} else {
				return [...prev, product];
			}
		});
	};

	// Render page based on currentPath
	const renderPage = () => {
		if (currentPath === "/about") {
			return <AboutPage onNavigate={navigate} />;
		}

		if (currentPath.startsWith("/products/")) {
			const prodId = currentPath.replace("/products/", "") || selectedProductId;
			return (
				<ProductDetailPage
					productId={prodId}
					onNavigate={navigate}
					onSelectProduct={handleSelectProduct}
					onInquire={handleInquire}
					wishlist={wishlist}
					onToggleWishlist={handleToggleWishlist}
				/>
			);
		}

		if (currentPath === "/products" || currentPath === "/wishlist") {
			return (
				<ProductsPage
					initialCategory={initialCategory}
					onNavigate={navigate}
					onSelectProduct={handleSelectProduct}
					onInquire={handleInquire}
					wishlist={wishlist}
					onToggleWishlist={handleToggleWishlist}
					wishlistOnly={wishlistOnly || currentPath === "/wishlist"}
					onToggleWishlistOnly={(val) => setWishlistOnly(val)}
				/>
			);
		}

		if (currentPath === "/testimonials") {
			return (
				<TestimonialsPage
					onNavigate={navigate}
					onSelectProduct={handleSelectProduct}
				/>
			);
		}

		if (currentPath === "/contact") {
			return (
				<ContactPage
					inquiryProduct={inquiryProduct}
					onClearInquiryProduct={() => setInquiryProduct(null)}
					onNavigate={navigate}
				/>
			);
		}

		// Default: Home Page
		return (
			<HomePage
				onNavigate={navigate}
				onSelectProduct={handleSelectProduct}
				onInquire={handleInquire}
				wishlist={wishlist}
				onToggleWishlist={handleToggleWishlist}
			/>
		);
	};

	return (
		<div className='min-h-screen flex flex-col bg-grey-50 font-sans text-grey-700 antialiased'>
			{/* Persistent Sticky Header */}
			<Header
				currentPath={currentPath}
				onNavigate={navigate}
				wishlistCount={wishlist.length}
				onWishlistClick={handleWishlistClick}
			/>

			{/* Main Page View */}
			<main className='flex-1'>{renderPage()}</main>

			{/* Global Footer */}
			<Footer
				onNavigate={navigate}
				onSelectCategory={(cat) => setInitialCategory(cat)}
			/>

			{/* AI Powered Gemini FAQ & Furniture Chatbot */}
			<ChatbotWidget
				onSelectProduct={handleSelectProduct}
				onInquire={handleInquire}
				onNavigate={navigate}
			/>
		</div>
	);
}

export default App;
