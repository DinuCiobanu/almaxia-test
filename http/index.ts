import express from "express";
import { prisma } from "../app/prisma";
import { prismaOrganizationRepository } from "../app/organizations/prisma-organization-repository";
import { CreateOrganizationUC } from "../app/use-cases/create-organization";

const app = express();
app.use(express.json());

app.get("/health", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ ok: true });
});

const createOrganization = new CreateOrganizationUC(prismaOrganizationRepository);

app.post("/organizations", async (req, res) => {
  const organization = await createOrganization.execute(req.body);
  res.status(201).json(organization);
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`listening on :${port}`));
