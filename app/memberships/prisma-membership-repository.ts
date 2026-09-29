import { Prisma, type Membership as MembershipRow } from "@prisma/client";
import { prisma } from "../prisma";
import { MembershipAlreadyExistsError } from "./errors";
import type { Membership } from "./membership";
import type { MembershipRepository } from "./membership-repository";

function toMembership(row: MembershipRow): Membership {
  return {
    membership_id: row.membership_id,
    user_id: row.user_id,
    organization_id: row.organization_id,
    role: row.role,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export const membershipRepository: MembershipRepository = {
  create: async (input): Promise<Membership> => {
    try {
      const row = await prisma.membership.create({ data: input });
      return toMembership(row);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new MembershipAlreadyExistsError(input.user_id, input.organization_id);
      }
      throw error;
    }
  },

  findByOrganizationId: async (organization_id): Promise<Membership[]> => {
    const rows = await prisma.membership.findMany({ where: { organization_id } });
    return rows.map(toMembership);
  },

  deleteByOrganizationId: async (organization_id): Promise<void> => {
    await prisma.membership.deleteMany({ where: { organization_id } });
  },
};
