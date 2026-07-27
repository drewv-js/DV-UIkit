import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const srcPath = join(root, 'src', 'tokens.json');
const buildCssPath = join(root, 'build', 'css', 'dv-tokens.css');
const buildJsonPath = join(root, 'build', 'json', 'tokens.json');
const buildTailwindPath = join(root, 'build', 'tailwind', 'dv-tailwind-tokens.cjs');

const raw = readFileSync(srcPath, 'utf8');
const tokens = JSON.parse(raw);

const css = `:root {\n  --dv-font-sans: ${tokens.font.sans};\n  --dv-color-surface: ${tokens.color.surface};\n  --dv-color-surface-strong: ${tokens.color.surfaceStrong};\n  --dv-color-border: ${tokens.color.border};\n  --dv-color-text: ${tokens.color.text};\n  --dv-color-text-muted: ${tokens.color.textMuted};\n  --dv-color-brand: ${tokens.color.brand};\n  --dv-color-brand-strong: ${tokens.color.brandStrong};\n  --dv-color-danger: ${tokens.color.danger};\n  --dv-radius-sm: ${tokens.radius.sm};\n  --dv-radius-md: ${tokens.radius.md};\n  --dv-radius-lg: ${tokens.radius.lg};\n  --dv-radius-xl: ${tokens.radius.xl};\n  --dv-space-1: ${tokens.space['1']};\n  --dv-space-2: ${tokens.space['2']};\n  --dv-space-3: ${tokens.space['3']};\n  --dv-space-4: ${tokens.space['4']};\n  --dv-space-6: ${tokens.space['6']};\n  --dv-space-8: ${tokens.space['8']};\n  --dv-shadow-soft: ${tokens.shadow.soft};\n}\n`;

const tailwindModule = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        brand: '${tokens.color.brand}',\n        'brand-strong': '${tokens.color.brandStrong}',\n        surface: '${tokens.color.surface}',\n        'surface-strong': '${tokens.color.surfaceStrong}',\n        border: '${tokens.color.border}',\n        text: '${tokens.color.text}',\n        'text-muted': '${tokens.color.textMuted}',\n        danger: '${tokens.color.danger}'\n      },\n      borderRadius: {\n        sm: '${tokens.radius.sm}',\n        md: '${tokens.radius.md}',\n        lg: '${tokens.radius.lg}',\n        xl: '${tokens.radius.xl}'\n      },\n      spacing: {\n        1: '${tokens.space['1']}',\n        2: '${tokens.space['2']}',\n        3: '${tokens.space['3']}',\n        4: '${tokens.space['4']}',\n        6: '${tokens.space['6']}',\n        8: '${tokens.space['8']}'\n      },\n      boxShadow: {\n        soft: '${tokens.shadow.soft}'\n      }\n    }\n  }\n};\n`;

for (const path of [buildCssPath, buildJsonPath, buildTailwindPath]) {
  mkdirSync(dirname(path), { recursive: true });
}

writeFileSync(buildCssPath, css);
writeFileSync(buildJsonPath, JSON.stringify(tokens, null, 2) + '\n');
writeFileSync(buildTailwindPath, tailwindModule);

console.log('Built design token artifacts:');
console.log('- build/css/dv-tokens.css');
console.log('- build/json/tokens.json');
console.log('- build/tailwind/dv-tailwind-tokens.cjs');
