import express from "express";
import { organizationRepository } from "../../app/organizations/prisma-organization-repository";
import { OrganizationNotFoundError } from "../../app/organizations/errors";
import { CreateOrganizationUC } from "../../app/use-cases/create-organization";
import { GetOrganizationUC } from "../../app/use-cases/get-organization";
import { validateBody } from "../validate-body";
import { respond } from "../respond";
import { parseId } from "../parse-id";
import { createOrganizationRequest, organizationSchema } from "../../contracts/api";

const router = express.Router();
const createOrganization = new CreateOrganizationUC(organizationRepository);
const getOrganization = new GetOrganizationUC(organizationRepository);

router.post("/organizations", validateBody(createOrganizationRequest), async (req, res) => {
  const organization = await createOrganization.execute(req.body);
  respond(res, organizationSchema, organization, 201);
});

router.get("/organizations/:id", async (req, res) => {
  const id = parseId(req, res);
  if (id === undefined) return;
  try {
    const organization = await getOrganization.execute(id);
    respond(res, organizationSchema, organization);
  } catch (error) {
    if (error instanceof OrganizationNotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    throw error;
  }
});

export default router;
