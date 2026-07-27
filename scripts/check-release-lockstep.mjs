import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const rootDir = process.cwd();

const readVersion = (relativePath) => {
  const packageJson = JSON.parse(readFileSync(resolve(rootDir, relativePath), 'utf8'));
  return packageJson.version;
};

const versions = {
  core: readVersion('packages/core/package.json'),
  react: readVersion('packages/react/package.json'),
  vue: readVersion('packages/vue/package.json')
};

const uniqueVersions = new Set(Object.values(versions));

if (uniqueVersions.size !== 1) {
  console.error('Release lockstep check failed. Versions must match for core/react/vue.');
  console.error(JSON.stringify(versions, null, 2));
  process.exit(1);
}

console.log(`Release lockstep check passed: ${versions.core}`);
