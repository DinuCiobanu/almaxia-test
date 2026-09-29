import express from "express";
import { membershipRepository } from "../../app/memberships/prisma-membership-repository";
import { MembershipAlreadyExistsError } from "../../app/memberships/errors";
import { AddOrganizationMemberUC } from "../../app/use-cases/add-organization-member";
import { ListOrganizationMembersUC } from "../../app/use-cases/list-organization-members";
import { validateBody } from "../validate-body";
import { respond } from "../respond";
import { parseId } from "../parse-id";
import { addMemberRequest, membershipSchema, membershipListSchema } from "../../contracts/api";

const router = express.Router();
const addOrganizationMember = new AddOrganizationMemberUC(membershipRepository);
const listOrganizationMembers = new ListOrganizationMembersUC(membershipRepository);

router.post("/organizations/:id/members", validateBody(addMemberRequest), async (req, res) => {
  const organizationId = parseId(req, res);
  if (organizationId === undefined) return;
  try {
    const membership = await addOrganizationMember.execute({
      organization_id: organizationId,
      user_id: req.body.user_id,
      role: req.body.role,
    });
    respond(res, membershipSchema, membership, 201);
  } catch (error) {
    if (error instanceof MembershipAlreadyExistsError) {
      res.status(409).json({ error: error.message });
      return;
    }
    throw error;
  }
});

router.get("/organizations/:id/members", async (req, res) => {
  const organizationId = parseId(req, res);
  if (organizationId === undefined) return;
  const members = await listOrganizationMembers.execute(organizationId);
  respond(res, membershipListSchema, members);
});

export default router;
