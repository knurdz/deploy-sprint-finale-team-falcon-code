import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const workflowDirectory = path.resolve('.github/workflows');
const workflowFiles = readdirSync(workflowDirectory)
  .filter((file) => /\.ya?ml$/i.test(file))
  .map((file) => path.join(workflowDirectory, file));

const readWorkflow = (name) =>
  readFileSync(path.join(workflowDirectory, name), 'utf8');

const deploy = readWorkflow('deploy.yml');
const rollback = readWorkflow('rollback.yml');
const dashboard = readWorkflow('pages.yml');
const privilegedPrTrigger = ['pull', 'request', 'target'].join('_');

const requireMatch = (content, pattern, message) => {
  if (!pattern.test(content)) {
    throw new Error(message);
  }
};

const readTopLevelBlock = (content, key) => {
  const normalized = content.replaceAll('\r\n', '\n');
  const match = normalized.match(
    new RegExp(`^${key}:\\s*\\n((?:[ \\t]+.*\\n?)*)`, 'm'),
  );
  return match?.[1] || '';
};

for (const workflowFile of workflowFiles) {
  const content = readFileSync(workflowFile, 'utf8');
  if (content.includes(privilegedPrTrigger)) {
    throw new Error(
      `Unsafe privileged PR trigger found in ${path.basename(workflowFile)}`,
    );
  }
}

const deployPermissions = readTopLevelBlock(deploy, 'permissions');
if (!deployPermissions.includes('contents: read')) {
  throw new Error('deploy.yml must explicitly grant read-only contents permission');
}
if (!deployPermissions.includes('actions: read')) {
  throw new Error('deploy.yml must explicitly grant read-only actions permission');
}

const rollbackPermissions = readTopLevelBlock(rollback, 'permissions');
if (!rollbackPermissions.includes('contents: read')) {
  throw new Error('rollback.yml must explicitly grant read-only contents permission');
}

const dashboardPermissions = readTopLevelBlock(dashboard, 'permissions');
if (!dashboardPermissions.includes('contents: write')) {
  throw new Error('pages.yml must explicitly declare its contents permission');
}

requireMatch(
  deploy,
  /concurrency:\s*\n\s+group:\s*\$\{\{\s*github\.repository\s*\}\}-production-deploy\s*\n\s+cancel-in-progress:\s*false/m,
  'deploy.yml must queue production deployments',
);
requireMatch(
  rollback,
  /concurrency:\s*\n\s+group:\s*\$\{\{\s*github\.repository\s*\}\}-production-deploy\s*\n\s+cancel-in-progress:\s*false/m,
  'rollback.yml must share the queued production deployment lock',
);
requireMatch(
  dashboard,
  /concurrency:\s*\n\s+group:\s*\$\{\{\s*github\.repository\s*\}\}-dashboard-deploy\s*\n\s+cancel-in-progress:\s*false/m,
  'pages.yml must queue dashboard deployments',
);

console.log('T21 PASS: deployment workflows declare explicit permissions.');
console.log('T21 PASS: production deploy and rollback share a queued lock.');
console.log('T21 PASS: dashboard deploys use a queued concurrency group.');
console.log('T21 PASS: no privileged PR trigger is present.');
