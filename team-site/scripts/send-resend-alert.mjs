import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const apiKey = process.env.RESEND_API_KEY?.trim() || '';
const sendRequested = process.env.RESEND_SEND_EMAIL === 'true';
const approvedRecipient = 'delivered@resend.dev';
const commit = process.env.RESEND_COMMIT || process.env.GITHUB_SHA || 'local-build';
const evidencePath = path.resolve(
  process.env.RESEND_EVIDENCE_PATH || 'resend-email-evidence.json',
);


const emailStatus = {
  task: 'T16',
  provider: 'resend',
  configured: Boolean(apiKey),
  secretRedacted: true,
  recipientApproved: true,
  deliveryMode: sendRequested && apiKey ? 'test-send' : 'dry-run',
  commit,
};

if (emailStatus.deliveryMode === 'test-send') {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `falcon-code-deploy-${commit}`,
    },
    body: JSON.stringify({
      from: 'Falcon Code <onboarding@resend.dev>',
      to: [approvedRecipient],
      subject: `Falcon Code deployment ${commit.slice(0, 7)}`,
      text: `The Falcon Code deployment request was created for commit ${commit}.`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend request failed with HTTP ${response.status}.`);
  }
}

await mkdir(path.dirname(evidencePath), { recursive: true });
await writeFile(
  evidencePath,
  `${JSON.stringify(emailStatus, null, 2)}\n`,
  'utf8',
);

console.log(
  `Generated redacted T16 Resend evidence in ${emailStatus.deliveryMode} mode.`,
);
