import process from 'node:process';


export function featureFlagStatus(environment = process.env) {
  const enabled =
    environment.FEATURE_SHOW_INSIGHTS?.trim().toLowerCase() === 'true';

  return {
    task: 'T15',
    flagName: 'FEATURE_SHOW_INSIGHTS',
    enabled,
    showInsights: enabled,
    redacted: true,
    valueRedacted: true,
  };
}
