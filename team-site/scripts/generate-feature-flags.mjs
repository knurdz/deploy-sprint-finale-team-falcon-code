import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { featureFlagStatus } from './feature-flags.mjs';

const configDirectory = path.resolve(process.cwd(), 'dist', 'config');
const flags = featureFlagStatus();

await mkdir(configDirectory, { recursive: true });
await writeFile(
  path.join(configDirectory, 'feature-flags.json'),
  `${JSON.stringify(flags, null, 2)}\n`,
  'utf8',
);

console.log(
  `Generated redacted T15 feature flag evidence; enabled: ${flags.enabled}.`,
);
