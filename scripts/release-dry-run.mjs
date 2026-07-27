import { execSync } from 'node:child_process';

const run = (command) => {
  execSync(command, { stdio: 'inherit' });
};

run('npm run build:workspace');
run('npm run test:compat');
run('node ./scripts/verify-pack-artifacts.mjs');

console.log('Release dry-run checks passed.');
