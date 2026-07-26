# Deploy Sprint Finale Submission

Complete this file on `main` as tasks are completed. Do not paste secrets, private keys, token values, or screenshots that reveal credentials.

## Team

- Team name:Falcon_Code
- Team members:Vibodha Lakshan, Vishwa Shrinath, Imandi Perera, Ravindu Peiris
- Live IP URL:http://20.29.210.220
- Assigned domain URL:https://falcon-code.deploysprint-finals.knurdz.org
- Repository URL:https://github.com/knurdz/deploy-sprint-finale-team-falcon-code

## Release Evidence

- Current production commit:
- Current artifact/image identifier:
- Current deployment workflow run:
- Current release manifest path or URL:
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
| T05 |  |  |  |
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

<!-- AI-REVIEW-MARKER: participant must manually remove this marker -->
