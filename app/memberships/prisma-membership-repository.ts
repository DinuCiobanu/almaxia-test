import { prisma } from "../prisma";
import type { Membership } from "./membership";
import type { MembershipRepository } from "./membership-repository";

export const prismaMembershipRepository: MembershipRepository = {
  create: async (input): Promise<Membership> => {
    const row = await prisma.membership.create({ data: input });
    return {
      membership_id: row.membership_id,
      user_id: row.user_id,
      organization_id: row.organization_id,
      role: row.role,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  },
};
