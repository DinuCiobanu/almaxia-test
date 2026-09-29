import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { MembershipAlreadyExistsError } from "./errors";
import type { Membership } from "./membership";
import type { MembershipRepository } from "./membership-repository";

export const prismaMembershipRepository: MembershipRepository = {
  create: async (input): Promise<Membership> => {
    try {
      const row = await prisma.membership.create({ data: input });
      return {
        membership_id: row.membership_id,
        user_id: row.user_id,
        organization_id: row.organization_id,
        role: row.role,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new MembershipAlreadyExistsError(input.user_id, input.organization_id);
      }
      throw error;
    }
  },
};
