<<<<<<< HEAD
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
| T03 |  |  |  |
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

## Public Notes

List anything judges should know without exposing credentials or private infrastructure details.
=======
# T03 Verification Note

Implemented in `.github/workflows/deploy.yml`:
- Deploy request workflow now downloads the exact CI artifact `site-dist-${{ github.sha }}` using `actions/download-artifact@v4` with the source CI run ID.
- Artifact identity is recorded to `release-candidate/artifact-manifest.json` before dispatch.
- Deploy workflow does not run `npm run build`.

Verification performed:
- Confirmed CI workflow uploads `site-dist-${{ github.sha }}` from `team-site/dist`.
- Confirmed deploy workflow consumes that artifact by name and source run ID, then uploads `deploy-evidence-${sha}` containing the manifest.



>>>>>>> f22144e ([T03] Build Once Deploy Same Artifact)
