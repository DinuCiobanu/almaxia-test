import { Prisma, type Subscription as SubscriptionRow } from "@prisma/client";
import { prisma } from "../prisma";
import { OrganizationAlreadyHasSubscriptionError, SubscriptionNotFoundError } from "./errors";
import { STATUSES, type Subscription } from "./subscription";
import type { SubscriptionRepository } from "./subscription-repository";

function toSubscription(row: SubscriptionRow): Subscription {
  return {
    subscription_id: row.subscription_id,
    organization_id: row.organization_id,
    plan: row.plan,
    status: row.status,
    started_at: row.started_at,
  };
}

export const prismaSubscriptionRepository: SubscriptionRepository = {
  create: async (input): Promise<Subscription> => {
    try {
      const row = await prisma.subscription.create({
        data: {
          organization_id: input.organization_id,
          plan: input.plan,
          status: input.status ?? STATUSES.ACTIVE,
          ...(input.started_at ? { started_at: input.started_at } : {}),
        },
      });
      return toSubscription(row);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new OrganizationAlreadyHasSubscriptionError(input.organization_id);
      }
      throw error;
    }
  },

  updateStatus: async (input): Promise<Subscription> => {
    try {
      const row = await prisma.subscription.update({
        where: { organization_id: input.organization_id },
        data: { status: input.status },
      });
      return toSubscription(row);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new SubscriptionNotFoundError(input.organization_id);
      }
      throw error;
    }
  },

  findByOrganizationId: async (organization_id): Promise<Subscription | null> => {
    const row = await prisma.subscription.findUnique({ where: { organization_id } });
    return row ? toSubscription(row) : null;
  },
};
