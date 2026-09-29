import express from "express";
import { prisma } from "../app/prisma";
import organizationsRouter from "./routes/organizations";
import usersRouter from "./routes/users";
import membersRouter from "./routes/members";
import subscriptionsRouter from "./routes/subscriptions";
import entitlementsRouter from "./routes/entitlements";

const app = express();
app.use(express.json());

app.get("/health", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ ok: true });
});

app.use(organizationsRouter);
app.use(usersRouter);
app.use(membersRouter);
app.use(subscriptionsRouter);
app.use(entitlementsRouter);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`listening on :${port}`));
