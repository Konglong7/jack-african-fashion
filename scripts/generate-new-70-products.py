"""
Script to generate standard B2B wholesale JSON data for 70 new styles (1003001 - 1003070).
Target file: D:/Desktop/code/African Fashion/data/new-70-products.json
"""

import json
import os
import re

PRODUCTS = [
    # -------------------------------------------------------------------------
    # 1. Plus Size Dresses (1003001 ~ 1003024, 24 items, ID: 69 ~ 92)
    # -------------------------------------------------------------------------
    {
        "code": "1003001",
        "id": "69",
        "name": "African Batwing Plus Size Shift Dress",
        "slug": "african-batwing-plus-size-dress-1003001",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Batwing Sleeve", "Shift Dress", "Guangzhou Wholesale", "Ready Stock"],
        "desc": "A relaxed, elegant batwing shift dress engineered specifically for fuller, curvy figures across African and Caribbean diaspora boutiques. Tailored in breathable, four-way stretch crepe fabric that drapes effortlessly over hips and bust without clinging, retaining its crisp silhouette in humid tropical climates.",
        "features": [
            "Relaxed batwing sleeve cut with generous armhole allowance for all-day comfort",
            "Fuller-figure curve grading (XL to 5XL) designed with ample bust and hip ease",
            "Durable high-density crepe fabric that resists wrinkles during air cargo shipping",
            "Factory-direct Guangzhou supply with 100-piece mixed size ratio ready to ship"
        ]
    },
    {
        "code": "1003002",
        "id": "70",
        "name": "Embroidered V-Neck Plus Size Kaftan Dress",
        "slug": "embroidered-v-neck-plus-size-kaftan-dress-1003002",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Kaftan Gown", "Embroidery", "Church Wear", "Ready Stock"],
        "desc": "Luxurious boutique kaftan gown showcasing metallic gold embroidery along the V-neckline and sleeve cuffs. Designed with an airy, regal drape and discreet side slits that cater to Sunday church services, traditional wedding receptions, and high-end boutique assortments.",
        "features": [
            "Dense metallic thread embroidery trim along neckline and sleeve hems",
            "Full-coverage flowing kaftan silhouette flattering sizes XL through 5XL",
            "Premium lightweight poly-chiffon blend with soft interior skin feel",
            "High-margin boutique centerpiece with flexible wholesale color assortments"
        ]
    },
    {
        "code": "1003003",
        "id": "71",
        "name": "Tiered Ruffle Flounce Plus Size Midi Dress",
        "slug": "tiered-ruffle-flounce-plus-size-midi-dress-1003003",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Tiered Ruffle", "Midi Dress", "Festive Wear", "Ready Stock"],
        "desc": "Flattering three-tiered ruffle flounce dress with a gently defined elasticized waistline. The multi-layer skirt creates graceful rhythmic movement when walking, making it a reliable bestseller for festive parties and weekend church gatherings.",
        "features": [
            "Cascading three-tier ruffle construction with reinforced hem stitching",
            "Elasticized comfort waist with generous stretch accommodating fuller waists",
            "Breathable wrinkle-resistant fabric engineered for tropical retail markets",
            "Pre-packaged mixed color and size cartons available for rapid container loading"
        ]
    },
    {
        "code": "1003004",
        "id": "72",
        "name": "High-Waist Pleated Empire Plus Size Dress",
        "slug": "high-waist-pleated-empire-plus-size-dress-1003004",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Empire Waist", "Pleated Midi", "Guangzhou Wholesale", "Ready Stock"],
        "desc": "Sophisticated empire-waist midi dress featuring permanent heat-set accordion pleats. The raised waistline visually elongates the torso while offering comfortable freedom through the midsection, making it an essential wholesale staple for mature retail clientele.",
        "features": [
            "High empire waist seam positioned to accentuate the smallest part of the torso",
            "Permanent accordion pleating that retains crisp lines through repeated washing",
            "Custom-calibrated plus sizing (XL-5XL) with generous bustline darts",
            "Guangzhou Yulong Market direct shipment with export quality control inspection"
        ]
    },
    {
        "code": "1003005",
        "id": "73",
        "name": "Cape-Sleeve Bodycon Plus Size Midi Dress",
        "slug": "cape-sleeve-bodycon-plus-size-midi-dress-1003005",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Cape Sleeve", "Bodycon Dress", "Evening Gala", "Ready Stock"],
        "desc": "Statuesque bodycon cocktail dress enhanced with an integrated shoulder cape overlay. Crafted from heavy-gauge stretch scuba crepe that smooths and contours the natural waist and hips, delivering red-carpet drama for banquets and celebrations.",
        "features": [
            "Integrated sweeping capelet overlay providing elegant upper arm coverage",
            "Heavyweight four-way stretch scuba knit that holds structure and smooths lines",
            "Back kick pleat and hidden zipper for ease of movement and secure fit",
            "Tailored for high-turnover boutique resale with superior gross profit margins"
        ]
    },
    {
        "code": "1003006",
        "id": "74",
        "name": "Asymmetric Hem Ruched Plus Size Wrap Dress",
        "slug": "asymmetric-hem-ruched-plus-size-wrap-dress-1003006",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Wrap Dress", "Asymmetric Hem", "Curvy Silhouette", "Ready Stock"],
        "desc": "Modern surplice wrap dress styled with side waist ruching and a dramatic high-low cascade hemline. The fixed crossover neckline offers modest yet alluring coverage, tailored to accentuate fuller hour-glass figures without gaping.",
        "features": [
            "Strategically gathered side ruching that flatters the midriff and hip profile",
            "Secure crossover faux-wrap neckline that prevents unintended gaping",
            "Fluid high-low cascade hem with color-matched overcast clean edging",
            "100-piece wholesale starting MOQ ideal for testing boutique regional demand"
        ]
    },
    {
        "code": "1003007",
        "id": "75",
        "name": "Peplum Waist Flute Sleeve Plus Size Dress",
        "slug": "peplum-waist-flute-sleeve-plus-size-dress-1003007",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Peplum Dress", "Flute Sleeve", "Sunday Best", "Ready Stock"],
        "desc": "Regal peplum midi dress featuring structured flared flute sleeves and an architectural waist peplum. This silhouette remains one of the top requested styles across West African capital cities for formal conferences and Sunday worship.",
        "features": [
            "Double-layer structured peplum ruffle that creates an hourglass silhouette",
            "Flared flute cuffs with reinforced seam stability for long-lasting wear",
            "Mid-weight premium poly-crepe that maintains shape in tropical heat",
            "Fast dispatch coordination directly through Guangzhou air and sea freight agents"
        ]
    },
    {
        "code": "1003008",
        "id": "76",
        "name": "Cold-Shoulder Ruffled Plus Size A-Line Dress",
        "slug": "cold-shoulder-ruffled-plus-size-a-line-dress-1003008",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Cold Shoulder", "A-Line Dress", "Summer Festive", "Ready Stock"],
        "desc": "Breezy cold-shoulder A-line dress detailed with delicate flutter ruffles around the shoulder openings. The relaxed flare skirt skims smoothly over the lower body, delivering effortless comfort and modern youth appeal for daytime events and garden celebrations.",
        "features": [
            "Bra-friendly cold-shoulder cutouts framed with delicate ruffle flounces",
            "Generous A-line flare providing complete hip ease across sizes XL to 5XL",
            "Silky-soft poly-blend fabric that breathes well in warm climates",
            "Direct supplier pricing with solid export packaging and pre-shipment inspections"
        ]
    },
    {
        "code": "1003009",
        "id": "77",
        "name": "Mandarin Collar Button-Front Plus Size Shirt Dress",
        "slug": "mandarin-collar-button-front-plus-size-shirt-dress-1003009",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Shirt Dress", "Mandarin Collar", "Boutique Essential", "Ready Stock"],
        "desc": "Polished midi shirt dress featuring a structured mandarin stand collar, a concealed button placket, and a detachable matching fabric sash. Perfectly balances professional office elegance with Sunday church propriety.",
        "features": [
            "Structured mandarin stand collar that maintains its shape without stiffening",
            "Concealed central button placket with durable color-matched buttons",
            "Detachable wide self-tie sash allowing customized waist cinching",
            "Standard wholesale export carton packaging with balanced size breakdowns"
        ]
    },
    {
        "code": "1003010",
        "id": "78",
        "name": "Dolman Sleeve Belted Plus Size Boubou Dress",
        "slug": "dolman-sleeve-belted-plus-size-boubou-dress-1003010",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Boubou Gown", "Dolman Sleeve", "African Royalty", "Ready Stock"],
        "desc": "Contemporary boubou gown showcasing wide-cut dolman sleeves and an internal waist cinch cord. Combining royal West African grandeur with modern ready-to-wear convenience, this style is a perennial high-turnover item for festive seasons.",
        "features": [
            "Voluminous dolman batwing sleeves offering grand regal proportions",
            "Adjustable inner waist tie providing either free-flowing or fitted options",
            "Subtle satin-sheen textured fabric that resists static and snagging",
            "Guangzhou ready-stock inventory ready for fast air-cargo consolidation"
        ]
    },
    {
        "code": "1003011",
        "id": "79",
        "name": "Mermaid Flounce Hem Plus Size Party Dress",
        "slug": "mermaid-flounce-hem-plus-size-party-dress-1003011",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Mermaid Hem", "Party Dress", "Curvy Fashion", "Ready Stock"],
        "desc": "Sculptural midi dress fitted through the torso and thighs before flaring into a high-volume circular mermaid flounce. Designed to celebrate full hips and curves while maintaining dignified modesty for milestone celebrations and banquets.",
        "features": [
            "Voluminous 360-degree circular trumpet flounce hem with reinforced fishing wire",
            "High-stretch elastane-infused crepe for exceptional ease when sitting and walking",
            "Precision French bust and waist darts tailored for fuller African body contours",
            "Factory direct batch ordering with flexible color assortment options"
        ]
    },
    {
        "code": "1003012",
        "id": "80",
        "name": "Lantern Sleeve Keyhole Plus Size Midi Dress",
        "slug": "lantern-sleeve-keyhole-plus-size-midi-dress-1003012",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Lantern Sleeve", "Keyhole Neck", "Church Best", "Ready Stock"],
        "desc": "Classic elegance meets festive flair in this keyhole midi dress. Designed with voluminous lantern sleeves finished with fitted cuffs, an understated front keyhole neckline, and a gentle A-line silhouette tailored for full-figured grace.",
        "features": [
            "Architectural lantern puff sleeves with soft elastic wrist bands",
            "Tasteful teardrop keyhole accent at center collar with hook closure",
            "Smooth lining throughout bodice ensuring non-sheer comfort",
            "Available in ready-stock wholesale lots with fast freight forwarding"
        ]
    },
    {
        "code": "1003013",
        "id": "81",
        "name": "Color-Block Geometric Plus Size Shift Dress",
        "slug": "color-block-geometric-plus-size-shift-dress-1003013",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Color Block", "Geometric Design", "Boutique Retail", "Ready Stock"],
        "desc": "Striking modern shift dress featuring vertical color-block paneling engineered to create a streamlined, slimming optical contour. Crafted from thick, breathable knit crepe that resists wrinkling and holds rich dye vibrancy.",
        "features": [
            "Vertical contrasting color panels scientifically positioned to slim waist profile",
            "Wrinkle-resistant double-knit fabric suitable for long transit and travel",
            "Reinforced crew neckline with smooth clean-finished interior binding",
            "High re-order rate among urban boutiques in Lagos, Accra, and Abidjan"
        ]
    },
    {
        "code": "1003014",
        "id": "82",
        "name": "Double-Frill Bell Sleeve Plus Size Gown",
        "slug": "double-frill-bell-sleeve-plus-size-gown-1003014",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Bell Sleeve", "Double Frill", "Evening Dress", "Ready Stock"],
        "desc": "Graceful full-length plus size gown accented with dramatic double-tiered bell sleeves. The clean silhouette flows smoothly from a jewel neckline down to an ankle-skimming hem, offering modesty and festive opulence for wedding guests.",
        "features": [
            "Dramatic two-tier flared bell sleeves that flutter with every gesture",
            "Comfort-fit silhouette engineered to skim over midriff without restriction",
            "Colorfast reactive dyes that resist fading after frequent washing",
            "Guangzhou Yulong supply direct to freight forwarders with complete documentation"
        ]
    },
    {
        "code": "1003015",
        "id": "83",
        "name": "Off-Shoulder Elastic Ruffle Plus Size Dress",
        "slug": "off-shoulder-elastic-ruffle-plus-size-dress-1003015",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Off Shoulder", "Ruffle Trim", "Resort Wear", "Ready Stock"],
        "desc": "Romantic off-the-shoulder dress with a wide elasticized neckline and an exaggerated cascading ruffle overlay. Delivers comfortable stays-in-place security while highlighting shoulders and collarbones during celebrations and evening outings.",
        "features": [
            "Reinforced elastic shoulder band that stays securely in place when moving",
            "Cascading 8-inch chest flounce creating a flattering bustline frame",
            "Silky lightweight crepe blend ideal for warm coastal evening climates",
            "Ready stock packaging with 100-piece MOQ across sizes XL through 5XL"
        ]
    },
    {
        "code": "1003016",
        "id": "84",
        "name": "Pleated Yoke Flutter Sleeve Plus Size Dress",
        "slug": "pleated-yoke-flutter-sleeve-plus-size-dress-1003016",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Pleated Yoke", "Flutter Sleeve", "Daily Chic", "Ready Stock"],
        "desc": "Airy and feminine midi dress featuring delicate pintuck pleating across the chest yoke and lightweight flutter sleeves. An exceptionally comfortable daily wear and Sunday school piece favored by boutique shoppers seeking modesty with style.",
        "features": [
            "Intricate horizontal pintuck pleating across the front chest panel",
            "Split flutter sleeves that provide upper arm ventilation in hot climates",
            "Roomy flared skirt with deep side seam pockets for practical convenience",
            "Direct factory manufacturing with strict needle-detection and stitch inspections"
        ]
    },
    {
        "code": "1003017",
        "id": "85",
        "name": "Scalloped Neckline Peplum Plus Size Midi Dress",
        "slug": "scalloped-neckline-peplum-plus-size-midi-dress-1003017",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Scalloped Neck", "Peplum Midi", "Formal Gala", "Ready Stock"],
        "desc": "Distinguished formal midi dress crowned with laser-cut scalloped edges around the sweetheart collar and waist peplum. Designed in structured stretch ponte roma fabric, this style delivers executive sophistication for conferences and evening receptions.",
        "features": [
            "Precision scalloped collar framing the neck and shoulders beautifully",
            "Flattering flared waist peplum overlay masking the tummy area seamlessly",
            "Durable stretch ponte roma knit offering substantial weight and smooth drape",
            "Assorted color packaging ready for immediate export dispatch from Guangzhou"
        ]
    },
    {
        "code": "1003018",
        "id": "86",
        "name": "High-Slit Draped Wrap Plus Size Gala Dress",
        "slug": "high-slit-draped-wrap-plus-size-gala-dress-1003018",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Wrap Gala Dress", "High Slit", "Red Carpet", "Ready Stock"],
        "desc": "Glamorous evening gala gown featuring side gathering that drapes into a sophisticated overlap slit. Designed to flatter curvy hips while allowing effortless stride, making it a standout choice for formal dinners and red carpet celebrations.",
        "features": [
            "Sophisticated wrap-look drape gathered at the hip with internal reinforcement",
            "Tasteful overlap slit cut with adequate coverage for walking and sitting",
            "Four-way premium stretch jersey fabric that glides over curves",
            "100-piece MOQ with flexible 500/1000/3000 scale wholesale pricing tiers"
        ]
    },
    {
        "code": "1003019",
        "id": "87",
        "name": "Kimono Sleeve Tie-Waist Plus Size Dress",
        "slug": "kimono-sleeve-tie-waist-plus-size-dress-1003019",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Kimono Sleeve", "Tie Waist", "African Boutique", "Ready Stock"],
        "desc": "Versatile kimono-inspired plus size dress featuring wide rectangular cut sleeves and an attached self-fabric wrap belt. Can be tied in the front, back, or side to adjust the fit according to individual waist proportions.",
        "features": [
            "Authentic wide kimono sleeves offering relaxed breathability and regal drape",
            "Extra-long sash belt allowing double-wrap styling around the waist",
            "Substantial non-see-through fabric that requires no additional slip undergarment",
            "Proven boutique seller with high customer satisfaction and low return rates"
        ]
    },
    {
        "code": "1003020",
        "id": "88",
        "name": "Cowl Neck Ruched Bodice Plus Size Dress",
        "slug": "cowl-neck-ruched-bodice-plus-size-dress-1003020",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Cowl Neck", "Ruched Bodice", "Evening Glam", "Ready Stock"],
        "desc": "Sensational party dress showcasing a fluid draped cowl neckline and all-over side-seam ruching. The tailored stretch fabric molds comfortably to the body while the cowl collar draws attention upward to jewelry and headwraps.",
        "features": [
            "Fluid cowl neckline that drapes gracefully across the decolletage",
            "Horizontal ruching panels through torso that flatter and disguise figure lines",
            "High-resilience spandex-blend knit that bounces back without bagging",
            "Export cartons pre-sorted with 6 popular colorways for fast retail stocking"
        ]
    },
    {
        "code": "1003021",
        "id": "89",
        "name": "Tiered Smock Puff Sleeve Plus Size Dress",
        "slug": "tiered-smock-puff-sleeve-plus-size-dress-1003021",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Puff Sleeve", "Tiered Smock", "Weekend Chic", "Ready Stock"],
        "desc": "Contemporary tiered smock dress combining voluminous puff sleeves with three breezy gathered skirt tiers. Offers maximum comfort and freedom of movement while projecting an effortlessly fashionable silhouette for weekend outings.",
        "features": [
            "Voluminous puff sleeves structured with soft internal shoulder gathers",
            "Roomy three-tier smock body allowing complete ease of movement",
            "Lightweight, skin-friendly cotton-blend fabric ideal for high-humidity climates",
            "Fast inventory turnaround from Guangzhou warehouse directly to your cargo agent"
        ]
    },
    {
        "code": "1003022",
        "id": "90",
        "name": "Golden Trim Embroidered Plus Size Dashiki Dress",
        "slug": "golden-trim-embroidered-plus-size-dashiki-dress-1003022",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Dashiki Dress", "Gold Embroidery", "Cultural Heritage", "Ready Stock"],
        "desc": "Heritage-inspired dashiki dress tailored for curvy figures. Features intricate gold-thread embroidery along the split mandarin neckline and pocket openings, combining authentic cultural prestige with modern plus-size tailoring.",
        "features": [
            "Intricate ethnic gold bullion embroidery around collar, placket, and pocket flaps",
            "Structured split-mandarin neck design that elongates the neck profile",
            "Twin hidden side pockets tailored deep enough to hold smartphones and essentials",
            "Wholesale ready stock with comprehensive size distribution from XL to 5XL"
        ]
    },
    {
        "code": "1003023",
        "id": "91",
        "name": "Asymmetric Capelet Overlay Plus Size Dress",
        "slug": "asymmetric-capelet-overlay-plus-size-dress-1003023",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Asymmetric Capelet", "Evening Gown", "Boutique Exclusive", "Ready Stock"],
        "desc": "Dramatic evening cocktail dress highlighted by a one-sided cascading capelet that cascades from the left shoulder down to the hip. The underlying sheath dress provides a smooth, flattering fit for high-profile social galas.",
        "features": [
            "Asymmetric one-shoulder chiffon capelet that ripples gracefully with movement",
            "Underlying form-fitting shift dress in supportive stretch crepe",
            "Concealed side zipper with hook-and-eye closure for a seamless silhouette",
            "Guangzhou Yulong Market direct pricing with bulk tier discounts"
        ]
    },
    {
        "code": "1003024",
        "id": "92",
        "name": "Trumpet Sleeve Flared Hem Plus Size Midi Dress",
        "slug": "trumpet-sleeve-flared-hem-plus-size-midi-dress-1003024",
        "category": "Plus Size Dresses",
        "tags": ["Plus Size", "Trumpet Sleeve", "Flared Hem", "Celebration Wear", "Ready Stock"],
        "desc": "Celebration-ready midi dress finished with wide trumpet sleeves and an exaggerated flared hemline. Cut with precision princess seams that sculpt an hourglass silhouette, making it an instant crowd favorite for banquet hosts and guests.",
        "features": [
            "Wide flared trumpet sleeves that lend a majestic flourish to every gesture",
            "Princess vertical seams providing structural shaping through bust and waist",
            "Substantial four-way stretch fabric that resists creasing during long wear",
            "Factory packaging ready for wholesale palletization and air cargo handover"
        ]
    },

    # -------------------------------------------------------------------------
    # 2. Maxi Dresses (1003025 ~ 1003044, 20 items, ID: 93 ~ 112)
    # -------------------------------------------------------------------------
    {
        "code": "1003025",
        "id": "93",
        "name": "Regal Embroidered Neckline Boubou Maxi Gown",
        "slug": "regal-embroidered-neckline-boubou-maxi-gown-1003025",
        "category": "Maxi Dresses",
        "tags": ["Maxi Dress", "Boubou Gown", "Embroidery", "African Royalty", "Ready Stock"],
        "desc": "A magnificent floor-length boubou maxi gown crowned with dense metallic gold embroidery at the neckline and sleeve openings. Designed with expansive wide sleeves and a majestic sweeping hemline that embodies West African royal elegance for ceremonies and milestone celebrations.",
        "features": [
            "Intricate high-density gold and silk thread embroidery along the neckline",
            "Floor-sweeping regal boubou silhouette offering complete coverage and grandeur",
            "Silky poly-twill fabric with rich luster and fluid drape that stays cool",
            "Guangzhou wholesale direct export with 100-piece MOQ across 6 iconic colorways"
        ]
    },
    {
        "code": "1003026",
        "id": "94",
        "name": "Pleated Sunray Accordion African Maxi Dress",
        "slug": "pleated-sunray-accordion-african-maxi-dress-1003026",
        "category": "Maxi Dresses",
        "tags": ["Maxi Dress", "Accordion Pleats", "Sunray Pleat", "Gala Gown", "Ready Stock"],
        "desc": "Spectacular full-length maxi dress boasting hundreds of precision heat-set accordion sunray pleats that cascade from an empire waist to the floor. The dress flares outwards dramatically with every turn, creating a breathtaking visual spectacle for galas and banquets.",
        "features": [
            "Permanent high-heat sunray pleating that retains crispness after transit and washing",
            "Halter-style crossover bodice with soft neckties and flexible fit",
            "Full 360-degree expansive skirt sweep requiring over 4 meters of premium fabric",
            "High-margin boutique staple with rapid turnaround across African diaspora markets"
        ]
    },
    {
        "code": "1003027",
        "id": "95",
        "name": "Tiered Flared Boho Maxi Gown with Gold Trim",
        "slug": "tiered-flared-boho-maxi-gown-with-gold-trim-1003027",
        "category": "Maxi Dresses",
        "tags": ["Maxi Dress", "Tiered Maxi", "Gold Trim", "Boho Elegance", "Ready Stock"],
        "desc": "Romantic tiered bohemian maxi gown detailed with shimmering gold woven braid bordering each tier. Built with a comfortable smocked elastic bodice that stretches to accommodate multiple bust sizes while ensuring a flattering, secure fit.",
        "features": [
            "Four voluminous gathered tiers accented with gold lurex woven trim",
            "Elasticized smocked chest panel providing exceptional size flexibility",
            "Lightweight, breathable fabric engineered for hot daytime outdoor celebrations",
            "Export ready stock packed in protective polybags with clear size/color stickers"
        ]
    },
    {
        "code": "1003028",
        "id": "96",
        "name": "High-Neck Mermaid Silhouette African Maxi Dress",
        "slug": "high-neck-mermaid-silhouette-african-maxi-dress-1003028",
        "category": "Maxi Dresses",
        "tags": ["Maxi Dress", "Mermaid Gown", "High Neck", "Wedding Guest", "Ready Stock"],
        "desc": "Commanding evening maxi dress combining a structured high mandarin neckline with a body-hugging mermaid silhouette. Fitted smoothly down to the knees before flaring into a floor-sweeping train, perfect for upscale weddings and state dinners.",
        "features": [
            "Architectural high stand collar with discreet back button and zipper closure",
            "Dramatic flared mermaid hem designed to accentuate hip-to-waist curves",
            "Heavyweight four-way stretch fabric that provides built-in shape retention",
            "Wholesale export pricing direct from Guangzhou Yulong garment trading hub"
        ]
    },
    {
        "code": "1003029",
        "id": "97",
        "name": "Off-Shoulder Cascading Ruffle Gala Maxi Dress",
        "slug": "off-shoulder-cascading-ruffle-gala-maxi-dress-1003029",
        "category": "Maxi Dresses",
        "tags": ["Maxi Dress", "Off Shoulder", "Cascading Ruffle", "Red Carpet", "Ready Stock"],
        "desc": "Show-stopping gala maxi gown featuring an exaggerated off-shoulder ruffle neckline and a daring yet tasteful side slit. The dress balances sensual shoulder exposure with sweeping floor-length majesty, favored by boutique clients attending high-profile events.",
        "features": [
            "Voluminous multi-layer ruffle flounce framing shoulders, decolletage, and back",
            "Discreet interior silicone gripper tape ensuring non-slip shoulder positioning",
            "Tailored side walking slit allowing graceful stride in high-heeled footwear",
            "Assorted cartons available with 100-piece minimum wholesale commitment"
        ]
    },
    {
        "code": "1003030",
        "id": "98",
        "name": "Capelet Overlay Column African Maxi Dress",
        "slug": "capelet-overlay-column-african-maxi-dress-1003030",
        "category": "Maxi Dresses",
        "tags": ["Maxi Dress", "Capelet Gown", "Column Maxi", "Church Gala", "Ready Stock"],
        "desc": "Regal column maxi dress adorned with an attached chiffon capelet that drapes gracefully over the shoulders and upper back. The straight column skirt features a center back kick pleat for comfortable, dignified walking at church convocations and formal banquets.",
        "features": [
            "Attached flowing chiffon capelet overlay offering modest upper body coverage",
            "Straight-cut column maxi skirt that elongates the wearer's vertical silhouette",
            "Premium stretch crepe fabric that drapes smoothly without clinging or wrinkling",
            "Factory inventory in Guangzhou ready for fast freight agent dispatch"
        ]
    },
    {
        "code": "1003031",
        "id": "99",
        "name": "Smocked Bodice Tiered Gypsy Maxi Dress",
        "slug": "smocked-bodice-tiered-gypsy-maxi-dress-1003031",
        "category": "Maxi Dresses",
        "tags": ["Maxi Dress", "Smocked Bodice", "Gypsy Maxi", "Resort Chic", "Ready Stock"],
        "desc": "Effortlessly chic gypsy maxi dress crafted with an all-over shirred elastic bodice and a full three-tier gathered skirt. Designed to deliver superior comfort in tropical weather while maintaining vibrant, head-turning elegance.",
        "features": [
            "Extensive elastic smocking across entire bodice providing adaptive stretch",
            "Puff short sleeves with elastic ruffles that can be styled on or off shoulder",
            "Generous full-sweep skirt requiring substantial fabric yardage for dramatic volume",
            "Direct wholesale ordering with flexible color assortment ratios per carton"
        ]
    },
    {
        "code": "1003032",
        "id": "100",
        "name": "Bishop Sleeve High-Slit African Maxi Gown",
        "slug": "bishop-sleeve-high-slit-african-maxi-gown-1003032",
        "category": "Maxi Dresses",
        "tags": ["Maxi Dress", "Bishop Sleeve", "High Slit", "Evening Elegance", "Ready Stock"],
        "desc": "Sophisticated evening maxi gown styled with billowy bishop sleeves, extended three-button cuffs, and a modest crossover V-neckline. A tailored front walking slit adds modern glamour, making it a favorite for banquet hosts and formal event attendees.",
        "features": [
            "Voluminous bishop sleeves with reinforced cuff plackets and decorative buttons",
            "Surplice V-neckline cut with secure tacking to prevent shifting during movement",
            "Smooth four-way stretch fabric with anti-crease finish for overseas transport",
            "100-piece MOQ with tiered pricing discounts for 500, 1000, and 3000 piece orders"
        ]
    },
    {
        "code": "1003033",
        "id": "101",
        "name": "Halter-Neck Pleated Grecian Maxi Dress",
        "slug": "halter-neck-pleated-grecian-maxi-dress-1003033",
        "category": "Maxi Dresses",
        "tags": ["Maxi Dress", "Halter Neck", "Pleated Grecian", "Summer Banquet", "Ready Stock"],
        "desc": "Statuesque Grecian-inspired maxi gown featuring a gathered halter neckline with back ties and all-over micro-pleated skirt. Skims gracefully over the figure, creating an elongated, majestic profile ideal for beachside gala weddings and summer festivals.",
        "features": [
            "Gathered halter neck collar with soft extra-long satin ribbon neckties",
            "All-over micro accordion pleating providing dynamic 360-degree flow",
            "Elasticized waist seam offering easy step-in dressing and flexible fit",
            "Guangzhou ready stock with direct door-to-port freight forwarding coordination"
        ]
    },
    {
        "code": "1003034",
        "id": "102",
        "name": "One-Shoulder Cascade Ruffle Evening Maxi Gown",
        "slug": "one-shoulder-cascade-ruffle-evening-maxi-gown-1003034",
        "category": "Maxi Dresses",
        "tags": ["Maxi Dress", "One Shoulder", "Cascade Ruffle", "Red Carpet Gala", "Ready Stock"],
        "desc": "Daring and opulent one-shoulder evening gown accented with a dramatic architectural ruffle that cascades down the right side of the bodice to the hip. The column maxi skirt drapes to the floor, exuding red-carpet prestige.",
        "features": [
            "Sculptural one-shoulder neckline with layered ruffled flounce accent",
            "Body-contouring side darts that enhance waist and hip curves seamlessly",
            "Thick stretch-crepe fabric providing flattering coverage without see-through",
            "Guangzhou Yulong wholesale direct with complete export packing documentation"
        ]
    },
    {
        "code": "1003035",
        "id": "103",
        "name": "Floral Lace Overlay Long Sleeve Maxi Gown",
        "slug": "floral-lace-overlay-long-sleeve-maxi-gown-1003035",
        "category": "Maxi Dresses",
        "tags": ["Maxi Dress", "Lace Gown", "Long Sleeve", "Wedding Banquet", "Ready Stock"],
        "desc": "Exquisite formal maxi gown featuring a delicate floral corded lace overlay atop a full, opaque stretch lining. Long sheer lace sleeves and a scalloped eyelash lace hemline create an unforgettable heirloom aesthetic for bridal parties and VIP church events.",
        "features": [
            "Corded floral lace overlay with rich dimensional texture and soft hand feel",
            "Full-length opaque stretch underlay ensuring complete modesty and comfort",
            "Scalloped eyelash lace trimming along cuffs, neckline, and lower hem",
            "High-margin bridal and formal wear collection staple with low return rates"
        ]
    },
    {
        "code": "1003036",
        "id": "104",
        "name": "Double Slit Crossover Wrap African Maxi Dress",
        "slug": "double-slit-crossover-wrap-african-maxi-dress-1003036",
        "category": "Maxi Dresses",
        "tags": ["Maxi Dress", "Double Slit", "Wrap Maxi", "Resort Glam", "Ready Stock"],
        "desc": "Breezy resort maxi dress styled with a crossover wrap bodice and dual side slits for maximum airflow and movement. Crafted from silky, lightweight poly-jersey that resists wrinkling in transit and packs easily for holiday travel.",
        "features": [
            "Surplice crossover wrap front providing adjustable bust coverage",
            "Symmetrical twin side slits engineered for effortless walking and ventilation",
            "Lightweight travel-friendly fabric that emerges wrinkle-free from suitcases",
            "100-piece initial order MOQ with balanced color and size packing lists"
        ]
    },
    {
        "code": "1003037",
        "id": "105",
        "name": "Flutter Sleeve Tiered Prairie African Maxi Gown",
        "slug": "flutter-sleeve-tiered-prairie-african-maxi-gown-1003037",
        "category": "Maxi Dresses",
        "tags": ["Maxi Dress", "Flutter Sleeve", "Prairie Maxi", "Sunday Chic", "Ready Stock"],
        "desc": "Graceful prairie-inspired maxi gown enhanced with layered flutter sleeves and three tiers of gathered ruffles. A tasteful square neckline frames statement necklaces, making this a beloved choice for Sunday best and family milestone photoshoots.",
        "features": [
            "Layered double flutter sleeves that ripple gently in tropical breezes",
            "Flattering square neckline cut modest enough for traditional church gatherings",
            "Three expansive gathered skirt tiers providing sweeping fullness",
            "Guangzhou warehouse dispatch with express air-cargo consolidation options"
        ]
    },
    {
        "code": "1003038",
        "id": "106",
        "name": "Statement Puff Sleeve Square-Neck Maxi Dress",
        "slug": "statement-puff-sleeve-square-neck-maxi-dress-1003038",
        "category": "Maxi Dresses",
        "tags": ["Maxi Dress", "Puff Sleeve", "Square Neck", "High Fashion", "Ready Stock"],
        "desc": "High-fashion maxi dress defined by dramatic pleated puff sleeves and an architectural square neckline. The straight-cut maxi skirt features side pockets and an elegant silhouette, effortlessly bridging runway drama with boutique commercial viability.",
        "features": [
            "Architectural puff shoulders reinforced with soft interior netting for lasting volume",
            "Clean-finished square neckline that flatters shoulders and collarbones",
            "Two functional side-seam pockets seamlessly integrated into skirt panels",
            "Proven wholesale seller with exceptional re-order rates across boutique retailers"
        ]
    },
    {
        "code": "1003039",
        "id": "107",
        "name": "Metallic Foil Printed Kaftan African Maxi Gown",
        "slug": "metallic-foil-printed-kaftan-african-maxi-gown-1003039",
        "category": "Maxi Dresses",
        "tags": ["Maxi Dress", "Foil Print", "Kaftan Maxi", "African Luxury", "Ready Stock"],
        "desc": "Opulent luxury kaftan maxi gown embellished with gold metallic foil ethnic geometric motifs that shimmer under ballroom lights. Featuring wide kimono sleeves and a flowing A-line silhouette, this piece is tailor-made for royal celebrations and holiday galas.",
        "features": [
            "Heat-bonded metallic gold foil prints that resist cracking and peeling",
            "Wide batwing-kimono sleeves providing regal drape and uncompromised comfort",
            "Silky poly-satin fabric that glides smoothly over curves without static",
            "Direct factory supply from Guangzhou with prompt cargo booking support"
        ]
    },
    {
        "code": "1003040",
        "id": "108",
        "name": "Bell Sleeve Tiered A-Line Banquet Maxi Dress",
        "slug": "bell-sleeve-tiered-a-line-banquet-maxi-dress-1003040",
        "category": "Maxi Dresses",
        "tags": ["Maxi Dress", "Bell Sleeve", "Banquet Maxi", "Modest Fashion", "Ready Stock"],
        "desc": "Dignified banquet maxi dress featuring flared bell sleeves and an expansive tiered A-line skirt. Offering complete modest coverage with elevated style, this dress is highly requested by boutique owners serving upscale church and cultural associations.",
        "features": [
            "Dramatic flared bell sleeves extending from elbow to wrist with clean rolled hems",
            "Flattering multi-tiered skirt that drapes gracefully over hips and thighs",
            "High-density fabric blend that maintains rich color saturation wash after wash",
            "Wholesale starting MOQ of 100 pieces with 4 MOQ tiers up to 3000 pieces"
        ]
    },
    {
        "code": "1003041",
        "id": "109",
        "name": "Asymmetric Cape Sleeve Draped Evening Maxi",
        "slug": "asymmetric-cape-sleeve-draped-evening-maxi-1003041",
        "category": "Maxi Dresses",
        "tags": ["Maxi Dress", "Cape Sleeve", "Draped Maxi", "Gala Red Carpet", "Ready Stock"],
        "desc": "Modern red-carpet maxi dress showcasing an asymmetric floor-sweeping cape sleeve on one side and a sleeveless armhole on the other. Delicate hip drapery flatters curves, creating an unforgettable entrance at evening galas and awards nights.",
        "features": [
            "Asymmetric full-length cape sleeve that billows gracefully with every movement",
            "Gently gathered side drape designed to flatter and disguise the midsection",
            "Premium four-way stretch crepe knit with heavy, luxurious hand drape",
            "Export cartons pre-sorted with 6 classic African jewel and earth tones"
        ]
    },
    {
        "code": "1003042",
        "id": "110",
        "name": "Keyhole Cutout Halter Pleated African Maxi Dress",
        "slug": "keyhole-cutout-halter-pleated-african-maxi-dress-1003042",
        "category": "Maxi Dresses",
        "tags": ["Maxi Dress", "Keyhole Halter", "Pleated Maxi", "Party Glam", "Ready Stock"],
        "desc": "Sensational evening maxi featuring a metallic bar halter neckline, a centered teardrop keyhole cutout, and a cascading accordion pleated skirt. The design highlights shoulders while delivering magnificent movement across dance floors.",
        "features": [
            "Metallic gold accent bar at halter neckline providing built-in jewelry glamour",
            "Tastefully proportioned teardrop front keyhole with modest dimensions",
            "Heat-set accordion pleats that stay sharp through humid conditions and dancing",
            "Fast wholesale container and air-freight dispatch directly from Guangzhou"
        ]
    },
    {
        "code": "1003043",
        "id": "111",
        "name": "Sweetheart Neckline Trumpet African Maxi Gown",
        "slug": "sweetheart-neckline-trumpet-african-maxi-gown-1003043",
        "category": "Maxi Dresses",
        "tags": ["Maxi Dress", "Sweetheart Neck", "Trumpet Gown", "Bridal Guest", "Ready Stock"],
        "desc": "Feminine trumpet maxi gown boasting an arched sweetheart neckline, internal boning structure for bust support, and a flared circular hemline. An indispensable evening style for wedding guests, bridal parties, and formal galas.",
        "features": [
            "Structured sweetheart bustier bodice with light internal boning support",
            "Flared trumpet skirt opening from mid-thigh down to an expansive floor sweep",
            "Thick stretch-crepe fabric that shapes and holds curves comfortably",
            "High retail resale margin item with steady repeat orders across diaspora stores"
        ]
    },
    {
        "code": "1003044",
        "id": "112",
        "name": "Floor-Length Batwing Pleated Modesty Maxi Dress",
        "slug": "floor-length-batwing-pleated-modesty-maxi-dress-1003044",
        "category": "Maxi Dresses",
        "tags": ["Maxi Dress", "Batwing Maxi", "Modesty Dress", "Pleated Gown", "Ready Stock"],
        "desc": "Majestic modesty maxi dress featuring wide batwing sleeves, a conservative high crew neckline, and fine micro-pleating throughout the entire garment. Delivers complete modest coverage paired with breathtaking runway elegance.",
        "features": [
            "Full modesty cut featuring high round neckline and floor-length coverage",
            "Wide batwing sleeve silhouette allowing unhindered airflow and movement",
            "Fine micro-pleated textured fabric that conceals undergarment lines effortlessly",
            "Guangzhou Yulong Market direct stock with rapid courier and cargo dispatch"
        ]
    },

    # -------------------------------------------------------------------------
    # 3. Two Piece Sets (1003045 ~ 1003060, 16 items, ID: 113 ~ 128)
    # -------------------------------------------------------------------------
    {
        "code": "1003045",
        "id": "113",
        "name": "Peplum Top & High-Waist Mermaid Skirt Set",
        "slug": "peplum-top-high-waist-mermaid-skirt-set-1003045",
        "category": "Two Piece Sets",
        "tags": ["Two Piece Sets", "Peplum Top", "Mermaid Skirt", "Sunday Best", "Ready Stock"],
        "desc": "Iconic African B2B two-piece set pairing a structured double-layer peplum blouse with a high-waist mermaid maxi skirt. This coordinated duo accentuates waist-to-hip proportions, delivering the quintessential regal look for church ceremonies and traditional weddings.",
        "features": [
            "Double-layer flared peplum blouse with back zipper and jewel neckline",
            "High-waist mermaid skirt flaring from knees to floor with walking comfort",
            "Heavyweight four-way stretch fabric that smooths contours and resists creasing",
            "Guangzhou factory-direct inventory with 100-piece mixed size and color cartons"
        ]
    },
    {
        "code": "1003046",
        "id": "114",
        "name": "Asymmetric Tunic & Wide-Leg Palazzo Pant Set",
        "slug": "asymmetric-tunic-wide-leg-palazzo-pant-set-1003046",
        "category": "Two Piece Sets",
        "tags": ["Two Piece Sets", "Asymmetric Tunic", "Palazzo Pants", "Modern African", "Ready Stock"],
        "desc": "Contemporary two-piece ensemble combining a dramatic high-low tunic top with flowing wide-leg palazzo trousers. Deep side slits on the tunic offer freedom of movement while revealing the high-rise waistband of the palazzo pants.",
        "features": [
            "Dramatic high-low tunic hem reaching calf length in back with side slits",
            "Full-length wide-leg palazzo pants with comfortable elasticated waistband",
            "Silky, non-sheer poly-spandex knit that breathes well in tropical heat",
            "High wholesale turnover item across boutiques in Nigeria, Ghana, and Kenya"
        ]
    },
    {
        "code": "1003047",
        "id": "115",
        "name": "Kimono Cardigan & Pencil Skirt African Twin Set",
        "slug": "kimono-cardigan-pencil-skirt-african-twin-set-1003047",
        "category": "Two Piece Sets",
        "tags": ["Two Piece Sets", "Kimono Cardigan", "Pencil Skirt", "Executive Chic", "Ready Stock"],
        "desc": "Sophisticated executive twin set featuring an open-front draped kimono duster cardigan paired with a coordinating high-waist stretch pencil skirt. Offers incredible styling versatility as pieces can be worn together or mixed with existing wardrobe basics.",
        "features": [
            "Calf-length draped kimono duster with clean-finished front lapels",
            "High-waist pencil midi skirt with supportive elastic waist and back kick vent",
            "Durable interlock stretch knit that maintains shape after long workdays",
            "Standard wholesale export cartons with pre-checked size distribution"
        ]
    },
    {
        "code": "1003048",
        "id": "116",
        "name": "Batwing Top & Straight-Leg Trouser Set",
        "slug": "batwing-top-straight-leg-trouser-set-1003048",
        "category": "Two Piece Sets",
        "tags": ["Two Piece Sets", "Batwing Top", "Straight Trouser", "Everyday Luxury", "Ready Stock"],
        "desc": "Effortless casual luxury two-piece set featuring a relaxed batwing pullover blouse and tailored straight-leg trousers. Designed for full-figured comfort and chic modern style for travel, boutique retail, and daily executive wear.",
        "features": [
            "Relaxed batwing sleeve blouse with fitted ribbed wrist cuffs",
            "Tailored straight-leg pants with functional side pockets and elastic back",
            "Soft-touch poly-viscose blend that drapes smoothly and resists static",
            "Direct supplier dispatch from Guangzhou Yulong wholesale trading market"
        ]
    },
    {
        "code": "1003049",
        "id": "117",
        "name": "Ruffle Shoulder Blouse & Bodycon Midi Skirt Set",
        "slug": "ruffle-shoulder-blouse-bodycon-midi-skirt-set-1003049",
        "category": "Two Piece Sets",
        "tags": ["Two Piece Sets", "Ruffle Shoulder", "Bodycon Skirt", "Party Set", "Ready Stock"],
        "desc": "Festive two-piece cocktail set featuring architectural cascading ruffles across the shoulders of the blouse, matched with a body-contouring pencil midi skirt. Delivers high visual impact and photogenic charm for parties and weekend functions.",
        "features": [
            "Tiered structural ruffles positioned vertically along shoulder seams",
            "Midi pencil skirt designed to sculpt and flatter fuller hip contours",
            "Stretch crepe fabrication providing firm support and excellent recovery",
            "100-piece initial order MOQ with tiered wholesale pricing up to 3000 units"
        ]
    },
    {
        "code": "1003050",
        "id": "118",
        "name": "Button-Down Vest & Pleated Palazzo Pant Set",
        "slug": "button-down-vest-pleated-palazzo-pant-set-1003050",
        "category": "Two Piece Sets",
        "tags": ["Two Piece Sets", "Tailored Vest", "Pleated Palazzo", "Power Dressing", "Ready Stock"],
        "desc": "Fashion-forward power set matching a tailored sleeveless button-front vest with fluid knife-pleated palazzo pants. Accented with engraved gold buttons, this set provides sharp urban sophistication for business owners and fashion influencers.",
        "features": [
            "Tailored vest with V-neckline, pointed hem, and decorative gold metallic buttons",
            "All-over knife-pleated palazzo trousers with sweeping wide-leg motion",
            "Wrinkle-resistant suiting crepe that holds sharp pleats through shipping",
            "Direct factory export packaging with complete air-cargo documentation"
        ]
    },
    {
        "code": "1003051",
        "id": "119",
        "name": "Capelet Blazer Top & Tailored Trouser Set",
        "slug": "capelet-blazer-top-tailored-trouser-set-1003051",
        "category": "Two Piece Sets",
        "tags": ["Two Piece Sets", "Cape Blazer", "Tailored Trouser", "Royal Executive", "Ready Stock"],
        "desc": "Commanding executive set featuring a structured cape-blazer with split sleeves, paired with tailored slim-straight pants. Radiates regal authority and refined glamour, making it a top seller for corporate galas and formal ceremonies.",
        "features": [
            "Split capelet sleeve blazer that allows free arm movement with royal cape drape",
            "High-waist tailored pants with smooth front waistband and discreet side zip",
            "Substantial stretch twill fabric providing crisp architectural silhouette",
            "High re-order frequency across Caribbean and African retail boutiques"
        ]
    },
    {
        "code": "1003052",
        "id": "120",
        "name": "Bell Sleeve Wrap Top & Flared Pant Set",
        "slug": "bell-sleeve-wrap-top-flared-pant-set-1003052",
        "category": "Two Piece Sets",
        "tags": ["Two Piece Sets", "Wrap Top", "Flared Pants", "Retro Glamour", "Ready Stock"],
        "desc": "Glamorous retro-inspired two-piece set featuring an adjustable wrap blouse with dramatic bell cuffs, matched with high-waist flared trousers. The wrap tie allows customizable waist definition, catering seamlessly to diverse figure types.",
        "features": [
            "Adjustable crossover wrap top with long waist sash for flexible styling",
            "Dramatic flared bell sleeves with reinforced double-turned hems",
            "Bootcut flare trousers that visually elongate legs and balance fuller hips",
            "Guangzhou ready-stock inventory with pre-shipment quality inspection"
        ]
    },
    {
        "code": "1003053",
        "id": "121",
        "name": "Crop Tie-Front Shirt & Tiered Maxi Skirt Set",
        "slug": "crop-tie-front-shirt-tiered-maxi-skirt-set-1003053",
        "category": "Two Piece Sets",
        "tags": ["Two Piece Sets", "Tie Front Shirt", "Tiered Maxi Skirt", "Holiday Set", "Ready Stock"],
        "desc": "Vibrant holiday set consisting of a collared front-knot blouse and a voluminous three-tier maxi skirt. The high-rise skirt waistband meets the tie-front blouse with modest, refined proportions suited for vacation resorts and summer festivities.",
        "features": [
            "Collared tie-front blouse with functional button placket and adjustable tie",
            "Voluminous three-tier gathered maxi skirt with fully elasticized comfort waistband",
            "Lightweight, breathable poly-cotton blend suited for coastal African climates",
            "Assorted color cartons ready for fast international freight forwarder pickup"
        ]
    },
    {
        "code": "1003054",
        "id": "122",
        "name": "Off-Shoulder Flounce Top & Slit Mermaid Skirt Set",
        "slug": "off-shoulder-flounce-top-slit-mermaid-skirt-set-1003054",
        "category": "Two Piece Sets",
        "tags": ["Two Piece Sets", "Off Shoulder Top", "Mermaid Skirt", "Celebration Set", "Ready Stock"],
        "desc": "Dramatic celebration two-piece set pairing an elasticized off-shoulder top with an oversized chest flounce, alongside a high-waist mermaid maxi skirt with a modest front side slit. Ideal for wedding guest attire and birthday banquets.",
        "features": [
            "Wide off-the-shoulder elastic neckline with an 8-inch cascading ruffle flounce",
            "High-waist mermaid skirt featuring front side slit and circular trumpet flare",
            "Four-way stretch poly-crepe that moves effortlessly and resists wrinkles",
            "Wholesale scale discounts available across 100, 500, 1000, and 3000 MOQ tiers"
        ]
    },
    {
        "code": "1003055",
        "id": "123",
        "name": "Embroidered Longline Tunic & Cigarette Pant Set",
        "slug": "embroidered-longline-tunic-cigarette-pant-set-1003055",
        "category": "Two Piece Sets",
        "tags": ["Two Piece Sets", "Longline Tunic", "Cigarette Pant", "Gold Embroidery", "Ready Stock"],
        "desc": "Cultural prestige meets modern tailoring in this longline tunic set. The knee-length tunic features high side slits and intricate gold embroidery along the Mandarin collar, paired with matching slim-cut cigarette trousers.",
        "features": [
            "Knee-length tunic with high side slits allowing effortless access to pants",
            "Intricate gold cord embroidery along the mandarin placket and sleeve cuffs",
            "Slim-leg stretch cigarette trousers with elastic waistband for all-day comfort",
            "Guangzhou Yulong direct export supply with solid quality guarantees"
        ]
    },
    {
        "code": "1003056",
        "id": "124",
        "name": "Halter Peplum Blouse & Wide-Leg Pant Set",
        "slug": "halter-peplum-blouse-wide-leg-pant-set-1003056",
        "category": "Two Piece Sets",
        "tags": ["Two Piece Sets", "Halter Peplum", "Wide Leg Pants", "Summer Gala", "Ready Stock"],
        "desc": "Stunning summer gala ensemble pairing a high halter-neck peplum top with floor-skimming wide-leg palazzo trousers. Accentuates shoulders and creates an hourglass waist contour, proving an instant bestseller in warm-weather boutiques.",
        "features": [
            "Halter neckline with back button closure and flared waist peplum",
            "Floor-length wide-leg palazzo trousers with high-rise supportive waistband",
            "Richly dyed stretch crepe with high colorfastness in tropical sunshine",
            "Fast consolidation with Guangzhou shipping agents for air and ocean freight"
        ]
    },
    {
        "code": "1003057",
        "id": "125",
        "name": "Cowl Neck Draped Top & Pleated Maxi Skirt Set",
        "slug": "cowl-neck-draped-top-pleated-maxi-skirt-set-1003057",
        "category": "Two Piece Sets",
        "tags": ["Two Piece Sets", "Cowl Neck Top", "Pleated Maxi Skirt", "Evening Chic", "Ready Stock"],
        "desc": "Sensuous evening set matching a sleeveless draped cowl-neck blouse with an all-over accordion pleated maxi skirt. The liquid drape of the cowl top complements the geometric rhythm of the pleated skirt for gallery openings and galas.",
        "features": [
            "Liquid cowl neckline that drapes gracefully across the decolletage",
            "Permanent accordion pleat maxi skirt with elastic waistband and full sweep",
            "Silky touch fabric with subtle luster that shines under evening illumination",
            "Pre-sorted cartons with 6 classic African jewel and earth colorways"
        ]
    },
    {
        "code": "1003058",
        "id": "126",
        "name": "Double-Breasted Blazer Jacket & Pencil Skirt Set",
        "slug": "double-breasted-blazer-jacket-pencil-skirt-set-1003058",
        "category": "Two Piece Sets",
        "tags": ["Two Piece Sets", "Blazer Jacket", "Pencil Skirt", "Formal Suiting", "Ready Stock"],
        "desc": "Tailored two-piece business and church suiting set comprising a short double-breasted jacket with embossed gold buttons and a coordinating knee-length pencil skirt. Projects dignity, polish, and elegance for Sunday services and corporate events.",
        "features": [
            "Short double-breasted jacket with notched lapels and engraved gold buttons",
            "Tailored pencil skirt with back zipper, button closure, and walking vent",
            "Substantial stretch ponte suiting fabric that maintains structure and comfort",
            "Guangzhou Yulong wholesale direct supply with 100-piece low starting MOQ"
        ]
    },
    {
        "code": "1003059",
        "id": "127",
        "name": "Cascading Waterfall Duster & Trouser Set",
        "slug": "cascading-waterfall-duster-trouser-set-1003059",
        "category": "Two Piece Sets",
        "tags": ["Two Piece Sets", "Waterfall Duster", "Ankle Trouser", "Layered Elegance", "Ready Stock"],
        "desc": "Versatile layered ensemble matching a floor-length open-front waterfall duster cardigan with tailored ankle-length trousers. Can be layered over camisoles or fitted tops, offering endless chic permutations for boutique clients.",
        "features": [
            "Floor-length open front waterfall cardigan with rippling front lapels",
            "Tailored tapered ankle trousers with elastic back waistband for easy fit",
            "Lightweight poly-jersey knit that flows effortlessly without adding bulk",
            "Direct factory export packaging with prompt tracking and cargo coordination"
        ]
    },
    {
        "code": "1003060",
        "id": "128",
        "name": "Lantern Sleeve Top & Button Palazzo Set",
        "slug": "lantern-sleeve-top-button-palazzo-set-1003060",
        "category": "Two Piece Sets",
        "tags": ["Two Piece Sets", "Lantern Sleeve", "Button Palazzo", "Modest Luxury", "Ready Stock"],
        "desc": "Chic two-piece set combining a high mock-neck top with billowing lantern sleeves alongside wide-leg palazzo pants adorned with decorative gold anchor buttons down the side seams. Combines modesty with modern nautical glamour.",
        "features": [
            "High mock neckline with shirred collar and dramatic lantern puff sleeves",
            "Expansive palazzo trousers accented with decorative gold buttons along sides",
            "Premium stretch crepe fabric that drapes smoothly and resists wrinkles",
            "High margin B2B wholesale package with balanced size and color ratios"
        ]
    },

    # -------------------------------------------------------------------------
    # 4. Jumpsuits (1003061 ~ 1003070, 10 items, ID: 129 ~ 138)
    # -------------------------------------------------------------------------
    {
        "code": "1003061",
        "id": "129",
        "name": "Halter-Neck Pleated Wide-Leg Jumpsuit",
        "slug": "halter-neck-pleated-wide-leg-jumpsuit-1003061",
        "category": "Jumpsuits",
        "tags": ["Jumpsuits", "Halter Neck", "Pleated Wide Leg", "Evening Jumpsuit", "Ready Stock"],
        "desc": "Dramatic one-piece evening jumpsuit featuring a gathered halter neckline with metallic neckband and full-length accordion pleated palazzo legs. Delivers the sweeping majesty of an evening gown combined with modern jumpsuit convenience.",
        "features": [
            "Gathered halter collar anchored with a gold-tone metallic neck ring",
            "Accordion heat-set pleating through wide palazzo legs for maximum motion",
            "Elasticized waist with detachable sash belt to define the hourglass profile",
            "Direct Guangzhou wholesale supply with 100-piece MOQ across sizes XL to 5XL"
        ]
    },
    {
        "code": "1003062",
        "id": "130",
        "name": "Cape-Sleeve Tie-Waist Palazzo Jumpsuit",
        "slug": "cape-sleeve-tie-waist-palazzo-jumpsuit-1003062",
        "category": "Jumpsuits",
        "tags": ["Jumpsuits", "Cape Sleeve", "Palazzo Jumpsuit", "Red Carpet Gala", "Ready Stock"],
        "desc": "Royal one-piece palazzo jumpsuit featuring sweeping cape sleeves that cascade down the back to mid-thigh. A wide self-tie belt with a gold buckle defines the waist, creating a commanding silhouette for galas, banquets, and red carpets.",
        "features": [
            "Dramatic shoulder cape overlay extending past elbows and down upper back",
            "Floor-sweeping palazzo pants cut with generous thigh and hip ease",
            "Premium heavy stretch crepe knit that smooths lines without clinging",
            "Pre-sorted export cartons with 6 classic African jewel and earth tones"
        ]
    },
    {
        "code": "1003063",
        "id": "131",
        "name": "Off-Shoulder Ruffle Overlay Wide-Leg Jumpsuit",
        "slug": "off-shoulder-ruffle-overlay-wide-leg-jumpsuit-1003063",
        "category": "Jumpsuits",
        "tags": ["Jumpsuits", "Off Shoulder", "Ruffle Overlay", "Party Jumpsuit", "Ready Stock"],
        "desc": "Flirty and glamorous one-piece jumpsuit featuring an elasticized off-the-shoulder neckline bordered by a wide cascading ruffle overlay. The high-waist palazzo legs drape straight down to the floor, visually lengthening the legs.",
        "features": [
            "Wide ruffled chest overlay framed with internal anti-slip silicone elastic band",
            "High-rise palazzo cut that visually elongates the lower body silhouette",
            "Lightweight stretch poly-crepe engineered for comfort in humid party venues",
            "Guangzhou Yulong Clothing Market direct ready stock with express dispatch"
        ]
    },
    {
        "code": "1003064",
        "id": "132",
        "name": "Asymmetric One-Shoulder Flared African Jumpsuit",
        "slug": "asymmetric-one-shoulder-flared-african-jumpsuit-1003064",
        "category": "Jumpsuits",
        "tags": ["Jumpsuits", "One Shoulder", "Flared Jumpsuit", "Runway Chic", "Ready Stock"],
        "desc": "Architectural one-shoulder jumpsuit detailed with a sculptural draped shoulder strap and tailored flare-leg trousers. Designed to turn heads at high-profile social galas and awards ceremonies while providing complete ease of movement.",
        "features": [
            "Sculptural one-shoulder neckline with draped shoulder sash accent",
            "Fitted bodice with interior boning support leading to flattering flare legs",
            "High-density double-stretch fabric providing firm contouring and recovery",
            "Proven boutique seller with rapid stock rotation across major African markets"
        ]
    },
    {
        "code": "1003065",
        "id": "133",
        "name": "Wrap V-Neck Belted Wide-Leg Jumpsuit",
        "slug": "wrap-v-neck-belted-wide-leg-jumpsuit-1003065",
        "category": "Jumpsuits",
        "tags": ["Jumpsuits", "Wrap V-Neck", "Wide Leg", "Executive Jumpsuit", "Ready Stock"],
        "desc": "Versatile executive and celebration jumpsuit featuring a surplice wrap V-neckline, functional deep side pockets, and an adjustable matching fabric belt. Effortlessly transitions from daytime conference presentations to evening banquet celebrations.",
        "features": [
            "Surplice crossover wrap neckline with secure hidden modesty hook closure",
            "Deep functional side pockets seamlessly integrated into hip seams",
            "Wide palazzo legs with front pleats that drape gracefully over heels",
            "Standard wholesale export cartons with 100-piece starting MOQ"
        ]
    },
    {
        "code": "1003066",
        "id": "134",
        "name": "Dramatic Puff Sleeve Tailored African Jumpsuit",
        "slug": "dramatic-puff-sleeve-tailored-african-jumpsuit-1003066",
        "category": "Jumpsuits",
        "tags": ["Jumpsuits", "Puff Sleeve", "Tailored Jumpsuit", "Statement Fashion", "Ready Stock"],
        "desc": "Statement jumpsuit designed with voluminous pleated puff sleeves and a sleek tailored straight-leg cut. The structured shoulders contrast beautifully with the slim-straight trousers, creating an imposing, fashion-forward silhouette for milestone celebrations.",
        "features": [
            "Voluminous puff sleeves reinforced with internal organza sleeve heads",
            "Clean square neckline that frames statement gold jewelry and headwraps",
            "Tailored straight trouser legs with pressed front creases for slimming length",
            "Guangzhou factory-direct dispatch with strict needle detection and QC inspection"
        ]
    },
    {
        "code": "1003067",
        "id": "135",
        "name": "Cowl-Neck Draped Evening Palazzo Jumpsuit",
        "slug": "cowl-neck-draped-evening-palazzo-jumpsuit-1003067",
        "category": "Jumpsuits",
        "tags": ["Jumpsuits", "Cowl Neck", "Palazzo Jumpsuit", "Evening Glam", "Ready Stock"],
        "desc": "Liquid elegance defines this evening jumpsuit. Styled with a softly draped cowl neckline, a fitted waistline, and expansive palazzo trousers that billow like a ballgown during movement. Crafted from wrinkle-resistant poly-jersey.",
        "features": [
            "Fluid cowl neckline that creates a soft, flattering drape across the bust",
            "Extra-wide palazzo trouser legs delivering dramatic gown-like movement",
            "Wrinkle-resistant poly-jersey knit ideal for overseas air cargo and travel",
            "100-piece low initial order MOQ with balanced size grading from XL to 5XL"
        ]
    },
    {
        "code": "1003068",
        "id": "136",
        "name": "Cold-Shoulder Flared Pant Jumpsuit with Sash",
        "slug": "cold-shoulder-flared-pant-jumpsuit-with-sash-1003068",
        "category": "Jumpsuits",
        "tags": ["Jumpsuits", "Cold Shoulder", "Flared Pant", "Party Chic", "Ready Stock"],
        "desc": "Playful and elegant jumpsuit showcasing cold-shoulder cutouts framed by flutter sleeves, paired with an extra-wide self-tie waist sash and flared legs. Delivers a refreshing, youthful charm for birthday parties, banquets, and holiday celebrations.",
        "features": [
            "Cold-shoulder cutouts framed with delicate flutter ruffles for upper arm ease",
            "Extra-wide matching fabric sash that cinches the waist into an hourglass profile",
            "Flared pant legs designed to skim gracefully over heels and platforms",
            "Direct supplier shipment from Guangzhou with complete export documentation"
        ]
    },
    {
        "code": "1003069",
        "id": "137",
        "name": "Sweetheart Neckline Pleated Jumpsuit with Pockets",
        "slug": "sweetheart-neckline-pleated-jumpsuit-with-pockets-1003069",
        "category": "Jumpsuits",
        "tags": ["Jumpsuits", "Sweetheart Neck", "Pleated Jumpsuit", "Boutique Favorite", "Ready Stock"],
        "desc": "Charming formal jumpsuit featuring a sculpted sweetheart neckline, tailored front pleats, and generous functional side pockets. The wide-leg cut cascades from a high-rise waist, offering regal comfort for weddings and formal receptions.",
        "features": [
            "Sculpted sweetheart bustier neckline with light boning support for shape",
            "Inverted front waist pleats releasing into fluid, wide-leg palazzo pants",
            "Two discreet, deep side-seam pockets for practical convenience",
            "Solid export carton packaging with balanced color and size breakdowns"
        ]
    },
    {
        "code": "1003070",
        "id": "138",
        "name": "Mock-Neck Keyhole Wide-Leg Formal Jumpsuit",
        "slug": "mock-neck-keyhole-wide-leg-formal-jumpsuit-1003070",
        "category": "Jumpsuits",
        "tags": ["Jumpsuits", "Mock Neck", "Keyhole Cutout", "Formal Jumpsuit", "Ready Stock"],
        "desc": "Statuesque formal jumpsuit featuring an elegant high mock neck with a subtle teardrop keyhole front opening. Sleek sleeveless armholes and wide-leg palazzo trousers create an imposing, statuesque presence for gala events and banquets.",
        "features": [
            "Sophisticated high mock neck collar with back double-button closure",
            "Tasteful teardrop keyhole cutout that balances modesty with modern flair",
            "Expansive wide-leg palazzo pants offering graceful drape and stride comfort",
            "Guangzhou Yulong Market direct wholesale inventory ready for fast export"
        ]
    }
]

# 6 Classic African Fashion Colors
CLASSIC_6_COLORS = [
    {"name": "Wine Red", "hex": "#7b1e3b"},
    {"name": "Emerald Green", "hex": "#0f766e"},
    {"name": "Royal Blue", "hex": "#1e3a8a"},
    {"name": "Mustard Gold", "hex": "#d4a017"},
    {"name": "Terracotta", "hex": "#c2410c"},
    {"name": "Onyx Black", "hex": "#1a1a1a"}
]

DEFAULT_SIZES = ["XL", "XXL", "3XL", "4XL", "5XL"]
DEFAULT_MOQ = 100
DEFAULT_MOQ_OPTIONS = [100, 500, 1000, 3000]

def build_product(p):
    code = p["code"]
    name = p["name"]
    category = p["category"]
    slug = p["slug"]
    desc = p["desc"]
    features = p["features"]
    tags = p["tags"]
    img_path = f"/images/products/{code}.png"
    
    # WhatsApp inquiry message template strictly per requirement
    whatsapp = f"Hi Jack, I want to inquire about Style {code} ({name}). Please share the wholesale quotation, available color mix, and minimum order quantity."

    return {
        "id": p["id"],
        "slug": slug,
        "name": name,
        "category": category,
        "image": img_path,
        "images": [img_path],
        "moq": DEFAULT_MOQ,
        "moqOptions": DEFAULT_MOQ_OPTIONS,
        "stockType": "Ready Stock",
        "priceMin": None,
        "priceMax": None,
        "tags": tags,
        "sizes": DEFAULT_SIZES,
        "colors": CLASSIC_6_COLORS,
        "description": desc,
        "features": features,
        "whatsappMessage": whatsapp,
        "isNew": True,
        "isPopular": False,
        "detailPage": {
            "detailSections": [
                {
                    "enabled": True,
                    "title": f"{name} — Wholesale Overview",
                    "body": f"{desc} Export-ready packaging, mixed color/size carton breakdown, and pre-shipment quality inspection included for all boutique and wholesale orders from Guangzhou Yulong Clothing Market.",
                    "image": img_path,
                    "layout": "full-width"
                }
            ]
        }
    }

def main():
    target_path = r"D:\Desktop\code\African Fashion\data\new-70-products.json"
    
    results = [build_product(p) for p in PRODUCTS]
    
    # Validation checks
    assert len(results) == 70, f"Expected 70 items, got {len(results)}"
    
    # ID check
    ids = [p["id"] for p in results]
    expected_ids = [str(i) for i in range(69, 139)]
    assert ids == expected_ids, f"IDs mismatch! Got {ids[:5]}...{ids[-5:]}"
    
    # Code check
    codes = [re.search(r"\d{7}$", p["slug"]).group(0) for p in results]
    expected_codes = [str(i) for i in range(1003001, 1003071)]
    assert codes == expected_codes, f"Codes mismatch! Got {codes[:5]}...{codes[-5:]}"
    
    # Category checks
    c1 = [p for p in results if p["category"] == "Plus Size Dresses"]
    c2 = [p for p in results if p["category"] == "Maxi Dresses"]
    c3 = [p for p in results if p["category"] == "Two Piece Sets"]
    c4 = [p for p in results if p["category"] == "Jumpsuits"]
    assert len(c1) == 24, f"Expected 24 Plus Size Dresses, got {len(c1)}"
    assert len(c2) == 20, f"Expected 20 Maxi Dresses, got {len(c2)}"
    assert len(c3) == 16, f"Expected 16 Two Piece Sets, got {len(c3)}"
    assert len(c4) == 10, f"Expected 10 Jumpsuits, got {len(c4)}"
    
    # Slug uniqueness
    slugs = [p["slug"] for p in results]
    assert len(set(slugs)) == 70, "Slugs are not unique!"
    for s in slugs:
        assert re.match(r"^[a-z0-9-]+-1003\d{3}$", s), f"Slug {s} invalid format!"
    
    # Colors check
    for p in results:
        assert len(p["colors"]) == 6, f"Product {p['id']} does not have 6 colors"
        for c in p["colors"]:
            assert "name" in c and "hex" in c
            assert re.match(r"^#[0-9a-fA-F]{6}$", c["hex"])
            
    # WhatsApp check
    for p in results:
        code_match = re.search(r"Style (\d{7})", p["whatsappMessage"])
        assert code_match, f"Invalid whatsappMessage in {p['id']}"
        assert p["sizes"] == ["XL", "XXL", "3XL", "4XL", "5XL"]
        assert p["priceMin"] is None
        assert p["priceMax"] is None
        assert p["moq"] == 100
        assert p["moqOptions"] == [100, 500, 1000, 3000]
        assert p["stockType"] == "Ready Stock"
        assert p["isNew"] is True
        assert p["isPopular"] is False

    with open(target_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully generated {len(results)} products to {target_path}!")

if __name__ == "__main__":
    main()
