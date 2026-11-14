const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const temporaryRoot = path.join(root, '.tmp');
fs.mkdirSync(temporaryRoot, { recursive: true });
const consumer = fs.mkdtempSync(path.join(temporaryRoot, 'packed-consumer-'));
assert.equal(path.dirname(consumer), temporaryRoot);
const npmCli = process.env.npm_execpath;
assert.ok(npmCli, 'Run this verification through npm run check');
const run = (file, args, cwd) => execFileSync(file, args, {
  cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'],
});
const npm = (args, cwd) => run(process.execPath, [npmCli, ...args], cwd);

try {
  const [packed] = JSON.parse(npm([
    'pack', '--json', '--ignore-scripts', '--pack-destination', consumer,
  ], root));
  assert.equal(packed.name, '@marcelsud/melodi');
  assert.ok(packed.files.some(({ path }) => path === 'dist/index.js'));
  assert.ok(packed.files.some(({ path }) => path === 'dist/types/index.d.ts'));
  assert.ok(packed.files.every(({ path }) =>
    path.startsWith('dist/') || ['package.json', 'README.md', 'LICENSE'].includes(path)));

  fs.writeFileSync(path.join(consumer, 'package.json'), JSON.stringify({
    name: 'melodi-packed-consumer', private: true, version: '1.0.0',
  }));
  npm(['install', path.join(consumer, packed.filename), '--ignore-scripts',
    '--no-audit', '--no-fund', '--package-lock=false'], consumer);

  fs.writeFileSync(path.join(consumer, 'consumer.cjs'), `
const assert = require('node:assert/strict');
const { Container, container, createContainer } = require('@marcelsud/melodi');
(async () => {
  assert.ok(container instanceof Container);
  const services = createContainer();
  const shared = {};
  services.set('shared', shared);
  assert.equal(services.get('shared'), shared);
  let calls = 0;
  services.set('factory', current => { assert.equal(current, services); return ++calls; });
  assert.equal(services.get('factory'), 1);
  assert.equal(services.get('factory'), 2);
  services.set('zero', 0);
  assert.equal(services.get('zero'), 0);
  services.set('async', async () => 'Hello');
  assert.equal(await services.get('async'), 'Hello');
  assert.throws(() => services.get('missing'), { message: 'Service missing not found' });
  services.set('null', null);
  assert.throws(() => services.get('null'), { message: 'Service null not found' });
})().catch(error => { console.error(error); process.exitCode = 1; });
`);
  run(process.execPath, ['consumer.cjs'], consumer);

  fs.writeFileSync(path.join(consumer, 'consumer.mjs'), `
import assert from 'node:assert/strict';
import { Container, container, createContainer } from '@marcelsud/melodi';
assert.ok(container instanceof Container);
assert.ok(createContainer() instanceof Container);
`);
  run(process.execPath, ['consumer.mjs'], consumer);

  fs.writeFileSync(path.join(consumer, 'consumer.ts'), `
import { Container, container, createContainer } from '@marcelsud/melodi';
const services: Container = createContainer();
services.set('value', 42);
const value: number = services.get<number>('value');
container.set('copy', value);
`);
  fs.writeFileSync(path.join(consumer, 'tsconfig.json'), JSON.stringify({
    compilerOptions: { strict: true, noEmit: true, target: 'es2017',
      module: 'commonjs', moduleResolution: 'node', types: [] },
    files: ['consumer.ts'],
  }));
  run(process.execPath, [path.join(root, 'node_modules/typescript/bin/tsc'),
    '--project', path.join(consumer, 'tsconfig.json')], consumer);
  console.log('Packed MeloDI: CommonJS, ESM, TypeScript and runtime contract passed.');
} finally {
  if (path.dirname(consumer) !== temporaryRoot) throw new Error('Unexpected temporary path');
  fs.rmSync(consumer, { recursive: true, force: true });
}
