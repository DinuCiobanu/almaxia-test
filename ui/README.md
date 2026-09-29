# ui

Organization Overview page (React + TypeScript, Vite). Reads from the API in
`../http` — see the root README for backend setup.

## Setup

```bash
npm install
cp .env.example .env   # VITE_API_URL, defaults to http://localhost:3000
```

## Running

```bash
npm run dev
```

Open `http://localhost:5173/?organizationId=<id>` — get an id from
`npm run prisma:seed` in the root project, or the input field on the page.
