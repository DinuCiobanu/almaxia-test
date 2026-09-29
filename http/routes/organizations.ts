import express from "express";
import { organizationRepository } from "../../app/organizations/prisma-organization-repository";
import { OrganizationNotFoundError } from "../../app/organizations/errors";
import { CreateOrganizationUC } from "../../app/use-cases/create-organization";
import { GetOrganizationUC } from "../../app/use-cases/get-organization";
import { validateBody } from "../validate-body";
import { createOrganizationSchema } from "../schemas";

const router = express.Router();
const createOrganization = new CreateOrganizationUC(organizationRepository);
const getOrganization = new GetOrganizationUC(organizationRepository);

router.post("/organizations", validateBody(createOrganizationSchema), async (req, res) => {
  const organization = await createOrganization.execute(req.body);
  res.status(201).json(organization);
});

router.get("/organizations/:id", async (req, res) => {
  try {
    const organization = await getOrganization.execute(req.params.id);
    res.json(organization);
  } catch (error) {
    if (error instanceof OrganizationNotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    throw error;
  }
});

export default router;
