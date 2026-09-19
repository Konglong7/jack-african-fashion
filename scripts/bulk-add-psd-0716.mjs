// One-shot bulk add: 26 Plus Size Dresses from 上新/7月16 batch.
// 素材来源：本地原始图片批次 上新/7月16（该素材目录不入库，仓库内不包含；图片文件名即下面 items 中的文件名）。
// Run: node scripts/bulk-add-psd-0716.mjs   (from project root)
// Idempotent: skips slugs that already exist; skips image copy if file already exists.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// [originalFile, descriptor, name, description, colors]
const items = [
  ['036c48b3f3669eddb22e3dc9e34e5636.jpg','long-sleeve-floral-print-maxi-dress-with-headwrap','Long Sleeve Floral Print Maxi Dress','African print maxi dress with long sleeves and matching headwrap. Features a fitted bodice with bold floral patterns in pink and purple tones on a black base, designed for boutique buyers seeking statement African fashion.',['Black#1a1a1a','Magenta#c2185b','Purple#6a1b9a','Gold#d4af37']],
  ['03e1c21b93e572c1bd5915f0284330b2.jpg','long-sleeve-mustard-solid-maxi-dress-with-headwrap','Long Sleeve Mustard Solid Maxi Dress','Solid mustard-gold long sleeve maxi dress with matching headwrap. The sleek silhouette and vibrant color make it a versatile option for African boutique buyers looking for elegant everyday wear with cultural appeal.',['Mustard#d4a017','Black#1a1a1a','Gold#c9a227']],
  ['074c23546d3f151635227ef79fd35625.jpg','long-sleeve-black-floral-print-midi-dress-peter-pan-collar','Long Sleeve Black Floral Print Midi Dress','Vintage-inspired midi dress with long sleeves, Peter Pan collar, and button-front closure. The black floral botanical print on a white background offers a classic look with broad market appeal for African boutique customers.',['White#f5f5f5','Black#1a1a1a','Gray#888888']],
  ['1b38559e213bf42d9cda79dd75536b9a.jpg','v-neck-ankara-print-wrap-maxi-dress-with-headwrap','V-Neck Ankara Print Wrap Maxi Dress','Vibrant Ankara print wrap maxi dress with deep V-neckline and long sleeves. Includes matching headwrap. The bold multi-color pattern in yellow, red, and orange makes it a standout piece for African B2B buyers.',['Black#1a1a1a','Yellow#f9a825','Red#c62828','Orange#ef6c00']],
  ['24af2327fc17eb3d58a0a658adeefdbd.jpg','long-sleeve-wine-gold-ethnic-print-maxi-dress','Long Sleeve Wine Gold Ethnic Print Maxi Dress','Wine-colored long sleeve maxi dress with intricate gold ethnic print accents on the bodice. The fitted silhouette and metallic gold detailing on deep burgundy fabric create a luxurious look for the African boutique market.',['Wine#7b1e3b','Gold#d4af37','Black#1a1a1a']],
  ['3792e2811d1d1c3512a45e22edc53ab3.jpg','long-sleeve-tie-dye-sunset-maxi-dress','Tie-Dye Sunset Maxi Dress','Flowy long-sleeve maxi dress featuring a warm tie-dye gradient in earthy sunset tones. Lightweight fabric with a relaxed silhouette, perfect for boutique plus-size customers seeking effortless elegance.',['Rust#b7410e','Goldenrod#daa520','Chocolate#5c3317']],
  ['38ecb64a2fc2720e5d3405a00239f738.jpg','short-sleeve-abstract-print-midi-dress','Abstract Print Flowy Midi Dress','Short-sleeve midi dress with a vibrant abstract swirl print in blue and purple tones. Breathable fabric with a loose, comfortable fit designed for curvy figures who love bold artistic patterns.',['Royal Blue#4169e1','Purple#800080','Pink#ff69b4']],
  ['4d149e88100819bf4c50c808ded050c2.jpg','long-sleeve-paisley-print-maxi-dress','Paisley Print Maxi Dress','Elegant long-sleeve maxi dress featuring a rich paisley and ethnic-inspired print in teal, red, and orange. Flowing silhouette with comfortable fit, ideal for plus-size boutique buyers looking for statement pieces.',['Teal#008080','Crimson#dc143c','Tangerine#f28500']],
  ['55449c29bdcba7f97b8669ae5f19e861.jpg','short-sleeve-tropical-floral-midi-dress','Tropical Floral Print Midi Dress','Short-sleeve midi dress with a lively tropical floral print in pink, blue, and green. Lightweight and airy with a relaxed fit, perfect for warm-weather plus-size collections targeting African boutique buyers.',['Hot Pink#ff69b4','Sky Blue#87ceeb','Lime Green#32cd32']],
  ['5557a200644efedee420800d310c1072.jpg','long-sleeve-ethnic-print-maxi-dress','Ethnic Print Maxi Dress','Striking long-sleeve maxi dress with a bold ethnic-inspired geometric print in deep blue, red, and yellow. Flowing silhouette with cultural appeal, designed for plus-size customers who want vibrant statement wear.',['Navy Blue#000080','Firebrick Red#b22222','Saffron Yellow#f4c430']],
  ['5db8f24cf11042c211a8cc9e3081ac28.jpg','short-sleeve-v-neck-ankara-maxi-dress','Ankara Print V-Neck Maxi Dress','Flowing maxi dress in bold Ankara wax print with a flattering V-neckline and short sleeves. Lightweight fabric drapes beautifully, making it perfect for boutique customers seeking statement occasion wear.',['Wine#7b1e3b','Mustard#d4a017','Cream#f5f5dc']],
  ['6586fede8f2ea025a25fce3033ea1edd.jpg','long-sleeve-high-neck-ankara-midi-dress','High Neck Ankara Midi Dress','Fitted midi dress featuring a chic high neckline and long sleeves in vibrant Ankara print. The body-hugging silhouette flatters curves while the bold geometric pattern turns heads at any event.',['Royal Blue#1e3a8a','Orange#e85d04','White#ffffff']],
  ['75a90b4f6dcd44e52973bdeed9d4150f.jpg','short-sleeve-wide-leg-ankara-jumpsuit','Wide Leg Ankara Jumpsuit','Trendy wide-leg jumpsuit in eye-catching Ankara print with short sleeves and a relaxed bodice. The flowing trousers offer comfort and elegance, ideal for fashion-forward boutique buyers looking for versatile statement pieces.',['Teal#008080','Orange#e85d04','Black#1a1a1a']],
  ['8fc3cd36190f0ce53c9863d6757e78ec.jpg','sleeveless-fitted-ankara-midi-dress','Sleeveless Ankara Midi Dress','Sleek sleeveless midi dress in striking Ankara wax print with a fitted bodice and flared skirt. The sleeveless cut keeps it cool for warm climates while the bold pattern appeals to stylish boutique customers.',['Plum#6b2d5c','Rose Pink#e8a0bf','White#ffffff']],
  ['959777c3cc876d5b54200973b1ed53ec.jpg','puff-sleeve-round-neck-ankara-blouse','Puff Sleeve Ankara Blouse','Fashion-forward blouse with statement puff sleeves and a classic round neckline in bold Ankara print. Pairs effortlessly with solid bottoms, making it a versatile must-have for boutiques targeting trendy African women.',['Mustard#d4a017','Black#1a1a1a','White#ffffff']],
  ['982c4ac82ad8ab6a31ef5b9490d87a79.jpg','terracotta-floral-print-long-sleeve-maxi-dress','Terracotta Floral Print Maxi Dress','Elegant long-sleeve maxi dress in warm terracotta with all-over floral print. Flowing silhouette with V-neckline, perfect for boutique customers seeking versatile statement pieces.',['Terracotta#c44e1b','Forest Green#2d4a2b','Cream#f0e6d2']],
  ['Gemini_Generated_Image_2iqb4o2iqb4o2iqb.png','rose-pink-v-neck-ruched-midi-dress','Rose Pink V-Neck Ruched Midi Dress','Feminine midi dress in soft rose pink with flattering V-neckline and side ruching detail. Form-fitting silhouette that enhances curves, ideal for plus-size African market buyers.',['Rose Pink#d98a9a','Blush#e8c5cb','Mauve#9a6a78']],
  ['Gemini_Generated_Image_alswwgalswwgalsw.png','long-sleeve-pleated-v-neck-wine-maxi-dress','Pleated Long Sleeve Wine Maxi Dress','Elegant plus-size maxi dress in rich wine with pleated detailing and V-neckline, designed for confident African boutique customers seeking sophisticated occasion wear.',['Wine#7b1e3b','Maroon#5c1a2e','Burgundy#6d1f3a']],
  ['Gemini_Generated_Image_lry2ullry2ullry2.png','short-sleeve-floral-print-midi-dress','Short Sleeve Floral Print Midi Dress','Romantic plus-size midi dress with vibrant floral print and short sleeves, crafted from breathable fabric ideal for African climate and everyday boutique styling.',['Cream#f5ecd9','Rose#c97b8a','Sage Green#8a9a6b']],
  ['Gemini_Generated_Image_mtejb6mtejb6mtej.png','v-neck-pleated-purple-maxi-dress','V-Neck Pleated Purple Maxi Dress','Flowing pleated maxi dress in rich purple with a flattering V-neckline, designed for curvy figures. Lightweight fabric drapes elegantly for African boutique buyers.',['Purple#6B2D7A','Plum#4A1A47','Lavender#B8A0C8']],
  ['Gemini_Generated_Image_y3lyily3lyily3ly.png','short-sleeve-floral-orange-midi-dress','Short Sleeve Floral Orange Midi Dress','Vibrant floral midi dress in warm orange tones with short sleeves, tailored for plus-size comfort. Eye-catching print perfect for African retail boutiques seeking bold statement pieces.',['Orange#E07A2B','Coral#F08060','Cream#F5E6D3']],
  ['ace80938a254bbdabbcb91f7a5391c68.jpg','v-neck-short-sleeve-floral-maxi-dress','V-Neck Floral Print Maxi Dress','Flowing A-line maxi dress with a flattering V-neckline and short sleeves, featuring an all-over floral print. The soft, draped fabric offers comfortable movement, making it perfect for both casual outings and special occasions in warm African climates.',['Wine#7b1e3b','Rose Pink#d4728a','Cream#f5e6d3']],
  ['e7e4fdb63921d2eb569566517b82fb87.jpg','long-sleeve-tribal-print-fit-flare-dress','Long Sleeve Tribal Print Dress','Structured fit-and-flare dress with long sleeves and a bold tribal-inspired geometric print. The tailored bodice cinches at the waist before flaring into a graceful skirt, combining cultural heritage with contemporary plus-size tailoring for boutique buyers.',['Olive Green#6b7a4a','Earth Brown#8b6b4a','Cream#f0e8d8']],
  ['f7570bcf350e7e166dbd4e69070ad1c5.jpg','short-sleeve-colorful-floral-midi-dress','Short Sleeve Colorful Floral Midi Dress','Relaxed-fit midi dress with short sleeves and a vibrant floral print in warm sunset tones. The breathable fabric and easy silhouette make it an ideal everyday piece that transitions effortlessly from day to evening wear for the modern African woman.',['Burnt Orange#cc6633','Golden Yellow#e6b84d','Coral Red#d94f4f']],
  ['fb9c99d1585118fc04d12ab3704729fe.jpg','long-sleeve-geometric-print-maxi-dress','Long Sleeve Geometric Print Maxi Dress','Elegant flowing maxi dress with long sleeves and a striking geometric print. The high-contrast pattern on a dark base creates a sophisticated statement piece, while the loose, drapey silhouette ensures all-day comfort for plus-size women seeking bold, confident style.',['Deep Navy#1a2a4a','White#f5f5f5','Teal#2a8a7a']],
  ['fcb5cb6f3a402f31f91e8f9f6ca9f98c.jpg','wrap-style-floral-belted-midi-dress','Wrap Style Floral Belted Midi Dress','Versatile wrap-style midi dress with short sleeves and a coordinating tie belt, featuring a lush floral print in cool blue-green tones. The adjustable wrap design flatters curves while the lightweight fabric keeps the wearer cool and comfortable in tropical African weather.',['Ocean Blue#2a6b8a','Sage Green#8aa87a','Ivory#f2ede0']]
];

const FEATURES = [
  'True plus size grading up to 5XL',
  'Premium fabric that holds shape wash after wash',
  'Double-stitched seams for wholesale durability',
  'Available for ready stock and custom orders'
];
const SIZES = ['XL', 'XXL', '3XL', '4XL', '5XL'];

// 素材源目录（项目根目录下的相对路径，不入库）：上新/7月16
const sourceDir = '上新/7月16';
const outputDir = 'public/images/products';
const products = JSON.parse(readFileSync('data/products.json', 'utf8'));
const existingSlugs = new Set(products.map((product) => product.slug));
const existingDescriptors = new Set();
const additions = [];
let nextId = Math.max(...products.map((product) => Number(product.id))) + 1;

mkdirSync(outputDir, { recursive: true });
for (const [index, [source, descriptor, name, description, colorPairs]] of items.entries()) {
  if (existingDescriptors.has(descriptor)) throw new Error(`Duplicate descriptor: ${descriptor}`);
  existingDescriptors.add(descriptor);
  const ext = source.split('.').pop().toLowerCase();
  const filename = `psd0716-${String(index + 1).padStart(2, '0')}-${descriptor}.${ext}`;
  const image = `/images/products/${filename}`;
  const slug = `plus-size-${descriptor}`;
  const sourcePath = join(sourceDir, source);
  const outputPath = join(outputDir, filename);
  if (!existsSync(sourcePath)) throw new Error(`Missing source image: ${sourcePath}`);
  if (!existsSync(outputPath)) copyFileSync(sourcePath, outputPath);
  if (existingSlugs.has(slug)) continue;
  const colors = colorPairs.map((pair) => {
    const [cname, chex] = pair.split('#');
    return { name: cname, hex: '#' + chex };
  });
  additions.push({
    id: String(nextId++), slug, name, category: 'Plus Size Dresses', image, images: [image],
    moq: 30, moqOptions: [30, 100, 300], stockType: 'Ready Stock & Custom',
    tags: ['Plus Size', 'Wholesale', 'New Arrival'], sizes: SIZES,
    colors,
    description,
    features: FEATURES,
    whatsappMessage: `Hello Jack, I'd like the wholesale price for the ${name}. How many pieces per size ratio?`,
    isNew: true, isPopular: false,
    detailPage: { detailSections: [{ enabled: true, title: 'Style Highlights', body: description, image, layout: 'full-width' }] }
  });
}

writeFileSync('data/products.json', `${JSON.stringify([...products, ...additions], null, 2)}\n`);
console.log(`Added: ${additions.length} | Total: ${products.length + additions.length}`);
