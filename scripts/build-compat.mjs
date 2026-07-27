import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const rootDir = process.cwd();
const rootDistDir = resolve(rootDir, 'dist');
const coreDistDir = resolve(rootDir, 'packages/core/dist');
const reactDistDir = resolve(rootDir, 'packages/react/dist');
const coreTailwindPreset = resolve(rootDir, 'packages/core/tailwind.preset.cjs');
const rootTailwindPreset = resolve(rootDir, 'tailwind.preset.cjs');

if (!existsSync(coreDistDir)) {
  throw new Error('Missing packages/core/dist. Run "npm run build:core" first.');
}

if (!existsSync(reactDistDir)) {
  throw new Error('Missing packages/react/dist. Run "npm run build:frameworks" first.');
}

rmSync(rootDistDir, { recursive: true, force: true });
mkdirSync(rootDistDir, { recursive: true });

cpSync(coreDistDir, rootDistDir, { recursive: true });
cpSync(resolve(reactDistDir, 'index.js'), resolve(rootDistDir, 'react.js'));
cpSync(resolve(reactDistDir, 'index.d.ts'), resolve(rootDistDir, 'react.d.ts'));
cpSync(coreTailwindPreset, rootTailwindPreset);

console.log('Built root compatibility artifacts in dist/.');
