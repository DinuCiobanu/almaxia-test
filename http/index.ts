import express from "express";
import { prisma } from "../app/prisma";

const app = express();
app.use(express.json());

app.get("/health", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ ok: true });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`listening on :${port}`));
