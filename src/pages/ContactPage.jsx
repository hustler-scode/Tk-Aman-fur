import React, { useEffect } from "react";
import InquiryForm from "../components/InquiryForm";
import ShowroomInfo from "../components/ShowroomInfo";
import LocationMap from "../components/LocationMap";
import Breadcrumb from "../components/Breadcrumb";
import { useLanguage } from "../context/languagecontext";

const ContactPage = ({ inquiryProduct, onClearInquiryProduct, onNavigate }) => {
	const { t, translateProduct } = useLanguage();

	const localizedProduct = inquiryProduct ? translateProduct(inquiryProduct) : null;

	useEffect(() => {
		if (inquiryProduct) {
			window.scrollTo({ top: 0, left: 0, behavior: "instant" });
		}
	}, [inquiryProduct]);

	const breadcrumbItems = inquiryProduct
		? [
				{ label: t("nav.home", "Home"), onClick: () => onNavigate("/") },
				{ label: t("nav.products", "Products"), onClick: () => onNavigate("/products") },
				{
					label: localizedProduct.name,
					onClick: () => onNavigate(`/products/${inquiryProduct.id}`),
				},
				{ label: t("contactPage.inquireBreadcrumb", "Inquiry") },
		  ]
		: [
				{ label: t("nav.home", "Home"), onClick: () => onNavigate("/") },
				{ label: t("nav.contact", "Contact") },
		  ];

	return (
		<div className={`w-full pb-24 bg-grey-50 ${inquiryProduct ? "pt-28 md:pt-32" : ""}`}>
			{/* Only render generic hero section when not directly inquiring about a specific product */}
			{!inquiryProduct && (
				<section className='relative bg-hero bg-cover bg-center text-white pt-36 pb-20 mb-14 overflow-hidden'>
					{/* Lighter architectural overlay matching home page hero */}
					<div className='absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/25 backdrop-blur-[0.5px]' />

					<div className='container mx-auto px-4 relative z-10 text-center max-w-3xl'>
						<span className='inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full text-xs md:text-sm font-medium tracking-widest uppercase mb-4 text-grey-100 border border-white/20 animate-fade-in'>
							<span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
							{t("contactPage.heroBadge", "Concierge & Inquiries")}
						</span>
						<h1 className='text-3xl sm:text-5xl md:text-6xl font-primary font-bold text-white mt-2 mb-4 drop-shadow-sm'>
							{t("contactPage.heroTitle", "Get in Touch")}
						</h1>
						<p className='text-sm sm:text-base md:text-[17px] text-grey-100/90 font-normal leading-relaxed md:leading-8 max-w-2xl mx-auto drop-shadow-sm antialiased'>
							{t(
								"contactPage.heroSubtitle",
								"Have questions about custom dimensions, wood finishes, or visiting our Gerji atelier? Our design specialists are here to assist."
							)}
						</p>
					</div>
				</section>
			)}

			<div className='container mx-auto px-4 max-w-6xl'>
				{/* Breadcrumb when directly inquiring about product */}
				{inquiryProduct && (
					<div className='mb-6'>
						<Breadcrumb items={breadcrumbItems} />
					</div>
				)}

				{/* MAIN GRID: INQUIRY FORM + SHOWROOM & BUSINESS DETAILS */}
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start'>
					<InquiryForm
						inquiryProduct={inquiryProduct}
						onClearInquiryProduct={onClearInquiryProduct}
						onNavigate={onNavigate}
					/>

					<ShowroomInfo />
				</div>

				{/* SHOWROOM LOCATION MAP SECTION */}
				<LocationMap />
			</div>
		</div>
	);
};

export default ContactPage;

