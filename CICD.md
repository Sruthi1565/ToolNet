# CI/CD Setup

This project uses GitHub Actions for CI/CD.

## Workflows

- `.github/workflows/ci.yml`
  - Runs on pushes and pull requests to `main` or `master`.
  - Builds the React frontend.
  - Installs backend dependencies.
  - Checks backend JavaScript syntax.

- `.github/workflows/deploy.yml`
  - Runs on pushes to `main` or `master`, and can also be run manually.
  - Repeats the frontend/backend verification.
  - Triggers deploy hooks for frontend and backend when secrets are configured.

## Required GitHub Secrets

Add these in GitHub:

`Settings > Secrets and variables > Actions > New repository secret`

```text
REACT_APP_API_URL
VERCEL_DEPLOY_HOOK_URL
RENDER_DEPLOY_HOOK_URL
```

`REACT_APP_API_URL` should be your deployed backend URL, for example:

```text
https://your-backend.onrender.com
```

## Platform Environment Variables

Configure backend environment variables in Render or your backend host:

```text
MONGO_URI
EMAIL_USER
EMAIL_PASS
PORT
CLIENT_URL
SERVER_URL
```

Configure frontend environment variables in Vercel or your frontend host:

```text
REACT_APP_API_URL
```

## Deployment Flow

```text
Push to main/master
  -> GitHub Actions builds frontend
  -> GitHub Actions checks backend syntax
  -> GitHub Actions calls deploy hooks
  -> Vercel/Render rebuild and deploy from the repo
```

If a deploy hook secret is missing, the deploy workflow skips that deployment and prints a notice.
