#!/usr/bin/env bash
set -euo pipefail


deploy_root="${1:?usage: deploy-health-gated-release.sh DEPLOY_ROOT CANDIDATE_SOURCE RELEASE_ID}"
candidate_source="${2:?candidate source directory is required}"
release_id="${3:-${GITHUB_SHA:-}}"
candidate_port="${CANDIDATE_PORT:-18080}"
health_path="${HEALTH_PATH:-/health/}"

if [[ -z "$release_id" || ! "$release_id" =~ ^[A-Za-z0-9._-]+$ ]]; then
  echo "T17 invalid release ID; expected letters, numbers, dots, underscores, or hyphens." >&2
  exit 2
fi

if [[ ! -d "$candidate_source" ]]; then
  echo "T17 candidate source does not exist: $candidate_source" >&2
  exit 2
fi

releases_dir="$deploy_root/releases"
release_dir="$releases_dir/$release_id"
current_link="$deploy_root/current"
next_link="$deploy_root/.current-next"
previous_release="none"
candidate_pid=""

if [[ -L "$current_link" ]]; then
  previous_release="$(readlink "$current_link")"
fi

cleanup() {
  if [[ -n "$candidate_pid" ]] && kill -0 "$candidate_pid" 2>/dev/null; then
    kill "$candidate_pid" 2>/dev/null || true
    wait "$candidate_pid" 2>/dev/null || true
  fi
  rm -f "$next_link"
}
trap cleanup EXIT

mkdir -p "$releases_dir"

if [[ -e "$release_dir" ]]; then
  echo "T17 release already exists: $release_dir" >&2
  exit 2
fi

mkdir "$release_dir"
cp -a "$candidate_source/." "$release_dir/"

echo "T17 candidate release: $release_dir"
echo "T17 known-good before health check: $previous_release"

python3 -m http.server "$candidate_port" \
  --bind 127.0.0.1 \
  --directory "$release_dir" \
  >"$deploy_root/candidate-http.log" 2>&1 &
candidate_pid="$!"

candidate_url="http://127.0.0.1:${candidate_port}${health_path}"
echo "T17 health check candidate before traffic switch: $candidate_url"

health_passed=false
for _attempt in {1..10}; do
  health_body="$(curl --fail --silent --show-error --max-time 2 "$candidate_url" 2>/dev/null || true)"
  if [[ "${health_body//$'\r'/}" == "ok" || "${health_body//$'\r'/}" == $'ok\n' ]]; then
    health_passed=true
    break
  fi
  sleep 0.2
done

if [[ "$health_passed" != "true" ]]; then
  echo "T17 candidate health check failed; traffic was not switched." >&2
  echo "T17 known-good remains: $previous_release" >&2
  exit 1
fi

echo "T17 candidate health check passed."
ln -s "$release_dir" "$next_link"
mv -Tf "$next_link" "$current_link"
echo "T17 traffic switched atomically to: $(readlink "$current_link")"
echo "T17 previous release retained at: $previous_release"
