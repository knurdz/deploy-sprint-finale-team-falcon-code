import { readFileSync } from 'node:fs';

const app = readFileSync('src/App.tsx', 'utf8');
const component = readFileSync(
  'src/components/ReleaseReadiness.tsx',
  'utf8',
);
const data = readFileSync('src/data/releaseReadiness.ts', 'utf8');
const organizerMarker = ['AI', 'REVIEW', 'MARKER:T11'].join('-');

if (!app.includes('<ReleaseReadiness')) {
  throw new Error('ReleaseReadiness component is not integrated into App.tsx');
}

if (!data.includes('Artifact traceability')) {
  throw new Error('Release readiness data is missing the expected item');
}

if (
  !data.includes("task: 'T13'") ||
  !data.includes("source: 'provided-feature-bundle'") ||
  !data.includes('markerRemoved: true')
) {
  throw new Error('T13 feature-bundle provenance metadata is incomplete');
}

if (
  component.includes(organizerMarker) ||
  data.includes(organizerMarker)
) {
  throw new Error('The organizer feature-bundle marker was not removed');
}

console.log('T13 release readiness validation passed');
