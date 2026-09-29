import express from "express";
import { z } from "zod";
import { subscriptionRepository } from "../../app/subscriptions/prisma-subscription-repository";
import { CanUseCapabilityUC } from "../../app/use-cases/can-use-capability";
import { GetOrganizationEntitlementsUC } from "../../app/use-cases/get-organization-entitlements";
import { capabilityQuerySchema } from "../schemas";
import { respond } from "../respond";
import { parseId } from "../parse-id";
import { entitlementsSchema, canUseResponseSchema } from "../../contracts/api";

const router = express.Router();
const canUseCapability = new CanUseCapabilityUC(subscriptionRepository);
const getOrganizationEntitlements = new GetOrganizationEntitlementsUC(subscriptionRepository);

// GET /organizations/:id/entitlements           -> full { plan, capabilities } for the org
// GET /organizations/:id/entitlements?capability=EVIDENCE_CAPTURE -> { canUse } for just that one
router.get("/organizations/:id/entitlements", async (req, res) => {
  const organizationId = parseId(req, res);
  if (organizationId === undefined) return;

  const parsed = capabilityQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: z.flattenError(parsed.error) });
    return;
  }

  if (parsed.data.capability) {
    const canUse = await canUseCapability.execute({
      organization_id: organizationId,
      capability: parsed.data.capability,
    });
    respond(res, canUseResponseSchema, { canUse });
    return;
  }

  const entitlements = await getOrganizationEntitlements.execute(organizationId);
  respond(res, entitlementsSchema, entitlements);
});

export default router;
