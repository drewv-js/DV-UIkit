import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const componentsRoot = join(process.cwd(), 'src', 'components');
const entries = readdirSync(componentsRoot).filter((name) =>
  statSync(join(componentsRoot, name)).isDirectory()
);

const errors = [];

for (const name of entries) {
  const base = join(componentsRoot, name);
  const required = [`${name}.tsx`, `${name}.scss`, `${name}.spec.tsx`];

  for (const file of required) {
    if (!existsSync(join(base, file))) {
      errors.push(`Missing ${file} in src/components/${name}`);
    }
  }
}

if (errors.length > 0) {
  console.error('Component structure validation failed:');
  for (const err of errors) {
    console.error(`- ${err}`);
  }
  process.exit(1);
}

console.log(`Component structure valid for ${entries.length} component folder(s).`);
