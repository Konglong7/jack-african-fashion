import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const icon = await readFile('src/app/icon.svg');
await sharp(icon).resize(192, 192).png().toFile('public/images/site/jack-fashion-logo-192.png');
await sharp(icon).resize(512, 512).png().toFile('public/images/site/jack-fashion-logo-512.png');
const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#112b47"/>
<path d="M850 100v270c0 98-146 98-146 0M964 426V100h146M964 241h114" fill="none" stroke="#f4f6f7" stroke-width="32"/>
<path d="M700 485h425" stroke="#e8bd68" stroke-width="4"/>
<text x="66" y="160" fill="#f4f6f7" font-family="Georgia,serif" font-size="76">Jack Fashion</text>
<text x="70" y="238" fill="#e8bd68" font-family="Arial,sans-serif" font-size="26">Women’s clothing wholesale</text>
<text x="70" y="340" fill="#f4f6f7" font-family="Arial,sans-serif" font-size="40">Dresses. Sets. Plus-size styles.</text>
<text x="70" y="398" fill="#dce3e8" font-family="Arial,sans-serif" font-size="30">Guangzhou, China</text>
<text x="70" y="509" fill="#f4f6f7" font-family="Arial,sans-serif" font-size="28">WhatsApp +86 189 2625 7367</text>
<text x="70" y="558" fill="#dce3e8" font-family="Arial,sans-serif" font-size="24">zamique.com</text>
</svg>`;
await writeFile('public/images/site/jack-fashion-social.svg', social);
await sharp(Buffer.from(social)).png().toFile('public/images/site/jack-fashion-social.png');
console.log('Jack Fashion: 192px and 512px icons, 1200 × 630 social image generated.');
