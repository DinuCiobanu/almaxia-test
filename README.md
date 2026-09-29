# almaxia-test

Express + TypeScript backend with PostgreSQL/Prisma, organized as use cases
(`app/use-cases`) backed by repository interfaces (`app/<entity>`), with
Express routes (`http/routes`) as the only layer that touches HTTP.

## Prerequisites

- Node 22 (`node -v`)
- PostgreSQL running locally

## Setup

```bash
npm install
```

Create two local databases:

```bash
createdb almaxia        # dev
createdb almaxia_test   # test
```

Copy the env template and point it at your Postgres user/instance:

```bash
cp .env.example .env
```

```bash
cp .env.test.example .env.test
```

`.env` and `.env.test` are both gitignored.

Apply migrations and seed some dev data:

```bash
npm run prisma:migrate   # dev db
npm run prisma:seed      # one organization, owner, membership, PRO subscription
```

## Running

```bash
npm run dev     # starts the API on :3000 (PORT in .env)
```

## Testing

```bash
npm test
```

Runs against the `almaxia_test` database (via `.env.test`), not the dev
database. Specs live next to the use case they cover, as `*.spec.ts`.

## API

```
POST   /organizations
GET    /organizations/:id
POST   /organizations/:id/members
GET    /organizations/:id/members
POST   /organizations/:id/subscription
GET    /organizations/:id/subscription
PATCH  /organizations/:id/subscription/status
GET    /organizations/:id/entitlements[?capability=CAPABILITY]
POST   /users
GET    /health
```

`GET /organizations/:id/entitlements` returns `{ plan, capabilities }` for
the org's active subscription. With `?capability=X` it instead returns
`{ canUse: boolean }` for just that one capability.

## Frontend

`ui/` is a separate Vite + React + TypeScript app (its own `package.json`) —
an "Organization Overview" page against this API. See `ui/README.md`.
