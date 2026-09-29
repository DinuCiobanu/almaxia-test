import express from "express";
import { z } from "zod";
import { prismaSubscriptionRepository } from "../../app/subscriptions/prisma-subscription-repository";
import { CanUseCapabilityUC } from "../../app/use-cases/can-use-capability";
import { capabilityParamSchema } from "../schemas";

const router = express.Router();
const canUseCapability = new CanUseCapabilityUC(prismaSubscriptionRepository);

router.get("/organizations/:organizationId/capabilities/:capability", async (req, res) => {
  const parsed = capabilityParamSchema.safeParse({ capability: req.params.capability });
  if (!parsed.success) {
    res.status(400).json({ error: z.flattenError(parsed.error) });
    return;
  }
  const canUse = await canUseCapability.execute({
    organization_id: req.params.organizationId,
    capability: parsed.data.capability,
  });
  res.json({ canUse });
});

export default router;
