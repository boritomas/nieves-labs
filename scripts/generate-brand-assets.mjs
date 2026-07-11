import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const outDir = join(process.cwd(), 'public', 'brand');
const productDir = join(outDir, 'products');
const reviewDir = join(outDir, 'review');
const sizes = [16, 32, 48, 64, 128, 256, 512, 1024];

const colors = {
  navy: '#06111E',
  navy2: '#0D1B2A',
  gold: '#D4AF37',
  gold2: '#F2C14E',
  white: '#F8FAFC',
  slate: '#94A3B8',
  black: '#020617',
};

const products = [
  ['answerbrief-ai', 'AnswerBrief AI', '#2563EB', messageGlyph()],
  ['mixpilot-ai', 'MixPilot AI', '#A855F7', flaskGlyph()],
  ['tax-buddy-ai', 'Tax Buddy AI', '#10B981', documentGlyph()],
  ['tax-appeal-buddy-ai', 'Tax Appeal Buddy AI', '#06B6D4', columnsGlyph()],
  ['interview-coach-ai', 'Interview Coach AI', '#F97316', personGlyph()],
  ['workforce-study-ai', 'Workforce Study AI', '#FBBF24', chartGlyph()],
  ['nieves-ai-platform', 'Nieves AI Platform', '#6366F1', networkGlyph()],
];

await mkdir(outDir, { recursive: true });
await mkdir(productDir, { recursive: true });
await mkdir(reviewDir, { recursive: true });

const monogramSvg = parentMonogramSvg();
const horizontalSvg = parentHorizontalSvg();
const stackedSvg = parentStackedSvg();
const wordmarkSvg = parentWordmarkSvg();

await writeText('nieves-labs-monogram.svg', monogramSvg);
await writeText('nieves-labs-horizontal.svg', horizontalSvg);
await writeText('nieves-labs-stacked.svg', stackedSvg);
await writeText('nieves-labs-wordmark.svg', wordmarkSvg);
await writeText('nieves-labs-monogram-white.svg', parentMonogramSvg({ mono: colors.white, bg: 'transparent' }));
await writeText('nieves-labs-monogram-black.svg', parentMonogramSvg({ mono: colors.black, bg: 'transparent' }));
await writeText('nieves-labs-monogram-gold.svg', parentMonogramSvg({ mono: colors.gold, bg: 'transparent' }));

for (const size of sizes) {
  await renderPng(monogramSvg, join(outDir, `nieves-labs-icon-${size}.png`), size, size);
}

await sharp(Buffer.from(monogramSvg)).resize(512, 512).webp({ quality: 92 }).toFile(join(outDir, 'nieves-labs-icon-512.webp'));
await writeFile(join(outDir, 'nieves-labs.ico'), await pngToIco([
  join(outDir, 'nieves-labs-icon-16.png'),
  join(outDir, 'nieves-labs-icon-32.png'),
  join(outDir, 'nieves-labs-icon-48.png'),
]));
await copyFile(join(outDir, 'nieves-labs.ico'), join(process.cwd(), 'public', 'favicon.ico'));
await sharp(Buffer.from(monogramSvg)).resize(180, 180).png().toFile(join(outDir, 'apple-touch-icon.png'));
await sharp(Buffer.from(ogSvg())).resize(1200, 630).png().toFile(join(outDir, 'nieves-labs-og.png'));
await sharp(Buffer.from(ogSvg())).resize(1200, 630).webp({ quality: 92 }).toFile(join(outDir, 'nieves-labs-og.webp'));
await sharp(Buffer.from(homepageMockupSvg())).resize(1440, 980).png().toFile(join(reviewDir, 'website-homepage-mockup.png'));
await sharp(Buffer.from(mobileMockupSvg())).resize(1080, 1350).png().toFile(join(reviewDir, 'mobile-app-mockup.png'));
await sharp(Buffer.from(emailMockupSvg())).resize(1200, 760).png().toFile(join(reviewDir, 'email-template-mockup.png'));
await sharp(Buffer.from(socialMockupSvg())).resize(1080, 1080).png().toFile(join(reviewDir, 'social-post-template.png'));

for (const [slug, name, accent, glyph] of products) {
  const svg = productIconSvg(accent, glyph);
  await writeText(`products/${slug}.svg`, svg);
  await writeText(`products/${slug}-logo.svg`, productLogoSvg(name, accent, glyph));
  await writeText(`products/${slug}-mono.svg`, productIconSvg(colors.white, glyph, { mono: true }));
  for (const size of sizes) {
    await renderPng(svg, join(productDir, `${slug}-${size}.png`), size, size);
  }
  await sharp(Buffer.from(svg)).resize(512, 512).webp({ quality: 92 }).toFile(join(productDir, `${slug}-512.webp`));
  await writeFile(join(productDir, `${slug}.ico`), await pngToIco([
    join(productDir, `${slug}-16.png`),
    join(productDir, `${slug}-32.png`),
    join(productDir, `${slug}-48.png`),
  ]));
}

function writeText(name, value) {
  return writeFile(join(outDir, name), value);
}

function renderPng(svg, target, width, height) {
  return sharp(Buffer.from(svg)).resize(width, height).png().toFile(target);
}

function parentMonogramSvg(options = {}) {
  const stroke = options.mono || colors.gold;
  const highlight = options.mono || colors.gold2;
  const bg = options.bg ?? `url(#bg)`;
  return svgWrap(512, 512, `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${colors.navy2}"/>
        <stop offset="1" stop-color="${colors.black}"/>
      </linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FFF1AE"/>
        <stop offset="0.18" stop-color="${stroke}"/>
        <stop offset="0.42" stop-color="#9B6A18"/>
        <stop offset="0.7" stop-color="${highlight}"/>
        <stop offset="1" stop-color="#6F4712"/>
      </linearGradient>
    </defs>
    <rect x="20" y="20" width="472" height="472" rx="96" fill="${bg}"/>
    <path d="M116 414V98h280v316" fill="none" stroke="rgba(0,0,0,.5)" stroke-width="54" stroke-linecap="square" stroke-linejoin="miter" transform="translate(8 8)"/>
    <path d="M116 414V98h280v316" fill="none" stroke="url(#gold)" stroke-width="48" stroke-linecap="square" stroke-linejoin="miter"/>
    <path d="M158 404V118l196 286V118" fill="none" stroke="rgba(0,0,0,.48)" stroke-width="70" stroke-linecap="square" stroke-linejoin="miter" transform="translate(7 7)"/>
    <path d="M158 404V118l196 286V118" fill="none" stroke="url(#gold)" stroke-width="58" stroke-linecap="square" stroke-linejoin="miter"/>
    <path d="M230 120h86l58 76" fill="none" stroke="#FFF4B7" stroke-width="24" stroke-linecap="square"/>
    <path d="M126 108h82" fill="none" stroke="#FFF4B7" stroke-width="14" stroke-linecap="square"/>
  `);
}

function parentHorizontalSvg() {
  return svgWrap(1200, 360, `
    <rect width="1200" height="360" rx="44" fill="${colors.navy}"/>
    <g transform="translate(72 56) scale(.48)">${extractInner(parentMonogramSvg({ bg: 'transparent' }))}</g>
    <text x="360" y="154" fill="${colors.white}" font-size="74" font-family="Inter, Arial, sans-serif" font-weight="800" letter-spacing="10">NIEVES LABS</text>
    <text x="364" y="216" fill="${colors.gold2}" font-size="28" font-family="Inter, Arial, sans-serif" font-weight="700" letter-spacing="4">AI SOLUTIONS THAT EMPOWER PEOPLE</text>
  `);
}

function parentStackedSvg() {
  return svgWrap(720, 720, `
    <rect width="720" height="720" rx="56" fill="${colors.navy}"/>
    <g transform="translate(176 64) scale(.72)">${extractInner(parentMonogramSvg({ bg: 'transparent' }))}</g>
    <text x="360" y="530" text-anchor="middle" fill="${colors.white}" font-size="52" font-family="Inter, Arial, sans-serif" font-weight="800" letter-spacing="8">NIEVES LABS</text>
    <text x="360" y="586" text-anchor="middle" fill="${colors.gold2}" font-size="19" font-family="Inter, Arial, sans-serif" font-weight="700" letter-spacing="3">AI SOLUTIONS THAT EMPOWER PEOPLE</text>
  `);
}

function parentWordmarkSvg() {
  return svgWrap(860, 180, `
    <text x="16" y="92" fill="${colors.white}" font-size="72" font-family="Inter, Arial, sans-serif" font-weight="800" letter-spacing="10">NIEVES LABS</text>
    <text x="20" y="142" fill="${colors.gold2}" font-size="23" font-family="Inter, Arial, sans-serif" font-weight="700" letter-spacing="4">AI SOLUTIONS THAT EMPOWER PEOPLE</text>
  `);
}

function productIconSvg(accent, glyph, options = {}) {
  const bg = options.mono ? 'transparent' : colors.navy2;
  return svgWrap(512, 512, `
    <rect x="20" y="20" width="472" height="472" rx="108" fill="${bg}" stroke="${options.mono ? accent : 'rgba(255,255,255,.14)'}" stroke-width="10"/>
    <g transform="translate(96 96) scale(5)" fill="none" stroke="${accent}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">${glyph}</g>
  `);
}

function productLogoSvg(name, accent, glyph) {
  return svgWrap(960, 260, `
    <rect width="960" height="260" rx="34" fill="${colors.navy}"/>
    <g transform="translate(54 54) scale(.31)">${extractInner(productIconSvg(accent, glyph))}</g>
    <text x="240" y="118" fill="${accent}" font-size="52" font-family="Inter, Arial, sans-serif" font-weight="800">${escapeXml(name)}</text>
    <text x="242" y="172" fill="${colors.slate}" font-size="25" font-family="Inter, Arial, sans-serif" font-weight="500">A Nieves Labs product</text>
  `);
}

function ogSvg() {
  return svgWrap(1200, 630, `
    <defs>
      <radialGradient id="glow" cx=".8" cy=".35" r=".7">
        <stop offset="0" stop-color="#D4AF37" stop-opacity=".36"/>
        <stop offset="1" stop-color="#06111E" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="630" fill="${colors.navy}"/>
    <rect width="1200" height="630" fill="url(#glow)"/>
    <g transform="translate(770 104) scale(.62)">${extractInner(parentMonogramSvg({ bg: 'transparent' }))}</g>
    <text x="84" y="190" fill="${colors.white}" font-size="74" font-family="Inter, Arial, sans-serif" font-weight="800">Nieves Labs</text>
    <text x="88" y="252" fill="${colors.gold2}" font-size="30" font-family="Inter, Arial, sans-serif" font-weight="700" letter-spacing="3">AI SOLUTIONS THAT EMPOWER PEOPLE</text>
    <text x="88" y="348" fill="${colors.slate}" font-size="34" font-family="Inter, Arial, sans-serif" font-weight="500">Practical AI products and automation workflows for clearer work, faster.</text>
  `);
}

function homepageMockupSvg() {
  const cards = products.slice(0, 6).map(([slug, name, accent, glyph], index) => {
    const x = 94 + (index % 3) * 400;
    const y = 520 + Math.floor(index / 3) * 160;
    return `
      <rect x="${x}" y="${y}" width="344" height="118" rx="22" fill="rgba(13,27,42,.88)" stroke="rgba(226,232,240,.16)"/>
      <g transform="translate(${x + 22} ${y + 24}) scale(.13)">${extractInner(productIconSvg(accent, glyph))}</g>
      <text x="${x + 104}" y="${y + 52}" fill="${accent}" font-size="24" font-family="Inter, Arial" font-weight="800">${escapeXml(name)}</text>
      <text x="${x + 104}" y="${y + 86}" fill="${colors.slate}" font-size="17" font-family="Inter, Arial">A focused Nieves Labs product</text>
    `;
  }).join('');

  return svgWrap(1440, 980, `
    <rect width="1440" height="980" fill="${colors.navy}"/>
    <circle cx="1160" cy="180" r="360" fill="${colors.gold}" opacity=".16"/>
    <rect x="64" y="48" width="1312" height="76" rx="24" fill="rgba(248,250,252,.05)" stroke="rgba(226,232,240,.16)"/>
    <g transform="translate(88 60) scale(.12)">${extractInner(parentMonogramSvg({ bg: 'transparent' }))}</g>
    <text x="164" y="94" fill="${colors.white}" font-size="24" font-family="Inter, Arial" font-weight="800" letter-spacing="3">NIEVES LABS</text>
    <text x="1030" y="94" fill="${colors.slate}" font-size="17" font-family="Inter, Arial">Products   Solutions   About   Contact</text>
    <text x="92" y="240" fill="${colors.gold2}" font-size="22" font-family="Inter, Arial" font-weight="800" letter-spacing="4">NIEVES AI PRODUCT ECOSYSTEM</text>
    <text x="92" y="332" fill="${colors.white}" font-size="76" font-family="Inter, Arial" font-weight="850">AI solutions that</text>
    <text x="92" y="418" fill="${colors.white}" font-size="76" font-family="Inter, Arial" font-weight="850">empower people.</text>
    <text x="96" y="474" fill="${colors.slate}" font-size="25" font-family="Inter, Arial">Practical AI products and automation workflows for clearer work, faster.</text>
    <g transform="translate(1050 186) scale(.46)">${extractInner(parentMonogramSvg({ bg: 'transparent' }))}</g>
    ${cards}
  `);
}

function mobileMockupSvg() {
  return svgWrap(1080, 1350, `
    <rect width="1080" height="1350" fill="${colors.navy}"/>
    <text x="88" y="112" fill="${colors.gold2}" font-size="28" font-family="Inter, Arial" font-weight="800" letter-spacing="4">MOBILE EXPERIENCE</text>
    <text x="88" y="188" fill="${colors.white}" font-size="62" font-family="Inter, Arial" font-weight="850">Product apps that feel</text>
    <text x="88" y="258" fill="${colors.white}" font-size="62" font-family="Inter, Arial" font-weight="850">premium and practical.</text>
    <rect x="310" y="338" width="460" height="860" rx="72" fill="#020617" stroke="rgba(226,232,240,.25)" stroke-width="6"/>
    <rect x="342" y="384" width="396" height="768" rx="44" fill="${colors.navy2}"/>
    <g transform="translate(462 442) scale(.32)">${extractInner(parentMonogramSvg({ bg: 'transparent' }))}</g>
    <text x="540" y="660" text-anchor="middle" fill="${colors.white}" font-size="38" font-family="Inter, Arial" font-weight="800">AnswerBrief AI</text>
    <rect x="392" y="720" width="296" height="72" rx="18" fill="#2563EB"/>
    <text x="540" y="766" text-anchor="middle" fill="${colors.white}" font-size="22" font-family="Inter, Arial" font-weight="800">Start Fit Check</text>
    <rect x="392" y="832" width="296" height="170" rx="24" fill="rgba(248,250,252,.07)" stroke="rgba(226,232,240,.14)"/>
    <text x="424" y="888" fill="${colors.gold2}" font-size="18" font-family="Inter, Arial" font-weight="800">ORDER STATUS</text>
    <text x="424" y="940" fill="${colors.white}" font-size="26" font-family="Inter, Arial" font-weight="800">Brief in progress</text>
    <text x="424" y="980" fill="${colors.slate}" font-size="19" font-family="Inter, Arial">Secure intake received</text>
  `);
}

function emailMockupSvg() {
  return svgWrap(1200, 760, `
    <rect width="1200" height="760" fill="${colors.navy}"/>
    <rect x="160" y="90" width="880" height="580" rx="34" fill="#F8FAFC"/>
    <rect x="160" y="90" width="880" height="110" rx="34" fill="${colors.navy2}"/>
    <g transform="translate(204 118) scale(.12)">${extractInner(parentMonogramSvg({ bg: 'transparent' }))}</g>
    <text x="284" y="156" fill="${colors.white}" font-size="24" font-family="Inter, Arial" font-weight="800" letter-spacing="3">NIEVES LABS</text>
    <text x="220" y="282" fill="#0D1B2A" font-size="42" font-family="Inter, Arial" font-weight="850">Your AnswerBrief is ready.</text>
    <text x="220" y="350" fill="#334155" font-size="24" font-family="Inter, Arial">A polished, branded transactional email template powered by the shared NAIP-OS email service.</text>
    <rect x="220" y="430" width="210" height="58" rx="14" fill="#D4AF37"/>
    <text x="325" y="468" text-anchor="middle" fill="#111827" font-size="20" font-family="Inter, Arial" font-weight="800">View Brief</text>
    <line x1="220" y1="560" x2="980" y2="560" stroke="#E2E8F0"/>
    <text x="220" y="618" fill="#64748B" font-size="18" font-family="Inter, Arial">A Nieves Labs product • Privacy • Support</text>
  `);
}

function socialMockupSvg() {
  return svgWrap(1080, 1080, `
    <rect width="1080" height="1080" fill="${colors.navy}"/>
    <circle cx="880" cy="180" r="300" fill="${colors.gold}" opacity=".14"/>
    <g transform="translate(72 70) scale(.16)">${extractInner(parentMonogramSvg({ bg: 'transparent' }))}</g>
    <text x="176" y="122" fill="${colors.white}" font-size="34" font-family="Inter, Arial" font-weight="800" letter-spacing="4">NIEVES LABS</text>
    <text x="82" y="386" fill="${colors.white}" font-size="72" font-family="Inter, Arial" font-weight="850">AI solutions</text>
    <text x="82" y="470" fill="${colors.white}" font-size="72" font-family="Inter, Arial" font-weight="850">that empower</text>
    <text x="82" y="554" fill="${colors.white}" font-size="72" font-family="Inter, Arial" font-weight="850">people.</text>
    <text x="88" y="632" fill="${colors.slate}" font-size="30" font-family="Inter, Arial">Product launch and feature announcement template.</text>
    <rect x="82" y="760" width="310" height="76" rx="18" fill="${colors.gold}"/>
    <text x="237" y="808" text-anchor="middle" fill="#111827" font-size="26" font-family="Inter, Arial" font-weight="850">Explore Products</text>
    <g transform="translate(720 640) scale(.46)">${extractInner(parentMonogramSvg({ bg: 'transparent' }))}</g>
  `);
}

function svgWrap(width, height, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${inner}</svg>`;
}

function extractInner(svg) {
  return svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
}

function escapeXml(value) {
  return value.replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]);
}

function messageGlyph() {
  return '<path d="M8 14h48a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8H32L16 58V48H8a8 8 0 0 1-8-8V22a8 8 0 0 1 8-8Z"/><circle cx="22" cy="31" r="3"/><circle cx="32" cy="31" r="3"/><circle cx="42" cy="31" r="3"/>';
}

function flaskGlyph() {
  return '<path d="M24 4h16M28 4v18L10 56a6 6 0 0 0 5 8h34a6 6 0 0 0 5-8L36 22V4"/><path d="M17 48h30"/><circle cx="26" cy="56" r="2"/><circle cx="39" cy="53" r="3"/>';
}

function documentGlyph() {
  return '<path d="M16 4h30l10 10v46H16z"/><path d="M46 4v13h13M25 29h24M25 39h24M25 49h12"/><path d="m43 51 5 5 10-14"/>';
}

function columnsGlyph() {
  return '<path d="M6 22h52L32 6zM12 28h40M16 34v22M32 34v22M48 34v22M10 60h44"/>';
}

function personGlyph() {
  return '<circle cx="32" cy="16" r="9"/><path d="M14 60a18 18 0 0 1 36 0M8 32l12 7M56 32l-12 7M32 34v12"/>';
}

function chartGlyph() {
  return '<path d="M8 56h48M18 56V36M32 56V24M46 56V10"/><path d="m10 30 14-12 10 8 20-18"/><path d="M48 8h8v8"/>';
}

function networkGlyph() {
  return '<circle cx="32" cy="32" r="6"/><circle cx="12" cy="14" r="5"/><circle cx="52" cy="14" r="5"/><circle cx="13" cy="52" r="5"/><circle cx="52" cy="52" r="5"/><path d="M17 18 28 29M37 28l11-10M17 49l11-13M37 36l11 12"/>';
}
