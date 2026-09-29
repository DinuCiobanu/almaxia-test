import express from "express";
import { subscriptionRepository } from "../../app/subscriptions/prisma-subscription-repository";
import {
  OrganizationAlreadyHasSubscriptionError,
  SubscriptionNotFoundError,
} from "../../app/subscriptions/errors";
import { CreateSubscriptionUC } from "../../app/use-cases/create-subscription";
import { UpdateSubscriptionStatusUC } from "../../app/use-cases/update-subscription-status";
import { GetOrganizationSubscriptionUC } from "../../app/use-cases/get-organization-subscription";
import { validateBody } from "../validate-body";
import { respond } from "../respond";
import { parseId } from "../parse-id";
import {
  createSubscriptionRequest,
  updateSubscriptionStatusRequest,
  subscriptionSchema,
} from "../../contracts/api";

const router = express.Router();
const createSubscription = new CreateSubscriptionUC(subscriptionRepository);
const updateSubscriptionStatus = new UpdateSubscriptionStatusUC(subscriptionRepository);
const getOrganizationSubscription = new GetOrganizationSubscriptionUC(subscriptionRepository);

router.post(
  "/organizations/:id/subscription",
  validateBody(createSubscriptionRequest),
  async (req, res) => {
    const organizationId = parseId(req, res);
    if (organizationId === undefined) return;
    try {
      const subscription = await createSubscription.execute({
        organization_id: organizationId,
        ...req.body,
      });
      respond(res, subscriptionSchema, subscription, 201);
    } catch (error) {
      if (error instanceof OrganizationAlreadyHasSubscriptionError) {
        res.status(409).json({ error: error.message });
        return;
      }
      throw error;
    }
  },
);

router.get("/organizations/:id/subscription", async (req, res) => {
  const organizationId = parseId(req, res);
  if (organizationId === undefined) return;
  try {
    const subscription = await getOrganizationSubscription.execute(organizationId);
    respond(res, subscriptionSchema, subscription);
  } catch (error) {
    if (error instanceof SubscriptionNotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    throw error;
  }
});

router.patch(
  "/organizations/:id/subscription/status",
  validateBody(updateSubscriptionStatusRequest),
  async (req, res) => {
    const organizationId = parseId(req, res);
    if (organizationId === undefined) return;
    try {
      const subscription = await updateSubscriptionStatus.execute({
        organization_id: organizationId,
        status: req.body.status,
      });
      respond(res, subscriptionSchema, subscription);
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
