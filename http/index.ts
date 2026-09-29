import express from "express";
import { prisma } from "../app/prisma";
import organizationsRouter from "./routes/organizations";
import usersRouter from "./routes/users";
import membershipsRouter from "./routes/memberships";
import subscriptionsRouter from "./routes/subscriptions";
import capabilitiesRouter from "./routes/capabilities";

const app = express();
app.use(express.json());

app.get("/health", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ ok: true });
});

app.use(organizationsRouter);
app.use(usersRouter);
app.use(membershipsRouter);
app.use(subscriptionsRouter);
app.use(capabilitiesRouter);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`listening on :${port}`));
