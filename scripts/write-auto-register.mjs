import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist');

writeFileSync(
  join(distDir, 'auto-register.js'),
  "import { defineCustomElements } from './loader/index.js';\ndefineCustomElements();\n"
);

writeFileSync(
  join(distDir, 'auto-register.d.ts'),
  'export {};\n'
);

console.log('Wrote dist/auto-register.js and dist/auto-register.d.ts');
