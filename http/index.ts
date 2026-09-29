import express from "express";
import { prisma } from "../app/prisma";
import { prismaOrganizationRepository } from "../app/organizations/prisma-organization-repository";
import { prismaUserRepository } from "../app/users/prisma-user-repository";
import { prismaMembershipRepository } from "../app/memberships/prisma-membership-repository";
import { CreateOrganizationUC } from "../app/use-cases/create-organization";
import { CreateUserUC } from "../app/use-cases/create-user";
import { AddOrganizationMemberUC } from "../app/use-cases/add-organization-member";

const app = express();
app.use(express.json());

app.get("/health", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ ok: true });
});

const createOrganization = new CreateOrganizationUC(prismaOrganizationRepository);
const createUser = new CreateUserUC(prismaUserRepository);
const addOrganizationMember = new AddOrganizationMemberUC(prismaMembershipRepository);

app.post("/organizations", async (req, res) => {
  const organization = await createOrganization.execute(req.body);
  res.status(201).json(organization);
});

app.post("/users", async (req, res) => {
  const user = await createUser.execute(req.body);
  res.status(201).json(user);
});

app.post("/memberships", async (req, res) => {
  const membership = await addOrganizationMember.execute(req.body);
  res.status(201).json(membership);
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`listening on :${port}`));
