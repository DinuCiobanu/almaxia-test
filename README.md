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
npm run prisma:migrate        # dev db
npm run prisma:migrate:test   # test db (needed before `npm test`)
npm run prisma:seed           # one organization, owner, membership, PRO subscription
```

## Running

```bash
npm run dev     # starts the API on :3000 (PORT in .env)
```

To also run the frontend, in a second terminal:

```bash
cd ui
npm install
cp .env.example .env   # VITE_API_URL, defaults to http://localhost:3000
npm run dev             # starts the UI on :5173
```

Open `http://localhost:5173/?organizationId=<id>` — get an id from
`npm run prisma:seed` above, or the input field on the page. See
`ui/README.md` for more.

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

`ui/` is a separate Vite + React + TypeScript app (its own `package.json`),
not part of this package's build — see "Running" above to start it, or
`ui/README.md` for details.

## Scaling to 10,000 organizations across SaaS, private, and sovereign deployments

The organization-to-database connection would need to become dynamic —
resolved per request (subdomain, auth claim, or similar) — instead of the
single global `DATABASE_URL` this app uses today, so a tenant requiring
physical data residency can be pointed at its own isolated database or its
own full deployment of this same app. Because every use case depends on a
repository *interface*, not on Prisma or Postgres directly, that's a matter
of swapping which implementation a request resolves to, not rewriting
business logic. The shared SaaS tier can stay exactly as it is — one
Postgres instance, `organization_id` as the tenant key — since Postgres
comfortably handles 10k organizations' worth of rows; only the
private/sovereign tiers need isolation. What I'd try hard not to change:
the use-case layer, the plain domain types, and the API contract in
`contracts/api.ts` — a private or sovereign install should run identical
application code and API surface, just pointed at its own data. The one
piece likely to grow is entitlements: `PLAN_CAPABILITIES` is a static
in-code table today, right for three fixed plans, but large enterprise
contracts tend to need negotiated, per-organization overrides — that
would need a DB-backed lookup behind the same
`canUse(organizationId, capability)` interface, not a new one. The harder
new problem this introduces is anything that needs to see across tenants
at once (billing rollups, cross-org admin views) — once tenant data is
physically isolated, those stop being a single query.
