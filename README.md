# Pool & Spa Command Center

A modern homeowner dashboard for tracking saltwater pool and hot tub water chemistry, maintenance, equipment, and notes.

Built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and AWS Amplify Gen 2.

## Quick start

```bash
pnpm install
pnpm dev:local
```

Open [http://localhost:3000](http://localhost:3000).

Pool profiles and maintenance tasks use **in-memory mock storage** by default — no AWS account required. Data resets when the dev server restarts.

Verify wiring:

```bash
curl http://localhost:3000/api/health
```

## Local storage strategy

Production data (pool profiles, maintenance tasks, and related records) lives in **DynamoDB** via Amplify Gen 2 (AppSync GraphQL). For local development, use two complementary modes:

| Goal | Mode | Command | Persistence |
|------|------|---------|-------------|
| Everyday UI work | **mock** | `pnpm dev:local` | In-memory seed data (ephemeral) |
| Real DynamoDB + auth | **amplify** | `pnpm sandbox` + `pnpm dev:auth` | Amplify sandbox DynamoDB tables |

**Recommended workflow:**

```text
Daily UI work          →  pnpm dev:local
Before merging schema  →  pnpm sandbox + pnpm dev:auth
Production deploy      →  Amplify Gen 2 pipeline
```

### Mock mode (default)

Use for dashboard, maintenance, settings, and other UI work when you do not need data to survive a restart.

```bash
pnpm dev:local
```

Skip Cognito sign-in during pure UI work:

```bash
pnpm dev:local:bypass
```

### Amplify sandbox (integration testing)

Use when verifying CRUD, owner auth, or schema changes against real DynamoDB.

Dashboard routes require a signed-in Cognito user unless you opt into mock auth bypass (see below).

**Prerequisites:** AWS credentials with permission to deploy an Amplify sandbox (e.g. `AmplifyBackendDeployFullAccess`).

1. **Terminal 1** — deploy Auth + Data and keep the sandbox running:

   ```bash
   pnpm sandbox
   ```

   This overwrites `amplify_outputs.json` with real Cognito User Pool and AppSync endpoints.

2. **Terminal 2** — start the app in amplify mode with auth enforced:

   ```bash
   pnpm dev:auth
   ```

3. Open [http://localhost:3000/signup](http://localhost:3000/signup), create an account, confirm the email code, then sign in at [http://localhost:3000/login](http://localhost:3000/login).

4. To reset a password, use [http://localhost:3000/forgot-password](http://localhost:3000/forgot-password): enter your email, submit the verification code from Cognito, then sign in with the new password.

5. Visit `/dashboard` — all sidebar routes (`/water-tests`, `/equipment`, etc.) require an active session.

Copy `.env.local.example` to `.env.local` if you prefer file-based config:

```
NEXT_PUBLIC_DATA_MODE=amplify
NEXT_PUBLIC_DEV_AUTH_BYPASS=false
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Until `pnpm sandbox` completes, protected routes redirect to `/login` with a setup banner explaining that the backend is not deployed yet.

## Data modes

| Mode | Command | Description |
|------|---------|-------------|
| **mock** (default) | `pnpm dev:local` | In-memory seed data — no AWS required |
| **mock + auth bypass** | `pnpm dev:local:bypass` | Same as mock, skips Cognito for UI work |
| **amplify** | `pnpm dev:auth` or `pnpm dev:amplify` | Real Amplify sandbox (Auth + AppSync → DynamoDB) |
| **localstack** | Not implemented | Falls back to mock; do not rely on this mode yet |

Set `NEXT_PUBLIC_DATA_MODE` in `.env.local` (see `.env.local.example`).

Check active provider and persistence at `/api/health` or on the Settings page.

### Mock UI without AWS

For fast UI work without signing in, use mock mode with auth bypass:

```bash
pnpm dev:local:bypass
```

## LocalStack (optional, not wired)

LocalStack emulates AWS services locally for future SDK work. It does **not** replace Amplify Gen 2 sandbox for Auth/AppSync, and `NEXT_PUBLIC_DATA_MODE=localstack` currently falls back to in-memory mock storage.

```bash
pnpm localstack:up
curl http://localhost:4566/_localstack/health
pnpm localstack:down
```

See `.env.localstack.example` for endpoint overrides.

## Amplify sandbox

Requires an AWS account:

```bash
pnpm sandbox
```

This deploys Auth + Data (DynamoDB/AppSync) and overwrites `amplify_outputs.json` with real Cognito/AppSync endpoints. Until sandbox runs, a placeholder `amplify_outputs.json` is committed so the app builds without AWS credentials.

Auth emails (signup verification, password reset) use branded HTML templates via a Cognito custom message trigger. By default Cognito’s built-in sender is used for dev/testing; when you have a verified SES domain, set `AUTH_EMAIL_FROM` and redeploy. See [docs/email-setup.md](docs/email-setup.md).

## Deploy to Amplify Hosting

Use Amplify Hosting for persistent, branch-based deployments with real Cognito auth and DynamoDB. Local sandbox (`pnpm sandbox`) remains for personal integration testing; hosted builds use [`amplify.yml`](amplify.yml) to deploy backends per branch.

### Branch strategy

| Git branch | Backend | Purpose |
|------------|---------|---------|
| `main` | Production (`pipeline-deploy`) | Live app |
| `staging` | Staging (`pipeline-deploy`) | Pre-production testing |
| `pr-*` | Ephemeral preview (`pipeline-deploy`) | Per-PR fullstack preview; torn down when PR closes |
| Other feature branches | Staging outputs (`generate outputs`) | Reuses staging backend; no new AWS resources |

The app reads `amplify_outputs.json` generated at build time — no Cognito pool IDs, AppSync URLs, or DynamoDB table names are hardcoded in source.

### Console setup (one-time)

1. Open [AWS Amplify Console](https://console.aws.amazon.com/amplify/) → **Host web app** → connect `jamesfneyer/pool-spa-monitor`.
2. Confirm the app platform is **WEB_COMPUTE** (required for Next.js SSR).
3. Connect branches: `main` (production), `staging` (staging/test).
4. Enable **Pull request previews** on `main` (Hosting → Previews) for ephemeral `pr-*` backends.
5. Set **branch-specific environment variables** (Hosting → Environment variables):

| Variable | `main` | `staging` | Notes |
|----------|--------|-----------|-------|
| `NEXT_PUBLIC_DATA_MODE` | `amplify` | `amplify` | **Required** — without this, the hosted app uses in-memory mock data |
| `NEXT_PUBLIC_DEV_AUTH_BYPASS` | `false` | `false` | |
| `NEXT_PUBLIC_APP_URL` | prod `*.amplifyapp.com` URL | staging URL | Set per branch after the first deploy |

Optional backend email vars (`AUTH_EMAIL_FROM`, `AUTH_EMAIL_FROM_NAME`, `AUTH_EMAIL_REPLY_TO`) can be added later via Hosting → Secrets. Not required for initial testing — see [docs/email-setup.md](docs/email-setup.md).

### Deploy order

1. Push `amplify.yml` and `.nvmrc` to `main` → first deploy creates the production backend.
2. Create a `staging` branch in Git → Amplify auto-deploys staging resources.
3. Open a pull request against `main` to test an ephemeral `pr-*` preview.

### Verify the hosted deployment

- `https://<your-url>/api/health` returns `"dataMode": "amplify"`.
- `/signup` → email verification → `/login` → `/dashboard`.
- Create a pool profile or water test — data persists across reloads (DynamoDB, not mock).

### Local vs hosted

| Environment | Backend | Command / trigger |
|-------------|---------|-------------------|
| Local dev | Personal sandbox | `pnpm sandbox` + `pnpm dev:auth` |
| Hosted `main` | Production | Git push to `main` |
| Hosted `staging` | Staging | Git push to `staging` |
| PR preview | Ephemeral | Open PR against `main` |

Never hand-edit `amplify_outputs.json` for hosted environments — CI generates it per branch during the backend build phase.

## Project structure

```
src/
  app/           # Next.js App Router pages
  components/    # UI and layout components
  lib/
    config/      # Environment + data mode configuration
    data/        # Data provider abstraction (mock / amplify / localstack)
    chemistry/   # Water chemistry helpers
    amplify/     # Amplify client + server configuration
amplify/         # Amplify Gen 2 backend
```
