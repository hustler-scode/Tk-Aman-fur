import React from "react";
import { allProducts } from "../data";
import Breadcrumb from "../components/Breadcrumb";
import ProductGallery from "../components/ProductGallery";
import ProductInfoPanel from "../components/ProductInfoPanel";
import RelatedProducts from "../components/RelatedProducts";
import { useLanguage } from "../context/languagecontext";

const ProductDetailPage = ({
	productId,
	onNavigate,
	onSelectProduct,
	onInquire,
	wishlist = [],
	onToggleWishlist,
}) => {
	const { t, translateProduct } = useLanguage();
	const rawProduct = allProducts.find((p) => p.id === productId) || allProducts[0];
	const product = translateProduct(rawProduct);
	const isWishlisted = wishlist.some((item) => item.id === rawProduct.id);

	const relatedProducts = allProducts
		.filter((p) => p.id !== rawProduct.id && (p.category === rawProduct.category || p.featured))
		.slice(0, 3);

	const breadcrumbItems = [
		{ label: t("nav.home", "Home"), onClick: () => onNavigate("/") },
		{ label: t("nav.products", "Products"), onClick: () => onNavigate("/products") },
		{ label: product.category, onClick: () => onNavigate("/products") },
		{ label: product.name },
	];

	return (
		<div className='w-full pt-28 md:pt-32 pb-24 bg-grey-50'>
			<div className='container mx-auto px-4'>
				{/* Breadcrumb Navigation directly at top */}
				<Breadcrumb items={breadcrumbItems} />

				{/* Product Main Section: Gallery + Info Panel directly visible */}
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-20'>
					<ProductGallery product={product} />

					<ProductInfoPanel
						product={product}
						isWishlisted={isWishlisted}
						onToggleWishlist={onToggleWishlist}
						onInquire={onInquire}
					/>
				</div>

				{/* Related Products */}
				<RelatedProducts
					products={relatedProducts}
					onNavigate={onNavigate}
					onSelectProduct={onSelectProduct}
					onInquire={onInquire}
					wishlist={wishlist}
					onToggleWishlist={onToggleWishlist}
				/>
			</div>
		</div>
	);
};

export default ProductDetailPage;

