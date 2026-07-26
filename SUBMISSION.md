# T03 Verification Note

Implemented in `.github/workflows/deploy.yml`:
- Deploy request workflow now downloads the exact CI artifact `site-dist-${{ github.sha }}` using `actions/download-artifact@v4` with the source CI run ID.
- Artifact identity is recorded to `release-candidate/artifact-manifest.json` before dispatch.
- Deploy workflow does not run `npm run build`.

Verification performed:
- Confirmed CI workflow uploads `site-dist-${{ github.sha }}` from `team-site/dist`.
- Confirmed deploy workflow consumes that artifact by name and source run ID, then uploads `deploy-evidence-${sha}` containing the manifest.



