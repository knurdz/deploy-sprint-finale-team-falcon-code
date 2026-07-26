# Deploy Sprint Finale Submission


Complete this file on `main` as tasks are completed. Do not paste secrets, private keys, token values, or screenshots that reveal credentials.

## Team

- Team name: Falcon_Code
- Team members: Vibodha Lakshan, Imandi Perera, Vishwa Srinath, Ravindu Peiris
- Live IP URL: http://20.29.210.220
- Assigned domain URL: https://falcon-code.deploysprint-finals.knurdz.org
- Repository URL: https://github.com/knurdz/deploy-sprint-finale-team-falcon-code

## Release Evidence

- Current production commit: 75d2b50f337e870773d3213fec6e4e0558b71326
- Current artifact/image identifier: ghcr.io/falcon_code/deploy-sprint-finale-team-falcon-code:main
- Current deployment workflow run: https://github.com/knurdz/deploy-sprint-finale-team-falcon-code/actions/runs/8679850186
- Current release manifest path or URL: https://github.com/knurdz/deploy-sprint-finale-team-falcon-code/blob/main/.deploy/manifest/release.yaml
- Notes on live evidence or fallback evidence: 2578c4ac082748468f5d88a6d23100d1
- Team name:Falcon_Code
- Team members:Vibodha Lakshan, Vishwa Shrinath, Imandi Perera, Ravindu Peiris
- Live IP URL:http://20.29.210.220
- Assigned domain URL:https://falcon-code.deploysprint-finals.knurdz.org
- Repository URL:https://github.com/knurdz/deploy-sprint-finale-team-falcon-code

## Release Evidence

- Current production commit:
- Current artifact/image identifier:
- Current deployment workflow run:
- Current release manifest path or URL: https://falcon-code.deploysprint-finals.knurdz.org/domain-status.json
- Notes on live evidence or fallback evidence:

## Score Summary

- Automated points out of 800:
- Judge points out of 200:
- Final total points out of 1000:

## Completed Tasks

Use this section for short public notes and links. Full task instructions and checks are in the finalist dashboard.

| Task | PR | Evidence | Notes |
| --- | --- | --- | --- |
| T01 |  |  |  |
| T02 |  |  |  |
| T03 |  | .github/workflows/ci.yml + .github/workflows/deploy.yml | CI uploads `site-dist-${{ github.sha }}` via `actions/upload-artifact@v4`; deploy downloads it via `actions/download-artifact@v4` with the source run-id and records `release-candidate/artifact-manifest.json`. No `npm run build` in the deploy job. |
| T04 |  |  |  |
| T02 | [PR #2](https://github.com/knurdz/deploy-sprint-finale-team-falcon-code/pull/2) | [Domain](https://falcon-code.deploysprint-finals.knurdz.org) / [manifest](https://falcon-code.deploysprint-finals.knurdz.org/domain-status.json) | A record targets `20.29.210.220`; TXT verification was completed through the organizer DNS portal, and the value stays outside the repository. |
| T03 |  |  |  |
| T04 | <!-- Add PR link --> | <!-- Add diagnostic run link and successful rollback run link --> | Implemented manual rollback workflow (.github/workflows/rollback.yml) with release_ref input, verified commit SHA resolution, and organizer deployer API redispatch. |
| T05 |  | `/status` and `/runtime-config.json` | Runtime configuration is sourced from environment variables; the generated evidence exposes only configuration state and secret names, never secret values. |
| T06 |  |  |  |
| T07 |  |  |  |
| T08 |  |  |  |
| T09 |  |  |  |
| T10 |  |  |  |
| T11 |  |  |  |
| T12 |  |  |  |
| T13 |  |  |  |
| T14 |  |  |  |
| T15 |  |  |  |
| T16 |  |  |  |
| T17 |  |  |  |
| T18 |  |  |  |
| T19 |  |  |  |
| T20 |  |  |  |
| T21 |  |  |  |
| T22 |  |  |  |
| T23 |  |  |  |
| T24 |  |  |  |
| T25 |  |  |  |
| T26 |  |  |  |
| T27 |  |  |  |
| T28 |  |  |  |
| T29 |  |  |  |
| T30 |  |  |  |

## T03 Verification Note

Implemented "Build Once Deploy Same Artifact" in `.github/workflows/`:

**CI workflow (`ci.yml`):**
- Builds `team-site/dist` with `npm run build`
- Uploads the dist folder as artifact `site-dist-${{ github.sha }}` using `actions/upload-artifact@v4`

**Deploy workflow (`deploy.yml`):**
- Downloads the exact CI artifact using `actions/download-artifact@v4` with `name: site-dist-${{ github.sha }}` and `run-id` pointing to the CI run that produced it
- Records artifact identity to `release-candidate/artifact-manifest.json` (`{"task":"T03","artifact":"site-dist-<sha>","sha":"<sha>","source_run_id":"<id>"}`)
- Uploads `deploy-evidence-<sha>` artifact containing the manifest as evidence
- Does **not** run `npm run build` — the same dist artifact from CI is reused

Verified by inspecting both workflow files: only `ci.yml` runs the build, and `deploy.yml` consumes the artifact by name and source run ID.

## Public Notes

List anything judges should know without exposing credentials or private infrastructure details.


### T02 verification

- Assigned domain metadata: `ASSIGNED_DOMAIN=falcon-code.deploysprint-finals.knurdz.org`
- Assigned A record: `falcon-code` -> `20.29.210.220`
- TXT record name: `_deploy-sprint-challenge.falcon-code`
- TXT verification: the record was created and validated through the organizer DNS portal; its value is stored only in the `DNS_TXT_VALUE` GitHub secret
- Expected HTTPS evidence: `https://falcon-code.deploysprint-finals.knurdz.org`
- Expected plain HTTP evidence: `http://falcon-code.deploysprint-finals.knurdz.org`
- Expected raw-IP evidence: `http://20.29.210.220`
- Public manifest: `https://falcon-code.deploysprint-finals.knurdz.org/domain-status.json`

### T05 verification

- `PUBLIC_URL` is supplied to the build through GitHub repository variables.
- Deployment credentials remain referenced as GitHub Secrets and are not passed to the site build.
- `/status` includes redacted `runtimeConfig` evidence for T05.
- `/runtime-config.json` reports whether public configuration exists and confirms `secretsRedacted=true`.
- Local builds use the safe `not-configured` fallback instead of a committed infrastructure value.
