import express from "express";
import { prisma } from "../app/prisma";
import { prismaOrganizationRepository } from "../app/organizations/prisma-organization-repository";
import { prismaUserRepository } from "../app/users/prisma-user-repository";
import { prismaMembershipRepository } from "../app/memberships/prisma-membership-repository";
import { prismaSubscriptionRepository } from "../app/subscriptions/prisma-subscription-repository";
import { EmailAlreadyExistsError } from "../app/users/errors";
import { MembershipAlreadyExistsError } from "../app/memberships/errors";
import { OrganizationAlreadyHasSubscriptionError, SubscriptionNotFoundError } from "../app/subscriptions/errors";
import { CreateOrganizationUC } from "../app/use-cases/create-organization";
import { CreateUserUC } from "../app/use-cases/create-user";
import { AddOrganizationMemberUC } from "../app/use-cases/add-organization-member";
import { CreateSubscriptionUC } from "../app/use-cases/create-subscription";
import { UpdateSubscriptionStatusUC } from "../app/use-cases/update-subscription-status";
import { validateBody } from "./validate-body";
import {
  createOrganizationSchema,
  createUserSchema,
  createMembershipSchema,
  createSubscriptionSchema,
  updateSubscriptionStatusSchema,
} from "./schemas";

const app = express();
app.use(express.json());

app.get("/health", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ ok: true });
});

const createOrganization = new CreateOrganizationUC(prismaOrganizationRepository);
const createUser = new CreateUserUC(prismaUserRepository);
const addOrganizationMember = new AddOrganizationMemberUC(prismaMembershipRepository);
const createSubscription = new CreateSubscriptionUC(prismaSubscriptionRepository);
const updateSubscriptionStatus = new UpdateSubscriptionStatusUC(prismaSubscriptionRepository);

app.post("/organizations", validateBody(createOrganizationSchema), async (req, res) => {
  const organization = await createOrganization.execute(req.body);
  res.status(201).json(organization);
});

app.post("/users", validateBody(createUserSchema), async (req, res) => {
  try {
    const user = await createUser.execute(req.body);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      res.status(409).json({ error: error.message });
      return;
    }
    throw error;
  }
});

app.post("/memberships", validateBody(createMembershipSchema), async (req, res) => {
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

app.post("/subscriptions", validateBody(createSubscriptionSchema), async (req, res) => {
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

app.patch(
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

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`listening on :${port}`));
