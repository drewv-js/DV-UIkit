// Regenerates src/icon-name.generated.ts from the curated icon allowlist.
// Run: node ./scripts/generate-icon-names.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { fas } from '@fortawesome/free-solid-svg-icons';

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalogPath = join(__dirname, '../src/internal/icon-catalog.json');
const CURATED_ICON_NAMES = JSON.parse(readFileSync(catalogPath, 'utf8'));

const toKebabAlias = (camelKey) =>
	camelKey
		.replace(/^fa/, '')
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.toLowerCase();

const availableNames = new Set();
for (const [key, def] of Object.entries(fas)) {
	if (!def || !def.iconName) continue;
	availableNames.add(def.iconName);
	const alias = toKebabAlias(key);
	if (alias) availableNames.add(alias);
}

const missing = CURATED_ICON_NAMES.filter((name) => !availableNames.has(name));
if (missing.length) {
	throw new Error(`Curated icon names not found in @fortawesome/free-solid-svg-icons: ${missing.join(', ')}`);
}

const sorted = [...CURATED_ICON_NAMES].sort();
const body = sorted.map((name) => `\t| '${name}'`).join('\n');

const output = `// AUTO-GENERATED — do not edit manually.
// Edit src/internal/icon-catalog.json, then run \`node ./scripts/generate-icon-names.mjs\` to regenerate.
// Source: @fortawesome/free-solid-svg-icons (curated allowlist)
export type IconName =
${body};
`;

writeFileSync(join(__dirname, '../src/icon-name.generated.ts'), output);
console.log(`Wrote ${sorted.length} icon names to src/icon-name.generated.ts`);


