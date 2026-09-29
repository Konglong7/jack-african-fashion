import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DATA_FILE = resolve('data/products.json');
const BACKUP_FILE = resolve('data/products.json.pre-0921.bak');

if (!existsSync(BACKUP_FILE)) {
  copyFileSync(DATA_FILE, BACKUP_FILE);
  console.log(`Backed up original products to ${BACKUP_FILE}`);
}

const existingProducts = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
console.log(`Current products count: ${existingProducts.length}`);

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

const STYLES = [
  // 1. Plus Size Dresses (0921001 - 0921012)
  {
    code: '0921001',
    name: 'Plus Size Batwing Sleeve Shift Dress',
    category: 'Plus Size Dresses',
    priceMin: 7.8,
    priceMax: 11.5,
    desc: 'A relaxed, elegant batwing shift dress cut specifically for curvy African figures. Durable crepe fabric holds its silhouette through humid climates.',
    tags: ['Plus Size', 'Ready Stock', 'African Market', 'Shift Dress'],
    sizes: ['XL', 'XXL', '3XL', '4XL', '5XL'],
    colors: [
      { name: 'Classic Wine', hex: '#7b1e3b' },
      { name: 'Royal Blue', hex: '#1e3a8a' },
      { name: 'Onyx Black', hex: '#1a1a1a' }
    ]
  },
  {
    code: '0921002',
    name: 'Plus Size Tiered Ruffle Flounce Dress',
    category: 'Plus Size Dresses',
    priceMin: 8.2,
    priceMax: 12.0,
    desc: 'Tiered ruffle flounce dress with a flattering silhouette and comfortable waistline. Easy to style for Sunday service and social celebrations.',
    tags: ['Plus Size', 'Ruffle', 'Boutique Restock', 'Flounce'],
    sizes: ['XL', 'XXL', '3XL', '4XL', '5XL'],
    colors: [
      { name: 'Emerald Green', hex: '#0f766e' },
      { name: 'Terracotta', hex: '#9a3412' },
      { name: 'Deep Navy', hex: '#1e293b' }
    ]
  },
  {
    code: '0921003',
    name: 'Plus Size Embroidered Neckline Kaftan Dress',
    category: 'Plus Size Dresses',
    priceMin: 9.0,
    priceMax: 13.5,
    desc: 'Flowy boutique kaftan dress featuring contrast embroidered trim at the neckline and cuffs. A staple for West African boutique restocks.',
    tags: ['Plus Size', 'Kaftan', 'Embroidery', 'Wholesale'],
    sizes: ['Free Size', 'XXL', '3XL', '4XL', '5XL'],
    colors: [
      { name: 'Mustard Gold', hex: '#a16207' },
      { name: 'Burgundy', hex: '#7b1e3b' },
      { name: 'Jet Black', hex: '#111111' }
    ]
  },
  {
    code: '0921004',
    name: 'Plus Size High-Waist Empire Maxi Gown',
    category: 'Plus Size Dresses',
    priceMin: 8.5,
    priceMax: 12.8,
    desc: 'Empire waist maxi gown designed for an elongated silhouette. Crafted with soft, non-sheer stretch knit that drapes beautifully.',
    tags: ['Plus Size', 'Empire Waist', 'Maxi Gown', 'Stretch Knit'],
    sizes: ['L', 'XL', 'XXL', '3XL', '4XL'],
    colors: [
      { name: 'Teal Green', hex: '#0f766e' },
      { name: 'Royal Blue', hex: '#1e3a8a' },
      { name: 'Plum', hex: '#581c87' }
    ]
  },
  {
    code: '0921005',
    name: 'Plus Size Asymmetric Hem Bodycon Dress',
    category: 'Plus Size Dresses',
    priceMin: 7.5,
    priceMax: 10.8,
    desc: 'Curvy bodycon dress with modern asymmetric hemline and side ruching. Highly popular for evening and celebration assortments.',
    tags: ['Plus Size', 'Bodycon', 'Asymmetric', 'Evening'],
    sizes: ['L', 'XL', 'XXL', '3XL', '4XL'],
    colors: [
      { name: 'Ruby Red', hex: '#b91c1c' },
      { name: 'Sapphire', hex: '#1d4ed8' },
      { name: 'Black', hex: '#1a1a1a' }
    ]
  },
  {
    code: '0921006',
    name: 'Plus Size Flute Sleeve A-Line Dress',
    category: 'Plus Size Dresses',
    priceMin: 8.0,
    priceMax: 11.8,
    desc: 'Statement flute sleeve dress with a forgiving A-line drape. Ideal for boutique assortments seeking modest yet striking silhouettes.',
    tags: ['Plus Size', 'Flute Sleeve', 'A-Line', 'Modest Fashion'],
    sizes: ['XL', 'XXL', '3XL', '4XL', '5XL'],
    colors: [
      { name: 'Olive Green', hex: '#4d7c0f' },
      { name: 'Burnt Orange', hex: '#c2410c' },
      { name: 'Navy', hex: '#1e293b' }
    ]
  },
  {
    code: '0921007',
    name: 'Plus Size Wrap Front Midi Dress',
    category: 'Plus Size Dresses',
    priceMin: 7.8,
    priceMax: 11.2,
    desc: 'Adjustable wrap front midi dress with belted tie and v-neckline. Flexible fit grading ensures fast turnover for retail boutiques.',
    tags: ['Plus Size', 'Wrap Dress', 'Midi', 'Adjustable'],
    sizes: ['L', 'XL', 'XXL', '3XL', '4XL'],
    colors: [
      { name: 'Crimson Red', hex: '#991b1b' },
      { name: 'Forest Green', hex: '#166534' },
      { name: 'Midnight', hex: '#0f172a' }
    ]
  },
  {
    code: '0921008',
    name: 'Plus Size Lantern Sleeve Bohemian Dress',
    category: 'Plus Size Dresses',
    priceMin: 8.5,
    priceMax: 12.5,
    desc: 'Lantern sleeve bohemian silhouette featuring vibrant geometric borders. Lightweight breathable blend suited for tropical markets.',
    tags: ['Plus Size', 'Lantern Sleeve', 'Boho', 'Geometric'],
    sizes: ['XL', 'XXL', '3XL', '4XL', '5XL'],
    colors: [
      { name: 'Copper Rust', hex: '#9a3412' },
      { name: 'Golden Yellow', hex: '#ca8a04' },
      { name: 'Navy', hex: '#1e293b' }
    ]
  },
  {
    code: '0921009',
    name: 'Plus Size Peplum Hem Cocktail Dress',
    category: 'Plus Size Dresses',
    priceMin: 8.8,
    priceMax: 13.0,
    desc: 'Structured peplum hem dress offering a sculpted silhouette. High-density poly-stretch fabric prevents clinging and wrinkling.',
    tags: ['Plus Size', 'Peplum', 'Cocktail', 'Party Dress'],
    sizes: ['L', 'XL', 'XXL', '3XL', '4XL'],
    colors: [
      { name: 'Royal Purple', hex: '#6b21a8' },
      { name: 'Emerald', hex: '#047857' },
      { name: 'Classic Black', hex: '#111111' }
    ]
  },
  {
    code: '0921010',
    name: 'Plus Size Front Slit Celebration Maxi',
    category: 'Plus Size Dresses',
    priceMin: 9.2,
    priceMax: 13.8,
    desc: 'Elegant celebration maxi dress with graceful front overlap slit and extended length. Perfect for church, weddings, and formal events.',
    tags: ['Plus Size', 'Maxi', 'Celebration', 'Church Wear'],
    sizes: ['XL', 'XXL', '3XL', '4XL', '5XL'],
    colors: [
      { name: 'Wine', hex: '#831843' },
      { name: 'Deep Royal', hex: '#1e40af' },
      { name: 'Gold Tone', hex: '#d97706' }
    ]
  },
  {
    code: '0921011',
    name: 'Plus Size Cold-Shoulder Evening Dress',
    category: 'Plus Size Dresses',
    priceMin: 8.6,
    priceMax: 12.6,
    desc: 'Flattering cold-shoulder cut with flutter sleeve detail. Engineered to flatter arms while maintaining an opulent, dressy appeal.',
    tags: ['Plus Size', 'Cold Shoulder', 'Evening Gown', 'Ready Stock'],
    sizes: ['L', 'XL', 'XXL', '3XL', '4XL'],
    colors: [
      { name: 'Bordeaux', hex: '#701a75' },
      { name: 'Midnight Blue', hex: '#1e1b4b' },
      { name: 'Teal', hex: '#115e59' }
    ]
  },
  {
    code: '0921012',
    name: 'Plus Size V-Neck Pleated Tier Dress',
    category: 'Plus Size Dresses',
    priceMin: 8.9,
    priceMax: 13.2,
    desc: 'V-neck tiered dress combining micro-pleats with a generous flare skirt. One of our most requested repeat-order boutique styles.',
    tags: ['Plus Size', 'V-Neck', 'Tiered', 'Micro Pleat'],
    sizes: ['XL', 'XXL', '3XL', '4XL', '5XL'],
    colors: [
      { name: 'Deep Red', hex: '#991b1b' },
      { name: 'Peacock Blue', hex: '#0284c7' },
      { name: 'Emerald', hex: '#065f46' }
    ]
  },

  // 2. Two Piece Sets (0921013 - 0921024)
  {
    code: '0921013',
    name: 'African Market Ankara Print Two-Piece Set',
    category: 'Two Piece Sets',
    priceMin: 9.5,
    priceMax: 14.2,
    desc: 'Vibrant matching Ankara-inspired top and wide-leg trouser set. Sold as coordinated sets with mixed sizes available per batch.',
    tags: ['Two Piece Sets', 'Ankara Print', 'Wide Leg', 'Coordinated Set'],
    sizes: ['M', 'L', 'XL', 'XXL', '3XL'],
    colors: [
      { name: 'Multi Print Orange', hex: '#ea580c' },
      { name: 'Multi Print Teal', hex: '#0d9488' },
      { name: 'Multi Print Red', hex: '#dc2626' }
    ]
  },
  {
    code: '0921014',
    name: 'Peplum Top and Pencil Skirt Set',
    category: 'Two Piece Sets',
    priceMin: 9.8,
    priceMax: 14.5,
    desc: 'Tailored peplum blouse paired with a high-waist pencil skirt. Sharp construction ideal for African corporate and Sunday attire.',
    tags: ['Two Piece Sets', 'Peplum', 'Pencil Skirt', 'Church Fashion'],
    sizes: ['M', 'L', 'XL', 'XXL', '3XL'],
    colors: [
      { name: 'Royal Blue', hex: '#1d4ed8' },
      { name: 'Wine Red', hex: '#9f1239' },
      { name: 'Jet Black', hex: '#09090b' }
    ]
  },
  {
    code: '0921015',
    name: 'Belted Tunic Top & Palazzo Pants Set',
    category: 'Two Piece Sets',
    priceMin: 10.2,
    priceMax: 15.0,
    desc: 'Relaxed longline tunic with fabric belt paired with flowing palazzo pants. Highly versatile for daily wear and upscale boutique sales.',
    tags: ['Two Piece Sets', 'Palazzo Pants', 'Tunic Set', 'Modest Wear'],
    sizes: ['L', 'XL', 'XXL', '3XL', '4XL'],
    colors: [
      { name: 'Earthy Terracotta', hex: '#c2410c' },
      { name: 'Olive Mist', hex: '#3f6212' },
      { name: 'Classic Navy', hex: '#1e293b' }
    ]
  },
  {
    code: '0921016',
    name: 'Kimono Robe & Slip Dress Two-Piece Set',
    category: 'Two Piece Sets',
    priceMin: 10.5,
    priceMax: 15.5,
    desc: 'Two-piece ensemble featuring a flowing open-front kimono cardigan over a coordinated slip dress. High-end boutique presentation.',
    tags: ['Two Piece Sets', 'Kimono', 'Slip Dress', 'Luxury B2B'],
    sizes: ['Free Size', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Champagne Gold', hex: '#d97706' },
      { name: 'Emerald Green', hex: '#065f46' },
      { name: 'Wine', hex: '#831843' }
    ]
  },
  {
    code: '0921017',
    name: 'Crop Blouse & Tiered Maxi Skirt Set',
    category: 'Two Piece Sets',
    priceMin: 9.0,
    priceMax: 13.8,
    desc: 'Flirty smocked crop blouse paired with an expansive tiered maxi skirt. Easy-fitting elastic grading for broad customer appeal.',
    tags: ['Two Piece Sets', 'Tiered Skirt', 'Crop Top', 'Festival Wear'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Sunset Yellow', hex: '#eab308' },
      { name: 'Coral Pink', hex: '#f43f5e' },
      { name: 'Sky Blue', hex: '#0284c7' }
    ]
  },
  {
    code: '0921018',
    name: 'Casual Blazer and Trouser Suit Set',
    category: 'Two Piece Sets',
    priceMin: 11.0,
    priceMax: 16.5,
    desc: 'Single-breasted lightweight blazer and tapered trousers designed for African professional women. Breathable tropical fabric blend.',
    tags: ['Two Piece Sets', 'Blazer Suit', 'Business Wear', 'Tailored Set'],
    sizes: ['M', 'L', 'XL', 'XXL', '3XL'],
    colors: [
      { name: 'Cobalt Blue', hex: '#2563eb' },
      { name: 'Blush Pink', hex: '#be185d' },
      { name: 'Ivory White', hex: '#f8fafc' }
    ]
  },
  {
    code: '0921019',
    name: 'Ruffle Sleeve Blouse & Mermaid Skirt Set',
    category: 'Two Piece Sets',
    priceMin: 9.6,
    priceMax: 14.4,
    desc: 'Dramatic ruffle shoulder blouse with a curve-hugging mermaid silhouette skirt. Ideal for event and party boutique assortments.',
    tags: ['Two Piece Sets', 'Mermaid Skirt', 'Ruffle Sleeve', 'Party Set'],
    sizes: ['L', 'XL', 'XXL', '3XL', '4XL'],
    colors: [
      { name: 'Fuchsia', hex: '#c026d3' },
      { name: 'Turquoise', hex: '#0891b2' },
      { name: 'Onyx', hex: '#18181b' }
    ]
  },
  {
    code: '0921020',
    name: 'One-Shoulder Drape Top & Wide Trouser Set',
    category: 'Two Piece Sets',
    priceMin: 10.0,
    priceMax: 14.8,
    desc: 'Chic asymmetrical one-shoulder drape top matched with high-waisted palazzo trousers. High visual impact for boutique window displays.',
    tags: ['Two Piece Sets', 'One Shoulder', 'Wide Trouser', 'Runway Style'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Bright Red', hex: '#ef4444' },
      { name: 'Mustard Gold', hex: '#ca8a04' },
      { name: 'Navy', hex: '#1e3a8a' }
    ]
  },
  {
    code: '0921021',
    name: 'Short-Sleeve Peplum & Slit Skirt Set',
    category: 'Two Piece Sets',
    priceMin: 9.4,
    priceMax: 13.9,
    desc: 'Everyday professional peplum set with front overlap slit skirt. Crease-resistant poly fabric ensures all-day pristine appearance.',
    tags: ['Two Piece Sets', 'Peplum', 'Workwear', 'Fast Selling'],
    sizes: ['M', 'L', 'XL', 'XXL', '3XL'],
    colors: [
      { name: 'Teal', hex: '#0d9488' },
      { name: 'Plum Purple', hex: '#7e22ce' },
      { name: 'Classic Black', hex: '#171717' }
    ]
  },
  {
    code: '0921022',
    name: 'Lantern Sleeve Top & Fitted Pants Set',
    category: 'Two Piece Sets',
    priceMin: 9.5,
    priceMax: 14.0,
    desc: 'Voluminous lantern sleeve blouse with coordinated stretch slim trousers. Balances top volume with clean lines below.',
    tags: ['Two Piece Sets', 'Lantern Sleeve', 'Slim Pants', 'Ready Stock'],
    sizes: ['L', 'XL', 'XXL', '3XL'],
    colors: [
      { name: 'Burnt Orange', hex: '#c2410c' },
      { name: 'Forest Green', hex: '#15803d' },
      { name: 'Deep Blue', hex: '#1d4ed8' }
    ]
  },
  {
    code: '0921023',
    name: 'High-Neck Wrap Blouse & A-Line Skirt Set',
    category: 'Two Piece Sets',
    priceMin: 9.8,
    priceMax: 14.5,
    desc: 'Modest high-neck wrap top with an expansive A-line skirt. Elegant proportioning tailored for East and Southern African boutiques.',
    tags: ['Two Piece Sets', 'High Neck', 'A-Line', 'Modest Fashion'],
    sizes: ['L', 'XL', 'XXL', '3XL', '4XL'],
    colors: [
      { name: 'Ruby', hex: '#be123c' },
      { name: 'Gold', hex: '#b45309' },
      { name: 'Navy Blue', hex: '#1e3a8a' }
    ]
  },
  {
    code: '0921024',
    name: 'Sleeveless Vest & Straight-Leg Trouser Set',
    category: 'Two Piece Sets',
    priceMin: 10.5,
    priceMax: 15.2,
    desc: 'Modern tailored longline vest with matching straight-leg formal trousers. Very strong seller for metropolitan boutique buyers.',
    tags: ['Two Piece Sets', 'Vest Suit', 'Modern Tailored', 'Corporate'],
    sizes: ['M', 'L', 'XL', 'XXL', '3XL'],
    colors: [
      { name: 'Camel Khaki', hex: '#b45309' },
      { name: 'Black', hex: '#18181b' },
      { name: 'Sage Green', hex: '#4d7c0f' }
    ]
  },

  // 3. Pleated Dresses (0921025 - 0921036)
  {
    code: '0921025',
    name: 'Stretch Accordion Pleated Maxi Dress',
    category: 'Pleated Dresses',
    priceMin: 8.5,
    priceMax: 12.5,
    desc: 'Fine accordion pleated dress with high stretch recovery. Flat-packs tightly to save international air and sea freight costs.',
    tags: ['Pleated Dresses', 'Accordion Pleat', 'Maxi', 'High Stretch'],
    sizes: ['Free Size', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Emerald', hex: '#047857' },
      { name: 'Burgundy', hex: '#881337' },
      { name: 'Royal Blue', hex: '#1d4ed8' },
      { name: 'Black', hex: '#0a0a0a' }
    ]
  },
  {
    code: '0921026',
    name: 'Sunburst Pleat Metallic Finish Dress',
    category: 'Pleated Dresses',
    priceMin: 9.5,
    priceMax: 14.0,
    desc: 'Lustrous sunburst pleated dress with subtle metallic sheen. A standout piece for wedding guests and celebration collections.',
    tags: ['Pleated Dresses', 'Sunburst Pleat', 'Metallic Sheen', 'Celebration'],
    sizes: ['Free Size', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Gold Shimmer', hex: '#d97706' },
      { name: 'Rose Bronze', hex: '#be185d' },
      { name: 'Silver Pewter', hex: '#475569' }
    ]
  },
  {
    code: '0921027',
    name: 'Tiered Micro-Pleat Midi Dress',
    category: 'Pleated Dresses',
    priceMin: 8.8,
    priceMax: 12.8,
    desc: 'Three-tiered micro-pleat midi dress with comfortable stretch neckline. Flattering flow that fits a broad range of body profiles.',
    tags: ['Pleated Dresses', 'Micro Pleat', 'Tiered Midi', 'Boutique Restock'],
    sizes: ['Free Size', 'M', 'L', 'XL'],
    colors: [
      { name: 'Cobalt', hex: '#1e40af' },
      { name: 'Wine', hex: '#9f1239' },
      { name: 'Teal', hex: '#0f766e' }
    ]
  },
  {
    code: '0921028',
    name: 'Ombre Dip-Dye Pleated Maxi Gown',
    category: 'Pleated Dresses',
    priceMin: 9.8,
    priceMax: 14.5,
    desc: 'Stunning ombre gradient dip-dye effect across sharp vertical pleats. Creates dramatic visual impact on boutique social media feeds.',
    tags: ['Pleated Dresses', 'Ombre Gradient', 'Dip Dye', 'Maxi Gown'],
    sizes: ['Free Size', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Sunset Orange-Red', hex: '#ea580c' },
      { name: 'Ocean Blue-Teal', hex: '#0284c7' },
      { name: 'Plum-Berry', hex: '#701a75' }
    ]
  },
  {
    code: '0921029',
    name: 'Batwing Pleated High-Neck Dress',
    category: 'Pleated Dresses',
    priceMin: 8.9,
    priceMax: 13.0,
    desc: 'High-neck batwing pleated silhouette with tapered cuff detailing. Generous upper cut with clean vertical line drop.',
    tags: ['Pleated Dresses', 'Batwing', 'High Neck', 'Modest Luxury'],
    sizes: ['Free Size', 'XL', 'XXL', '3XL'],
    colors: [
      { name: 'Deep Emerald', hex: '#064e3b' },
      { name: 'Midnight Black', hex: '#09090b' },
      { name: 'Rich Burgundy', hex: '#831843' }
    ]
  },
  {
    code: '0921030',
    name: 'Color-Block Pleated Shift Dress',
    category: 'Pleated Dresses',
    priceMin: 8.2,
    priceMax: 12.2,
    desc: 'Striking graphic color-block panels on fine accordion pleating. Lightweight wash-and-wear durability with no iron required.',
    tags: ['Pleated Dresses', 'Color Block', 'Shift Dress', 'Wash and Wear'],
    sizes: ['Free Size', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black/Gold/Cream', hex: '#a16207' },
      { name: 'Navy/Teal/White', hex: '#0369a1' },
      { name: 'Wine/Rose/Black', hex: '#881337' }
    ]
  },
  {
    code: '0921031',
    name: 'Belted Pleated Shirt Dress',
    category: 'Pleated Dresses',
    priceMin: 9.0,
    priceMax: 13.2,
    desc: 'Collared shirt dress styling on the bodice flowing into an accordion pleated skirt. Includes matching fabric waist belt.',
    tags: ['Pleated Dresses', 'Shirt Dress', 'Belted', 'Smart Casual'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Olive Green', hex: '#3f6212' },
      { name: 'Terracotta', hex: '#9a3412' },
      { name: 'Navy Blue', hex: '#1e3a8a' }
    ]
  },
  {
    code: '0921032',
    name: 'Cold-Shoulder Pleated Party Dress',
    category: 'Pleated Dresses',
    priceMin: 8.8,
    priceMax: 12.8,
    desc: 'Cold-shoulder cutouts framed by flutter pleat sleeves and a swing hem. Designed for fast retail turnaround in urban boutiques.',
    tags: ['Pleated Dresses', 'Cold Shoulder', 'Party Dress', 'Swing Hem'],
    sizes: ['Free Size', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Bright Red', hex: '#dc2626' },
      { name: 'Royal Purple', hex: '#7e22ce' },
      { name: 'Teal', hex: '#0d9488' }
    ]
  },
  {
    code: '0921033',
    name: 'Geometric Print Pleated Maxi Dress',
    category: 'Pleated Dresses',
    priceMin: 9.2,
    priceMax: 13.5,
    desc: 'African-inspired geometric border print pressed onto stretch pleated crepe. Does not warp or stretch out of shape after washing.',
    tags: ['Pleated Dresses', 'Geometric Print', 'Maxi', 'Colorfast'],
    sizes: ['Free Size', 'L', 'XL', 'XXL', '3XL'],
    colors: [
      { name: 'Multi Geo Gold', hex: '#b45309' },
      { name: 'Multi Geo Blue', hex: '#1d4ed8' },
      { name: 'Multi Geo Green', hex: '#15803d' }
    ]
  },
  {
    code: '0921034',
    name: 'Asymmetric Hem Pleated Cocktail Dress',
    category: 'Pleated Dresses',
    priceMin: 8.6,
    priceMax: 12.6,
    desc: 'Dramatic handkerchief asymmetric hemline that ripples with movement. A proven best-seller for weekend outings and functions.',
    tags: ['Pleated Dresses', 'Asymmetric Hem', 'Handkerchief', 'Cocktail'],
    sizes: ['Free Size', 'M', 'L', 'XL'],
    colors: [
      { name: 'Magenta', hex: '#be185d' },
      { name: 'Sapphire Blue', hex: '#1e40af' },
      { name: 'Jet Black', hex: '#18181b' }
    ]
  },
  {
    code: '0921035',
    name: 'Long-Sleeve Pleated Evening Gown',
    category: 'Pleated Dresses',
    priceMin: 10.0,
    priceMax: 14.8,
    desc: 'Modest full-length sleeve pleated gown with modest crew neck and floor-grazing hem. Premium weighted knit drape.',
    tags: ['Pleated Dresses', 'Long Sleeve', 'Evening Gown', 'Floor Length'],
    sizes: ['Free Size', 'L', 'XL', 'XXL', '3XL'],
    colors: [
      { name: 'Wine Red', hex: '#9f1239' },
      { name: 'Deep Forest Green', hex: '#065f46' },
      { name: 'Gold Amber', hex: '#d97706' }
    ]
  },
  {
    code: '0921036',
    name: 'Ruffle Neckline Pleated Swing Dress',
    category: 'Pleated Dresses',
    priceMin: 8.5,
    priceMax: 12.4,
    desc: 'Ruffled elasticated neckline that can be worn on or off the shoulder. Bouncy micro-pleating with exceptional comfort.',
    tags: ['Pleated Dresses', 'Off Shoulder', 'Swing Dress', 'Ruffle Neck'],
    sizes: ['Free Size', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Coral Red', hex: '#ef4444' },
      { name: 'Mustard', hex: '#ca8a04' },
      { name: 'Navy', hex: '#1e293b' }
    ]
  },

  // 4. Maxi Dresses (0921037 - 0921048)
  {
    code: '0921037',
    name: 'African Sunset Motif Tiered Maxi Dress',
    category: 'Maxi Dresses',
    priceMin: 8.6,
    priceMax: 12.8,
    desc: 'Rich sunset motif print on a multi-tiered sweeping maxi dress. Vibrant colorfast dyes engineered for African sunlight resistance.',
    tags: ['Maxi Dresses', 'Sunset Motif', 'Tiered Maxi', 'Colorfast'],
    sizes: ['L', 'XL', 'XXL', '3XL', '4XL'],
    colors: [
      { name: 'Sunset Red/Orange', hex: '#ea580c' },
      { name: 'Warm Amber', hex: '#d97706' },
      { name: 'Royal Indigo', hex: '#312e81' }
    ]
  },
  {
    code: '0921038',
    name: 'V-Neck Wrap Front Bohemian Maxi Dress',
    category: 'Maxi Dresses',
    priceMin: 8.2,
    priceMax: 12.2,
    desc: 'Deep V-neck crossover bodice with an expansive A-line skirt sweep. Soft breathable viscose blend suited for warm climates.',
    tags: ['Maxi Dresses', 'Wrap Front', 'Boho Chic', 'Breathable'],
    sizes: ['M', 'L', 'XL', 'XXL', '3XL'],
    colors: [
      { name: 'Emerald Floral', hex: '#047857' },
      { name: 'Ruby Floral', hex: '#b91c1c' },
      { name: 'Sapphire Floral', hex: '#1d4ed8' }
    ]
  },
  {
    code: '0921039',
    name: 'Cape Sleeve Regal African Maxi Gown',
    category: 'Maxi Dresses',
    priceMin: 10.5,
    priceMax: 15.5,
    desc: 'Dramatic integrated cape sleeves that cascade down the back of this stately maxi gown. Top choice for wedding guests and mothers of the bride.',
    tags: ['Maxi Dresses', 'Cape Sleeve', 'Regal Gown', 'Wedding Guest'],
    sizes: ['XL', 'XXL', '3XL', '4XL', '5XL'],
    colors: [
      { name: 'Imperial Gold', hex: '#ca8a04' },
      { name: 'Royal Purple', hex: '#6b21a8' },
      { name: 'Deep Wine', hex: '#881337' }
    ]
  },
  {
    code: '0921040',
    name: 'Ankara Print High-Slit Maxi Dress',
    category: 'Maxi Dresses',
    priceMin: 8.8,
    priceMax: 13.0,
    desc: 'Traditional geometric motif maxi dress with a tailored side slit for comfort and styling. High-density wax-feel cotton finish.',
    tags: ['Maxi Dresses', 'Side Slit', 'Ankara Motif', 'Wax Finish'],
    sizes: ['M', 'L', 'XL', 'XXL', '3XL'],
    colors: [
      { name: 'Multi Print Yellow', hex: '#eab308' },
      { name: 'Multi Print Blue', hex: '#2563eb' },
      { name: 'Multi Print Green', hex: '#16a34a' }
    ]
  },
  {
    code: '0921041',
    name: 'Smocked Bodice Off-Shoulder Maxi Dress',
    category: 'Maxi Dresses',
    priceMin: 7.9,
    priceMax: 11.8,
    desc: 'Flexible smocked elastic bodice provides effortless fit across multiple bust measurements. Expansive flared skirt for easy movement.',
    tags: ['Maxi Dresses', 'Smocked Bodice', 'Off Shoulder', 'Flexible Fit'],
    sizes: ['Free Size', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Turquoise', hex: '#0891b2' },
      { name: 'Hot Pink', hex: '#db2777' },
      { name: 'Classic Black', hex: '#171717' }
    ]
  },
  {
    code: '0921042',
    name: 'Button-Down Shirt Collar Tiered Maxi',
    category: 'Maxi Dresses',
    priceMin: 9.0,
    priceMax: 13.4,
    desc: 'Sophisticated full-length button-down maxi dress with structured collar and matching waist belt. Balances corporate and casual wear.',
    tags: ['Maxi Dresses', 'Button Down', 'Shirt Dress', 'Belted'],
    sizes: ['M', 'L', 'XL', 'XXL', '3XL'],
    colors: [
      { name: 'Olive Green', hex: '#4d7c0f' },
      { name: 'Terracotta Rust', hex: '#c2410c' },
      { name: 'Navy', hex: '#1e293b' }
    ]
  },
  {
    code: '0921043',
    name: 'Flutter Sleeve Floral Maxi Dress',
    category: 'Maxi Dresses',
    priceMin: 8.4,
    priceMax: 12.5,
    desc: 'Romantic flutter sleeves with empire waist and flowing gathered tiers. Excellent drape on curvy silhouettes.',
    tags: ['Maxi Dresses', 'Flutter Sleeve', 'Floral', 'Boutique Restock'],
    sizes: ['L', 'XL', 'XXL', '3XL', '4XL'],
    colors: [
      { name: 'Wine Floral', hex: '#9f1239' },
      { name: 'Navy Floral', hex: '#1e3a8a' },
      { name: 'Teal Floral', hex: '#0f766e' }
    ]
  },
  {
    code: '0921044',
    name: 'Halter-Neck Backless Resort Maxi Dress',
    category: 'Maxi Dresses',
    priceMin: 8.8,
    priceMax: 13.2,
    desc: 'High halter neckline with an elegant low back and sweeping hemline. High-demand item for holiday resorts and celebration events.',
    tags: ['Maxi Dresses', 'Halter Neck', 'Resort Wear', 'Evening'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Bright Coral', hex: '#f43f5e' },
      { name: 'Gold Tone', hex: '#eab308' },
      { name: 'Deep Emerald', hex: '#065f46' }
    ]
  },
  {
    code: '0921045',
    name: 'Longline Kaftan Style Maxi Dress',
    category: 'Maxi Dresses',
    priceMin: 8.5,
    priceMax: 12.6,
    desc: 'Loose kaftan cut with contrast taping along sleeves and placket. Highly comfortable, loose-fitting design for modest fashion buyers.',
    tags: ['Maxi Dresses', 'Kaftan', 'Modest Fashion', 'Loose Fit'],
    sizes: ['Free Size', 'XXL', '3XL', '4XL', '5XL'],
    colors: [
      { name: 'Rich Mustard', hex: '#a16207' },
      { name: 'Burgundy', hex: '#7b1e3b' },
      { name: 'Midnight', hex: '#0f172a' }
    ]
  },
  {
    code: '0921046',
    name: 'Keyhole Neckline Ankara Flounce Maxi',
    category: 'Maxi Dresses',
    priceMin: 9.2,
    priceMax: 13.8,
    desc: 'Teardrop keyhole neckline accent with voluminous circular flounce hem. Vibrant traditional Ankara patterns.',
    tags: ['Maxi Dresses', 'Keyhole Neck', 'Flounce Hem', 'Ankara'],
    sizes: ['L', 'XL', 'XXL', '3XL', '4XL'],
    colors: [
      { name: 'Orange / Navy Geo', hex: '#ea580c' },
      { name: 'Green / Gold Geo', hex: '#15803d' },
      { name: 'Red / Black Geo', hex: '#b91c1c' }
    ]
  },
  {
    code: '0921047',
    name: 'Batwing Kimono Sleeve Belted Maxi',
    category: 'Maxi Dresses',
    priceMin: 9.4,
    priceMax: 14.0,
    desc: 'Generous batwing kimono sleeves with an adjustable sash belt. Drapes naturally and flatters fuller body types.',
    tags: ['Maxi Dresses', 'Kimono Sleeve', 'Belted', 'Curvy Friendly'],
    sizes: ['XL', 'XXL', '3XL', '4XL', '5XL'],
    colors: [
      { name: 'Plum Purple', hex: '#7e22ce' },
      { name: 'Teal Blue', hex: '#0284c7' },
      { name: 'Burgundy Wine', hex: '#881337' }
    ]
  },
  {
    code: '0921048',
    name: 'Mermaid Hem Ankara Evening Maxi',
    category: 'Maxi Dresses',
    priceMin: 10.0,
    priceMax: 14.8,
    desc: 'Contoured mermaid silhouette featuring flare hem panels. Tailored specifically for formal evening wear, galas, and celebrations.',
    tags: ['Maxi Dresses', 'Mermaid Cut', 'Evening Gown', 'High Glamour'],
    sizes: ['M', 'L', 'XL', 'XXL', '3XL'],
    colors: [
      { name: 'Gold / Emerald', hex: '#d97706' },
      { name: 'Royal / Wine', hex: '#1e40af' },
      { name: 'Black / Bronze', hex: '#18181b' }
    ]
  },

  // 5. Jumpsuits (0921049 - 0921056)
  {
    code: '0921049',
    name: 'Wide-Leg African Print Belted Jumpsuit',
    category: 'Jumpsuits',
    priceMin: 9.5,
    priceMax: 14.2,
    desc: 'Contemporary wide-leg one-piece jumpsuit with tailored collar and matching waist sash. Breathable and movement-friendly.',
    tags: ['Jumpsuits', 'Wide Leg', 'Belted Jumpsuit', 'Ankara Print'],
    sizes: ['M', 'L', 'XL', 'XXL', '3XL'],
    colors: [
      { name: 'Multi Print Amber', hex: '#d97706' },
      { name: 'Multi Print Cobalt', hex: '#2563eb' },
      { name: 'Multi Print Emerald', hex: '#059669' }
    ]
  },
  {
    code: '0921050',
    name: 'One-Shoulder Drape Wide-Leg Jumpsuit',
    category: 'Jumpsuits',
    priceMin: 10.2,
    priceMax: 15.0,
    desc: 'Striking one-shoulder silhouette with pleated drape and flowing palazzo legs. Red carpet ready for boutique formal collections.',
    tags: ['Jumpsuits', 'One Shoulder', 'Palazzo Jumpsuit', 'Formal'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Scarlet Red', hex: '#dc2626' },
      { name: 'Sapphire Blue', hex: '#1d4ed8' },
      { name: 'Black', hex: '#111111' }
    ]
  },
  {
    code: '0921051',
    name: 'V-Neck Wrap Front Palazzo Jumpsuit',
    category: 'Jumpsuits',
    priceMin: 9.8,
    priceMax: 14.5,
    desc: 'Crossover wrap bodice with elasticized back waist and wide leg cut. Easy to wear and quick to retail across African boutiques.',
    tags: ['Jumpsuits', 'Wrap Front', 'Palazzo', 'Ready Stock'],
    sizes: ['L', 'XL', 'XXL', '3XL', '4XL'],
    colors: [
      { name: 'Forest Green', hex: '#166534' },
      { name: 'Wine Red', hex: '#9f1239' },
      { name: 'Navy', hex: '#1e293b' }
    ]
  },
  {
    code: '0921052',
    name: 'Lantern Sleeve Tailored Utility Jumpsuit',
    category: 'Jumpsuits',
    priceMin: 10.5,
    priceMax: 15.5,
    desc: 'Full-length lantern sleeve jumpsuit with breast pockets and metallic zip front. Combines modern utility styling with feminine volume.',
    tags: ['Jumpsuits', 'Lantern Sleeve', 'Utility Fashion', 'Front Zip'],
    sizes: ['M', 'L', 'XL', 'XXL', '3XL'],
    colors: [
      { name: 'Khaki Camel', hex: '#a16207' },
      { name: 'Army Olive', hex: '#3f6212' },
      { name: 'Charcoal', hex: '#334155' }
    ]
  },
  {
    code: '0921053',
    name: 'Cold-Shoulder Flounce Jumpsuit',
    category: 'Jumpsuits',
    priceMin: 9.6,
    priceMax: 14.0,
    desc: 'Romantic cold-shoulder cutouts with cascading flounce over the bust. Straight-leg cut elongates the overall silhouette.',
    tags: ['Jumpsuits', 'Cold Shoulder', 'Flounce', 'Party Jumpsuit'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Royal Purple', hex: '#7c3aed' },
      { name: 'Teal', hex: '#0d9488' },
      { name: 'Onyx Black', hex: '#171717' }
    ]
  },
  {
    code: '0921054',
    name: 'Plus Size Cape Sleeve Wide-Leg Jumpsuit',
    category: 'Jumpsuits',
    priceMin: 10.8,
    priceMax: 16.0,
    desc: 'Stately cape sleeve overlay paired with an expansive wide-leg palazzo pant. Designed specifically for plus-size celebration dressing.',
    tags: ['Jumpsuits', 'Plus Size', 'Cape Sleeve', 'Celebration'],
    sizes: ['XL', 'XXL', '3XL', '4XL', '5XL'],
    colors: [
      { name: 'Imperial Wine', hex: '#831843' },
      { name: 'Deep Navy', hex: '#172554' },
      { name: 'Emerald', hex: '#064e3b' }
    ]
  },
  {
    code: '0921055',
    name: 'Off-Shoulder Ruffle Trim Ankara Jumpsuit',
    category: 'Jumpsuits',
    priceMin: 9.4,
    priceMax: 13.8,
    desc: 'Elasticized off-shoulder neckline with layered ruffle accent. High-quality African print cotton blend with excellent wash fastness.',
    tags: ['Jumpsuits', 'Off Shoulder', 'Ruffle Trim', 'African Print'],
    sizes: ['M', 'L', 'XL', 'XXL', '3XL'],
    colors: [
      { name: 'Sunset Multi', hex: '#ea580c' },
      { name: 'Ocean Multi', hex: '#0284c7' },
      { name: 'Emerald Multi', hex: '#059669' }
    ]
  },
  {
    code: '0921056',
    name: 'Halter-Neck Pleated Wide Jumpsuit',
    category: 'Jumpsuits',
    priceMin: 10.0,
    priceMax: 14.8,
    desc: 'Micro-pleated wide leg jumpsuit with an elegant halter tie neck. Flowing movement and easy packing for boutique wholesale inventory.',
    tags: ['Jumpsuits', 'Halter Neck', 'Pleated Leg', 'Luxury Wholesale'],
    sizes: ['Free Size', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Golden Ochre', hex: '#ca8a04' },
      { name: 'Ruby Red', hex: '#b91c1c' },
      { name: 'Midnight Navy', hex: '#0f172a' }
    ]
  }
];

let nextId = 13;
const newRecords = [];

for (const s of STYLES) {
  const prodId = String(nextId);
  const slug = `${slugify(s.name)}-${s.code}`;
  const imgPath = `/images/products/${s.code}.webp`;

  const prod = {
    id: prodId,
    slug,
    name: s.name,
    category: s.category,
    image: imgPath,
    images: [imgPath],
    moq: 500,
    moqOptions: [500, 1000, 3000],
    stockType: 'Ready Stock & Custom',
    priceMin: s.priceMin,
    priceMax: s.priceMax,
    tags: [...s.tags, 'Guangzhou Supplier', '2026 Collection'],
    sizes: s.sizes,
    colors: s.colors,
    description: `${s.desc} Measurements, fabric composition, available colorways, batch size ratios and current ready stock are confirmed prior to quotation.`,
    features: [
      'Premium export-grade stitching and durable seams',
      'Curated specifically for African boutique and wholesale resale',
      'Mixed sizes and color ratios available per 500-piece batch',
      'Guangzhou factory-direct dispatch with freight agent coordination'
    ],
    whatsappMessage: `Hello Jack, I'm interested in the ${s.name} (Code: ${s.code}). Please share wholesale pricing, color card, and stock quantity.`,
    isNew: true,
    isPopular: nextId % 3 === 0,
    detailPage: {
      detailSections: [
        {
          enabled: true,
          title: `${s.name} — Style Details`,
          body: `${s.desc} Export-ready packaging and pre-shipment quality inspection included for all orders.`,
          image: imgPath,
          layout: 'full-width'
        }
      ]
    }
  };

  newRecords.push(prod);
  nextId++;
}

const merged = [...existingProducts, ...newRecords];
writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2), 'utf8');
console.log(`Successfully merged! Total products: ${merged.length}`);
