import { mkdtempSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();
const tempDir = mkdtempSync(join(tmpdir(), 'dv-compat-smoke-'));

const run = (command, cwd) => {
  execSync(command, {
    cwd,
    stdio: 'inherit'
  });
};

let packedFile;

try {
  const packedOutput = execSync('npm pack --silent', { cwd: rootDir }).toString().trim();
  packedFile = packedOutput.split(/\r?\n/).filter(Boolean).at(-1);

  if (!packedFile) {
    throw new Error('npm pack did not return an archive filename.');
  }

  const packedFilePath = resolve(rootDir, packedFile);

  run('npm init -y', tempDir);
  run(`npm install "${packedFilePath}" react react-dom --silent`, tempDir);

  const checkFile = resolve(tempDir, 'check.mjs');
  writeFileSync(
    checkFile,
    [
      "import { createRequire } from 'node:module';",
      "const require = createRequire(import.meta.url);",
      "const entries = [",
      "  '@drewv-js/web-components',",
      "  '@drewv-js/web-components/auto-register',",
      "  '@drewv-js/web-components/react',",
      "  '@drewv-js/web-components/styles.css',",
      "  '@drewv-js/web-components/tailwind-preset'",
      "];",
      "for (const entry of entries) {",
      "  const resolved = require.resolve(entry);",
      "  console.log('resolved', entry, resolved);",
      "}",
      "await import('@drewv-js/web-components/react');",
      "console.log('compatibility import smoke test passed');"
    ].join('\n')
  );

  run('node check.mjs', tempDir);
  console.log('Compatibility smoke test passed.');
} finally {
  if (packedFile) {
    const packedFilePath = resolve(rootDir, packedFile);
    try {
      unlinkSync(packedFilePath);
    } catch {
      // Ignore cleanup failures.
    }
  }

  rmSync(tempDir, { recursive: true, force: true });
}
