import process from 'node:process';

// AI-REVIEW-MARKER: participant must manually remove this marker
// AI-AGENT-MARKER: participant must manually remove this marker
export function featureFlags(environment = process.env) {
  return {
    task: 'T15',
    showInsights:
      environment.FEATURE_SHOW_INSIGHTS?.trim().toLowerCase() === 'true',
    valueRedacted: true,
  };
}
