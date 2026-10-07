/**
 * TK Craft Furniture Knowledge Base
 * Centralized, structured repository of products, FAQs, policies, and store information.
 * Used by ChatService to retrieve context before generating AI responses with Gemini.
 */

const products = [
	{
		id: "oak-lounge-chair",
		name: "Oak Lounge Chair",
		category: "Living Room",
		material: "Wood",
		price: 34900,
		oldPrice: 42000,
		currency: "ETB (Birr)",
		inStock: true,
		rating: 5.0,
		badge: "Best Seller",
		dimensions: "75 x 80 x 90 cm",
		materialsDescription: "Solid white oak frame, natural linen upholstery, eco-wax finish.",
		description: "A quintessential centerpiece for the contemporary lounge. Sculpted with steam-bent solid white oak and cushioned with high-density, breathable linen foam that conforms comfortably to your posture.",
		craftsmanship: "Hand-mortised corner joints with brushed non-toxic matte lacquer. Tested to withstand over 150kg with lifetime structural integrity.",
		careNotes: "Dust with dry microfiber cloth. Avoid continuous direct sunlight. Clean upholstery with specialized water-free solvent cleaners.",
		keywords: ["chair", "lounge", "oak", "wood", "living room", "seating", "armchair", "linen"]
	},
	{
		id: "nordic-minimalist-bed",
		name: "Nordic Minimalist Bed",
		category: "Bedroom",
		material: "Wood",
		price: 68000,
		oldPrice: 75000,
		currency: "ETB (Birr)",
		inStock: true,
		rating: 4.9,
		badge: "Featured",
		dimensions: "160 x 200 x 95 cm (Queen)",
		materialsDescription: "FSC-certified solid ash wood, reinforced beech slats, brushed steel supports.",
		description: "A low-profile floating bed platform designed to induce deep serenity. Featuring an integrated angled headboard tailored for bedtime reading and seamless cable channels.",
		craftsmanship: "Precision acoustic dampening gaskets prevent creaking. Floating silhouette with hidden recessed heavy-gauge steel supports.",
		careNotes: "Wipe wood surfaces using warm water with a drop of organic soap. Dry immediately with a clean towel.",
		keywords: ["bed", "bedroom", "nordic", "ash", "minimalist", "queen", "sleeping", "headboard"]
	},
	{
		id: "archival-credenza-cupboard",
		name: "Archival Credenza Cupboard",
		category: "Living Room",
		material: "Wood",
		price: 52000,
		oldPrice: 59000,
		currency: "ETB (Birr)",
		inStock: true,
		rating: 4.8,
		badge: "New Arrival",
		dimensions: "140 x 45 x 85 cm",
		materialsDescription: "Walnut veneer, solid core panels, soft-close Blum hardware, matte brass pulls.",
		description: "Architectural storage meets sculptural form. Features ribbed tambour sliding doors, adjustable interior shelving, and custom wire-management ports for modern AV setups.",
		craftsmanship: "German soft-close hinges, reinforced internal doweling, and anti-tip wall anchoring hardware included.",
		careNotes: "Use coasters under hot beverages. Polish twice yearly with natural beeswax conditioner.",
		keywords: ["credenza", "cupboard", "storage", "living room", "walnut", "cabinet", "buffet"]
	},
	{
		id: "aurora-pendant-lighting",
		name: "Aurora Ambient Pendant",
		category: "Office",
		material: "Metal",
		price: 18000,
		oldPrice: 21500,
		currency: "ETB (Birr)",
		inStock: true,
		rating: 4.9,
		badge: "Popular",
		dimensions: "40 x 40 x 32 cm",
		materialsDescription: "Spun aluminum shade, hand-blown frosted glass diffuser, brass rod accents.",
		description: "Cast a warm, glare-free architectural glow over dining areas or executive desks. The spun shade balances direct task radiance with soft ambient ceiling wash.",
		craftsmanship: "UL-listed electrical components with dimmable warm LED module (2700K Warm White, 90+ CRI).",
		careNotes: "Disconnect power before wiping frosted glass with a lightly damp microfiber cloth.",
		keywords: ["pendant", "lighting", "light", "lamp", "aurora", "office", "metal", "ceiling light"]
	},
	{
		id: "xora-executive-corner-desk",
		name: "XORA Executive Corner Desk",
		category: "Office",
		material: "Metal",
		price: 49000,
		oldPrice: 55000,
		currency: "ETB (Birr)",
		inStock: true,
		rating: 4.7,
		badge: null,
		dimensions: "150 x 120 x 76 cm",
		materialsDescription: "Matte black powder-coated structural steel, waterproof oak veneer top.",
		description: "Designed for deep focus and productivity. An expansive L-shaped surface accommodating multi-monitor arrays, magnetic cable routing, and smooth beveled wrist rests.",
		craftsmanship: "Heavy gauge cold-rolled steel frame with laser-welded seams and micro-adjustable leveling feet.",
		careNotes: "Clean with mild neutral detergent. Avoid abrasive pads or harsh chemical sprays.",
		keywords: ["desk", "office", "executive", "corner desk", "l-shaped", "table", "workstation"]
	},
	{
		id: "treos-seroes-lounge-chair",
		name: "Treos Seroes Armchair",
		category: "Living Room",
		material: "Fabric",
		price: 29900,
		oldPrice: 34000,
		currency: "ETB (Birr)",
		inStock: true,
		rating: 4.9,
		badge: "Best Seller",
		dimensions: "82 x 78 x 84 cm",
		materialsDescription: "Bouclé textured wool fabric, internal steel frame, memory-foam core.",
		description: "Sublime comfort meets sculptural minimalism. The cocooning silhouette envelopes the body, upholstered in heavy-weight tactile bouclé that feels heavenly to the touch.",
		craftsmanship: "Dual-density high resilience foam over s-spring suspension for lifetime sag-free posture.",
		careNotes: "Gently vacuum with soft brush attachment. Treat accidental liquid spills immediately by blotting.",
		keywords: ["armchair", "chair", "boucle", "fabric", "living room", "lounge", "comfort"]
	},
	{
		id: "black-forest-coffee-table",
		name: "Black Forest Coffee Table",
		category: "Living Room",
		material: "Wood",
		price: 24500,
		oldPrice: 28000,
		currency: "ETB (Birr)",
		inStock: true,
		rating: 4.8,
		badge: null,
		dimensions: "110 x 60 x 42 cm",
		materialsDescription: "Solid blackened oak, natural grain retention, organic perimeter bevel.",
		description: "A conversational anchor for modern seating areas. Rich charcoal grain patterns contrast gently against soft floor rugs, grounded by three sculptural cylindrical legs.",
		craftsmanship: "Deep pigment oil stain finished with hardwearing moisture-resistant protective sealer.",
		careNotes: "Wipe dry immediately after spills. Clean using non-acidic wood soap.",
		keywords: ["coffee table", "table", "black oak", "living room", "wood", "center table"]
	},
	{
		id: "ole-gundorse-spring-stool",
		name: "Ole Gundorse Stool",
		category: "Outdoor",
		material: "Fabric",
		price: 13500,
		oldPrice: 16000,
		currency: "ETB (Birr)",
		inStock: true,
		rating: 4.6,
		badge: null,
		dimensions: "45 x 45 x 48 cm",
		materialsDescription: "Weather-resistant solution-dyed acrylic, anodized aluminum base.",
		description: "Versatile accent seating suitable for covered patios, verandas, or dressing rooms. Compact, lightweight, and engineered with UV-stabilized exterior textiles.",
		craftsmanship: "Rustproof stainless hardware with mold-resistant quick-dry reticulated foam cushion.",
		careNotes: "Hose down or wipe with soapy sponge. Store under shelter during extreme winters.",
		keywords: ["stool", "outdoor", "patio", "accent seating", "fabric", "veranda"]
	},
	{
		id: "verona-terrace-dining-set",
		name: "Verona Terrace Dining Table",
		category: "Outdoor",
		material: "Metal",
		price: 62000,
		oldPrice: 71000,
		currency: "ETB (Birr)",
		inStock: true,
		rating: 4.9,
		badge: "New",
		dimensions: "180 x 90 x 75 cm",
		materialsDescription: "Electro-coated rustproof aluminum, slatted teak tabletop insert.",
		description: "Bring sophisticated interior aesthetics out into the open air. Features self-draining slatted construction and UV-resistant matte powder-coat frame.",
		craftsmanship: "Grade-A sustainably harvested teak inserts bonded to thermal-expansion aluminum channel rails.",
		careNotes: "Allow teak to naturally develop a silver patina, or apply teak shield twice per season.",
		keywords: ["dining table", "outdoor", "terrace", "teak", "patio", "metal table"]
	},
	{
		id: "solarium-paper-cupboard",
		name: "Solarium Modular Cupboard",
		category: "Bedroom",
		material: "Wood",
		price: 38000,
		oldPrice: 42000,
		currency: "ETB (Birr)",
		inStock: true,
		rating: 4.7,
		badge: null,
		dimensions: "90 x 40 x 120 cm",
		materialsDescription: "Solid birch, Japanese washi-inspired woven paper door panels, brass latch.",
		description: "Warm, translucent door panels diffuse interior shadows while keeping linens and apparel impeccably ventilated. A poetic harmony of traditional and Scandinavian craft.",
		craftsmanship: "Hand-stretched moisture-treated woven cord panels set into mortise-and-tenon birch frames.",
		careNotes: "Dust panels gently with feather duster. Keep away from direct open water splashing.",
		keywords: ["cupboard", "modular", "bedroom", "birch", "japanese", "washi", "storage"]
	},
	{
		id: "haven-boucle-sofa",
		name: "Haven Deep Lounge Sofa",
		category: "Living Room",
		material: "Fabric",
		price: 89000,
		oldPrice: 99000,
		currency: "ETB (Birr)",
		inStock: true,
		rating: 5.0,
		badge: "Best Seller",
		dimensions: "220 x 95 x 78 cm",
		materialsDescription: "Kiln-dried hardwood frame, plush pocket coil seating, heavy woven upholstery.",
		description: "The ultimate statement sofa. Deep proportions, generous feather-down wrapped cushions, and tailored seams create a serene haven in any open-plan residence.",
		craftsmanship: "Kiln-dried European beech frame with reinforced corner blocks and sinuous spring suspension.",
		careNotes: "Fluff cushions bi-weekly to retain optimal loft. Professional upholstery clean recommended yearly.",
		keywords: ["sofa", "couch", "living room", "haven", "boucle", "deep lounge", "seating"]
	},
	{
		id: "artisan-sculptural-sideboard",
		name: "Artisan Sculptural Sideboard",
		category: "Living Room",
		material: "Wood",
		price: 74000,
		oldPrice: 82000,
		currency: "ETB (Birr)",
		inStock: true,
		rating: 4.9,
		badge: null,
		dimensions: "160 x 48 x 80 cm",
		materialsDescription: "Smoked oak, fluted cabinet doors, brushed bronze plinth base.",
		description: "Sculptural vertical fluting plays with light and shadow throughout the day. Ample storage concealing four independent soft-close compartments.",
		craftsmanship: "Continuous grain matching across all cabinet door fronts with custom integrated touch-latches.",
		careNotes: "Dust with soft microfiber cloth. Apply natural wood paste wax once a year.",
		keywords: ["sideboard", "fluted", "oak", "living room", "storage", "cabinet"]
	}
];

const storeInfo = {
	name: "TK Craft Handcrafted Furniture",
	established: 2017,
	address: "Unity University Gerji Campus, Bole Sub-City",
	city: "Addis Ababa",
	country: "Ethiopia",
	coordinates: "9.0008° N, 38.8068° E",
	landmark: "Unity University Gerji Campus (near Korean Hospital MCM)",
	phone: "+251 (0)11 629 8154",
	phoneMobile: "+251 911 234 567",
	email: "contact@tkcraft.et",
	operatingHours: {
		monSat: "Monday – Saturday: 9:00 AM – 6:00 PM",
		sun: "Sunday: Closed (By Appointment Only for architectural & custom consultations)"
	},
	responseSLA: "Inquiries answered within 1 business day."
};

const faqs = [
	{
		id: "store-location-hours",
		category: "Store & Showroom",
		question: "Where is TK Craft located and what are your opening hours?",
		answer: "Our showroom is located at Unity University Gerji Campus, Bole Sub-City, Addis Ababa, Ethiopia (near Korean Hospital MCM). We are open Monday through Saturday from 9:00 AM to 6:00 PM. On Sundays, we are open by appointment only for custom interior consultations.",
		keywords: ["location", "address", "where", "showroom", "hours", "open", "gerji", "addis ababa", "map", "contact", "phone"]
	},
	{
		id: "delivery-shipping-addis",
		category: "Delivery & Shipping",
		question: "How does delivery work in Addis Ababa and across Ethiopia?",
		answer: "We offer complimentary white-glove delivery & assembly within Addis Ababa for orders exceeding 30,000 ETB. Standard local delivery takes 2 to 4 business days. For nationwide shipping outside Addis Ababa across Ethiopia, delivery is handled via our insured freight logistics partners within 5 to 9 business days.",
		keywords: ["delivery", "shipping", "addis ababa", "ethiopia", "freight", "assembly", "time", "cost", "transport"]
	},
	{
		id: "payment-methods",
		category: "Payment Methods",
		question: "What payment methods do you accept?",
		answer: "We accept Telebirr, Commercial Bank of Ethiopia (CBE Birr), Direct Bank Transfer (CBE, Awash, Bank of Abyssinia), Cash on Delivery (for orders in Addis Ababa up to 50,000 ETB), and major Credit/Debit Cards at our showroom terminal.",
		keywords: ["payment", "telebirr", "cbe", "cbe birr", "bank transfer", "cash", "pay", "credit card", "birr"]
	},
	{
		id: "warranty-guarantee",
		category: "Warranty & Guarantee",
		question: "What is your warranty policy on furniture?",
		answer: "All TK Craft furniture comes with a Lifetime Structural Warranty covering solid timber joinery, internal steel frameworks, and structural integrity. Upholstery, surface finishes, and mechanical hardware (such as soft-close hinges) carry a 3-Year Comprehensive Warranty.",
		keywords: ["warranty", "guarantee", "lifetime", "broken", "repair", "quality", "defect", "structure"]
	},
	{
		id: "returns-exchanges",
		category: "Returns & Exchanges",
		question: "What is your return and refund policy?",
		answer: "We provide a 14-day hassle-free return and exchange window. If a product does not perfectly complement your space, you can return it in its original condition for a full refund or exchange. Custom bespoke orders have tailored modification policies.",
		keywords: ["return", "refund", "exchange", "14 days", "cancel", "money back", "policy"]
	},
	{
		id: "materials-sustainability",
		category: "Materials & Craftsmanship",
		question: "What materials do you use, and are they sustainably sourced?",
		answer: "We use 100% FSC-certified timber including European White Oak, Ash, and Smoked Walnut. All upholstery features organic linen, tactile bouclé wool, and weather-resistant solution-dyed acrylics. Finishes are non-toxic, eco-wax and organic oils with zero volatile organic compounds (VOCs).",
		keywords: ["materials", "wood", "oak", "ash", "walnut", "sustainable", "fsc", "eco", "linen", "boucle", "craftsmanship", "quality"]
	},
	{
		id: "custom-furniture-orders",
		category: "Custom & Bespoke Orders",
		question: "Can I order custom dimensions or bespoke furniture pieces?",
		answer: "Yes! TK Craft specializes in bespoke architectural joinery and custom dimensions for residential and executive spaces. You can request wood swatches, custom table sizes, or specific fabric colors by contacting our interior consultants at contact@tkcraft.et or +251 911 234 567.",
		keywords: ["custom", "bespoke", "dimensions", "modify", "tailor", "size", "swatch", "architect"]
	},
	{
		id: "care-maintenance",
		category: "Furniture Care",
		question: "How should I clean and maintain my TK Craft solid wood furniture?",
		answer: "For solid wood: Dust regularly with a dry microfiber cloth, wipe spills immediately with warm water and organic soap, and nourish wood twice yearly with natural beeswax conditioner. Avoid direct sunlight and harsh chemicals.",
		keywords: ["care", "clean", "maintain", "maintainence", "dust", "beeswax", "spills", "wood care"]
	},
	{
		id: "human-support-escalation",
		category: "Customer Support",
		question: "How can I speak directly with a human customer support agent or interior advisor?",
		answer: "You can reach our human support team directly via phone at +251 (0)11 629 8154 or +251 911 234 567, email contact@tkcraft.et, or visit our showroom at Unity University Gerji Campus, Addis Ababa during business hours (Mon-Sat, 9AM-6PM).",
		keywords: ["human", "support", "person", "agent", "call", "phone", "email", "speak", "help", "advisor"]
	}
];

module.exports = {
	products,
	storeInfo,
	faqs
};
