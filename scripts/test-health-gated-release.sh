#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
deploy_script="$repo_root/scripts/deploy-health-gated-release.sh"
test_root="$(mktemp -d)"
deploy_root="$test_root/deploy"
known_good_source="$test_root/known-good"
healthy_source="$test_root/healthy"
unhealthy_source="$test_root/unhealthy"
candidate_port="$((20000 + ($$ % 20000)))"

cleanup() {
  rm -rf "$test_root"
}
trap cleanup EXIT

mkdir -p \
  "$known_good_source/health" \
  "$healthy_source/health" \
  "$unhealthy_source"

printf 'ok\n' > "$known_good_source/health/index.html"
printf 'known-good\n' > "$known_good_source/version.txt"
printf 'ok\n' > "$healthy_source/health/index.html"
printf 'healthy-candidate\n' > "$healthy_source/version.txt"
printf 'broken-candidate\n' > "$unhealthy_source/version.txt"

echo "T17 rehearsal: install initial known-good release."
CANDIDATE_PORT="$candidate_port" \
  bash "$deploy_script" "$deploy_root" "$known_good_source" "known-good"

known_good_target="$(readlink "$deploy_root/current")"

echo "T17 rehearsal: health-check candidate before switching traffic."
CANDIDATE_PORT="$candidate_port" \
  bash "$deploy_script" "$deploy_root" "$healthy_source" "healthy-candidate"

healthy_target="$(readlink "$deploy_root/current")"
if [[ "$healthy_target" == "$known_good_target" ]]; then
  echo "T17 rehearsal failed: healthy candidate did not become current." >&2
  exit 1
fi

echo "T17 rehearsal: reject unhealthy candidate and preserve current release."
if CANDIDATE_PORT="$candidate_port" \
  bash "$deploy_script" "$deploy_root" "$unhealthy_source" "broken-candidate"; then
  echo "T17 rehearsal failed: unhealthy candidate was accepted." >&2
  exit 1
fi

after_failure_target="$(readlink "$deploy_root/current")"
if [[ "$after_failure_target" != "$healthy_target" ]]; then
  echo "T17 rehearsal failed: failed candidate replaced the known-good release." >&2
  exit 1
fi

if [[ -e "$deploy_root/releases/broken-candidate" ]]; then
  echo "T17 rehearsal failed: unhealthy candidate was published as a release." >&2
  exit 1
fi

if compgen -G "$deploy_root/releases/.candidate-broken-candidate-*" > /dev/null; then
  echo "T17 rehearsal failed: unhealthy candidate staging was not cleaned." >&2
  exit 1
fi

echo "T17 rehearsal: retry the same release ID after fixing its health route."
CANDIDATE_PORT="$candidate_port" \
  bash "$deploy_script" "$deploy_root" "$healthy_source" "broken-candidate"

retry_target="$(readlink "$deploy_root/current")"
if [[ "$retry_target" != "$deploy_root/releases/broken-candidate" ]]; then
  echo "T17 rehearsal failed: cleaned release ID could not be retried." >&2
  exit 1
fi

echo "T17 PASS: candidate health check occurred before traffic switch."
echo "T17 PASS: failed candidate left known-good release at $after_failure_target."
echo "T17 PASS: failed candidate staging was cleaned and its release ID was retryable."
