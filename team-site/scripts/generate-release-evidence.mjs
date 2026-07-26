import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const distDirectory = path.resolve(process.cwd(), 'dist');
const healthDirectory = path.join(distDirectory, 'health');
const statusDirectory = path.join(distDirectory, 'status');
const runtimeConfigPath = path.join(distDirectory, 'runtime-config.json');

const commit = process.env.GITHUB_SHA || process.env.COMMIT_SHA || 'local-build';
const releaseId = process.env.GITHUB_RUN_ID || process.env.RELEASE_ID || 'local-build';
const deployedAt = process.env.DEPLOYED_AT || new Date().toISOString();

const publicUrl = [
  process.env.PUBLIC_URL,
  process.env.VITE_PUBLIC_URL,
  process.env.DOMAIN_PUBLIC_URL,
  process.env.IP_PUBLIC_URL,
].find((value) => value?.trim());

const runtimeConfig = {
  task: 'T05',
  publicUrlConfigured: Boolean(publicUrl),
  configSource: publicUrl ? 'environment' : 'not-configured',
  secretsRedacted: true,
  secretReferences: [
    'DEPLOYER_DISPATCH_TOKEN',
    'DNS_PORTAL_USERNAME',
    'DNS_PORTAL_PASSWORD',
    'DNS_TXT_VALUE',
  ],
};

const weatherStatus = {
  task: 'T07',
  provider: 'openweather',
  city: process.env.OPENWEATHER_CITY || 'Colombo',
  endpoint: '/api/weather',
  keyExposed: false,
};

const status = {
  ok: true,
  tasks: ['T01', 'T07'],
  tasks: ['T01', 'T05'],
  team: 'falcon-code',
  teamName: 'Falcon Code',
  repo:
    process.env.GITHUB_REPOSITORY ||
    'knurdz/deploy-sprint-finale-team-falcon-code',
  commit,
  releaseId,
  sourceRunId: releaseId,
  deployedAt,
  publicUrl,
  weather: weatherStatus,
  publicUrl: publicUrl || 'not-configured',
  runtimeConfig,
};

await Promise.all([
  mkdir(healthDirectory, { recursive: true }),
  mkdir(statusDirectory, { recursive: true }),
]);

await Promise.all([
  writeFile(path.join(healthDirectory, 'index.html'), 'ok\n', 'utf8'),
  writeFile(
    path.join(statusDirectory, 'index.html'),
    `${JSON.stringify(status, null, 2)}\n`,
    'utf8',
  ),
  writeFile(
    runtimeConfigPath,
    `${JSON.stringify(runtimeConfig, null, 2)}\n`,
    'utf8',
  ),
]);

console.log(`Generated release evidence for ${commit}.`);
console.log(
  `Generated T01/T05 release evidence for ${commit}; public URL configured: ${runtimeConfig.publicUrlConfigured}.`,
);
