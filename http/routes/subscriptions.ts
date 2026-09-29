import express from "express";
import { prismaSubscriptionRepository } from "../../app/subscriptions/prisma-subscription-repository";
import {
  OrganizationAlreadyHasSubscriptionError,
  SubscriptionNotFoundError,
} from "../../app/subscriptions/errors";
import { CreateSubscriptionUC } from "../../app/use-cases/create-subscription";
import { UpdateSubscriptionStatusUC } from "../../app/use-cases/update-subscription-status";
import { validateBody } from "../validate-body";
import { createSubscriptionSchema, updateSubscriptionStatusSchema } from "../schemas";

const router = express.Router();
const createSubscription = new CreateSubscriptionUC(prismaSubscriptionRepository);
const updateSubscriptionStatus = new UpdateSubscriptionStatusUC(prismaSubscriptionRepository);

router.post("/subscriptions", validateBody(createSubscriptionSchema), async (req, res) => {
  try {
    const subscription = await createSubscription.execute(req.body);
    res.status(201).json(subscription);
  } catch (error) {
    if (error instanceof OrganizationAlreadyHasSubscriptionError) {
      res.status(409).json({ error: error.message });
      return;
    }
    throw error;
  }
});

router.patch(
  "/subscriptions/:id/status",
  validateBody(updateSubscriptionStatusSchema),
  async (req, res) => {
    try {
      const subscription = await updateSubscriptionStatus.execute({
        subscription_id: req.params.id,
        status: req.body.status,
      });
      res.json(subscription);
    } catch (error) {
      if (error instanceof SubscriptionNotFoundError) {
        res.status(404).json({ error: error.message });
        return;
      }
      throw error;
    }
  },
);

export default router;
