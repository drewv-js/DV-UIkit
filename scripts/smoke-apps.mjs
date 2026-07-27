import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const rootDir = process.cwd();
const apps = ['react', 'vue', 'html'];

const run = (command, cwd) => {
  execSync(command, {
    cwd,
    stdio: 'inherit'
  });
};

for (const appName of apps) {
  const appDir = resolve(rootDir, 'apps', appName);
  console.log(`\n==> smoke app: ${appName}`);
  run('npm install --no-audit --no-fund', appDir);
  run('npm run build', appDir);
}

console.log('\nAll consumer app smoke builds passed.');
