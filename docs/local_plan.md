## Local Development & Testing with Docker + LocalStack

This app should support local AWS-style development using **Docker** and **LocalStack** where reasonable.

Add:

* `docker-compose.yml`
* LocalStack service
* Environment variables for local AWS endpoints
* Local DynamoDB/AppSync-compatible testing strategy where possible
* Scripts for starting/stopping local services
* Clear README instructions

Use LocalStack for services that can be tested locally, especially:

* DynamoDB
* S3
* Cognito where supported
* Lambda if added later
* EventBridge/SQS/SNS if reminders are added later

Important notes:

* AWS Amplify Gen 2 may still require real AWS cloud sandbox/deployment for some features, especially AppSync/Auth behavior.
* Do not pretend LocalStack fully replaces Amplify sandbox if it does not.
* Design the app so local testing can use mocked/dev adapters where Amplify services are not fully supported locally.
* Create a clean abstraction layer for data access so the app can later switch between:

  * Amplify cloud sandbox
  * LocalStack-backed local services
  * Mock in-memory development mode

Add these files:

* `docker-compose.yml`
* `.env.local.example`
* `.env.localstack.example`
* `README.md` local development section
* `src/lib/config/env.ts`
* `src/lib/aws/localstack.ts`
* `src/lib/data/` abstraction layer

Add package scripts:

```json
{
  "localstack:up": "docker compose up -d localstack",
  "localstack:down": "docker compose down",
  "localstack:logs": "docker compose logs -f localstack",
  "dev:local": "NEXT_PUBLIC_DATA_MODE=mock next dev",
  "dev:amplify": "next dev"
}
```

Create `docker-compose.yml` roughly like:

```yaml
services:
  localstack:
    image: localstack/localstack:latest
    container_name: pool-command-localstack
    ports:
      - "4566:4566"
    environment:
      - SERVICES=dynamodb,s3,cognito-idp,lambda,events,sqs,sns
      - DEBUG=1
      - AWS_DEFAULT_REGION=us-east-1
    volumes:
      - "./.localstack:/var/lib/localstack"
      - "/var/run/docker.sock:/var/run/docker.sock"
```

The first implementation should default to **mock local data mode** for fast UI development, while keeping the Amplify Gen 2 schema as the source of truth for the cloud backend.

## Current status

Implemented:

* `docker-compose.yml`, LocalStack scripts, `.env.local.example`, `.env.localstack.example`
* `src/lib/config/env.ts`, `src/lib/config/data-mode.ts`, `src/lib/aws/localstack.ts`
* `src/lib/data/` provider abstraction with **mock** and **amplify** backends
* `pnpm dev:local` (default mock), `pnpm dev:local:bypass`, `pnpm dev:auth`, `pnpm dev:amplify`
* `/api/health` and Settings page report active provider and persistence

Not implemented yet:

* `LocalStackDataProvider` — `NEXT_PUBLIC_DATA_MODE=localstack` falls back to in-memory mock with a warning
* Use **Amplify sandbox** (`pnpm sandbox` + `pnpm dev:auth`) for DynamoDB-backed local testing instead

See [README.md](../README.md) → **Local storage strategy** for the recommended workflow.
