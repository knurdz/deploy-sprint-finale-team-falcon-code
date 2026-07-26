import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const distDirectory = path.resolve(process.cwd(), 'dist');
const accessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim() || '';
const contactConfig = {
  task: 'T10',
  provider: 'web3forms',
  endpoint: 'https://api.web3forms.com/submit',
  configured: Boolean(accessKey),
  accessKey,
};

await writeFile(
  path.join(distDirectory, 'contact-config.json'),
  `${JSON.stringify(contactConfig, null, 2)}\n`,
  'utf8',
);

console.log(
  `Generated Web3Forms runtime configuration; configured: ${contactConfig.configured}.`,
);
