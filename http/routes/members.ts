import express from "express";
import { membershipRepository } from "../../app/memberships/prisma-membership-repository";
import { MembershipAlreadyExistsError } from "../../app/memberships/errors";
import { AddOrganizationMemberUC } from "../../app/use-cases/add-organization-member";
import { ListOrganizationMembersUC } from "../../app/use-cases/list-organization-members";
import { validateBody } from "../validate-body";
import { addMemberSchema } from "../schemas";

const router = express.Router();
const addOrganizationMember = new AddOrganizationMemberUC(membershipRepository);
const listOrganizationMembers = new ListOrganizationMembersUC(membershipRepository);

router.post("/organizations/:id/members", validateBody(addMemberSchema), async (req, res) => {
  try {
    const membership = await addOrganizationMember.execute({
      organization_id: req.params.id,
      user_id: req.body.user_id,
      role: req.body.role,
    });
    res.status(201).json(membership);
  } catch (error) {
    if (error instanceof MembershipAlreadyExistsError) {
      res.status(409).json({ error: error.message });
      return;
    }
    throw error;
  }
});

router.get("/organizations/:id/members", async (req, res) => {
  const members = await listOrganizationMembers.execute(req.params.id);
  res.json(members);
});

export default router;
