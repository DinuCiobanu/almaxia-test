// prisma migrate dev reads DATABASE_URL from .env; this applies the same
// migrations to the test database instead, non-interactively.
process.loadEnvFile(".env.test");
const { execSync } = require("node:child_process");
execSync("npx prisma migrate deploy", { stdio: "inherit" });
