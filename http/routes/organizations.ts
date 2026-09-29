import express from "express";
import { prismaOrganizationRepository } from "../../app/organizations/prisma-organization-repository";
import { CreateOrganizationUC } from "../../app/use-cases/create-organization";
import { validateBody } from "../validate-body";
import { createOrganizationSchema } from "../schemas";

const router = express.Router();
const createOrganization = new CreateOrganizationUC(prismaOrganizationRepository);

router.post("/organizations", validateBody(createOrganizationSchema), async (req, res) => {
  const organization = await createOrganization.execute(req.body);
  res.status(201).json(organization);
});

export default router;
