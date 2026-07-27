import { existsSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();

const requiredFiles = [
  'dist/components/index.js',
  'dist/components/index.d.ts',
  'dist/auto-register.js',
  'dist/auto-register.d.ts',
  'dist/react.js',
  'dist/react.d.ts',
  'dist/styles.css',
  'tailwind.preset.cjs',
  'README.md',
  'SECURITY.md',
  'LICENSE'
];

const packJsonRaw = execSync('npm pack --json --silent', { cwd: rootDir }).toString().trim();
const packResult = JSON.parse(packJsonRaw);
const packEntry = Array.isArray(packResult) ? packResult[0] : packResult;

if (!packEntry || !packEntry.filename || !Array.isArray(packEntry.files)) {
  throw new Error('Unable to parse npm pack JSON output.');
}

const packedFiles = new Set(packEntry.files.map((entry) => entry.path));
const missingFiles = requiredFiles.filter((filePath) => !packedFiles.has(filePath));

const archivePath = resolve(rootDir, packEntry.filename);
if (existsSync(archivePath)) {
  unlinkSync(archivePath);
}

if (missingFiles.length > 0) {
  console.error('Pack artifact verification failed. Missing files:');
  for (const missingFile of missingFiles) {
    console.error(`- ${missingFile}`);
  }
  process.exit(1);
}

console.log(`Pack artifact verification passed for ${packEntry.filename}`);
