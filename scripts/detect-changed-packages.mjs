import { appendFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const run = (command) => execSync(command, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();

const changedPackages = new Set();

const packageMap = [
  ['packages/core/', '@dv-uikit/core'],
  ['packages/react/', '@dv-uikit/react'],
  ['packages/vue/', '@dv-uikit/vue'],
  ['packages/design-tokens/', '@dv-uikit/design-tokens'],
  ['packages/eslint-config/', '@dv-uikit/eslint-config'],
  ['packages/jest-mocks/', '@dv-uikit/jest-mocks']
];

const rootTriggersCompatibility = [
  'package.json',
  'pnpm-workspace.yaml',
  'turbo.json',
  '.github/workflows/',
  'scripts/',
  'apps/',
  'packages/core/',
  'packages/react/',
  'packages/vue/',
  'packages/design-tokens/'
];

const resolveBase = () => {
  const requestedBase = process.env.BASE_REF || 'origin/main';
  try {
    run(`git rev-parse --verify ${requestedBase}`);
    return requestedBase;
  } catch {
    return 'HEAD~1';
  }
};

const baseRef = resolveBase();
const headRef = process.env.HEAD_REF || 'HEAD';

let changedFiles = [];
try {
  const output = run(`git diff --name-only ${baseRef}...${headRef}`);
  changedFiles = output ? output.split(/\r?\n/).filter(Boolean) : [];
} catch {
  changedFiles = [];
}

for (const filePath of changedFiles) {
  for (const [prefix, packageName] of packageMap) {
    if (filePath.startsWith(prefix)) {
      changedPackages.add(packageName);
    }
  }

  if (rootTriggersCompatibility.some((prefix) => filePath.startsWith(prefix) || filePath === prefix)) {
    changedPackages.add('@dv-uikit/web-components');
  }
}

const changedList = [...changedPackages].sort();
const shouldPublishRoot = changedPackages.has('@dv-uikit/web-components');

console.log(`Base ref: ${baseRef}`);
console.log(`Head ref: ${headRef}`);
console.log(`Changed files: ${changedFiles.length}`);
console.log(`Changed packages: ${changedList.join(', ') || '(none)'}`);
console.log(`should_publish_root=${shouldPublishRoot}`);

if (process.env.GITHUB_OUTPUT && existsSync(process.env.GITHUB_OUTPUT)) {
  appendFileSync(process.env.GITHUB_OUTPUT, `should_publish_root=${shouldPublishRoot}\n`);
  appendFileSync(process.env.GITHUB_OUTPUT, `changed_packages=${changedList.join(',')}\n`);
}
