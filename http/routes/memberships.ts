import express from "express";
import { prismaMembershipRepository } from "../../app/memberships/prisma-membership-repository";
import { MembershipAlreadyExistsError } from "../../app/memberships/errors";
import { AddOrganizationMemberUC } from "../../app/use-cases/add-organization-member";
import { validateBody } from "../validate-body";
import { createMembershipSchema } from "../schemas";

const router = express.Router();
const addOrganizationMember = new AddOrganizationMemberUC(prismaMembershipRepository);

router.post("/memberships", validateBody(createMembershipSchema), async (req, res) => {
  try {
    const membership = await addOrganizationMember.execute(req.body);
    res.status(201).json(membership);
  } catch (error) {
    if (error instanceof MembershipAlreadyExistsError) {
      res.status(409).json({ error: error.message });
      return;
    }
    throw error;
  }
});

export default router;
