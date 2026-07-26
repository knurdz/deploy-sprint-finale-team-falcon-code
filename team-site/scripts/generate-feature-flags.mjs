import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { featureFlags } from './feature-flags.mjs';

const distDirectory = path.resolve(process.cwd(), 'dist');
const flags = featureFlags();

await writeFile(
  path.join(distDirectory, 'feature-flags.json'),
  `${JSON.stringify(flags, null, 2)}\n`,
  'utf8',
);

console.log(
  `Generated redacted T15 feature flag evidence; insights enabled: ${flags.showInsights}.`,
);
