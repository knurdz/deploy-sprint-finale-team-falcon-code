import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const distDirectory = path.resolve(process.cwd(), 'dist');
const healthDirectory = path.join(distDirectory, 'health');
const statusDirectory = path.join(distDirectory, 'status');

const commit = process.env.GITHUB_SHA || process.env.COMMIT_SHA || 'local-build';
const releaseId = process.env.GITHUB_RUN_ID || process.env.RELEASE_ID || 'local-build';
const deployedAt = process.env.DEPLOYED_AT || new Date().toISOString();
const publicUrl =
  process.env.VITE_PUBLIC_URL ||
  process.env.IP_PUBLIC_URL ||
  process.env.PUBLIC_URL ||
  'http://20.29.210.220';

const status = {
  ok: true,
  tasks: ['T01'],
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
]);

console.log(`Generated T01 release evidence for ${commit}.`);
