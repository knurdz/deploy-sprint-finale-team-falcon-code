# Deploy Sprint Finale Submission


Complete this file on `main` as tasks are completed. Do not paste secrets, private keys, token values, or screenshots that reveal credentials.

## Team

- Team name: Falcon Code
- Team members:
- Live IP URL: http://20.29.210.220
- Assigned domain URL: https://falcon-code.deploysprint-finals.knurdz.org
- Repository URL: https://github.com/knurdz/deploy-sprint-finale-team-falcon-code

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
| T02 | Add the merged PR URL | [Domain](https://falcon-code.deploysprint-finals.knurdz.org) / [manifest](https://falcon-code.deploysprint-finals.knurdz.org/domain-status.json) | A record targets `20.29.210.220`; TXT value stays outside the repository. Verify DNS, HTTPS, HTTP, and raw-IP HTTP after the DNS portal action. |
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

### T02 verification

- Assigned A record: `falcon-code` -> `20.29.210.220`
- TXT record name: `_deploy-sprint-challenge.falcon-code`
- TXT record value: configured only through the organizer DNS portal or GitHub secret
- Expected HTTPS evidence: `https://falcon-code.deploysprint-finals.knurdz.org`
- Expected plain HTTP evidence: `http://falcon-code.deploysprint-finals.knurdz.org`
- Expected raw-IP evidence: `http://20.29.210.220`
- Public manifest: `https://falcon-code.deploysprint-finals.knurdz.org/domain-status.json`
