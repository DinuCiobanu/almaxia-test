import { prisma } from "../prisma";
import type { Organization } from "./organization";
import type { OrganizationRepository } from "./organization-repository";

export const prismaOrganizationRepository: OrganizationRepository = {
  create: async (input): Promise<Organization> => {
    const row = await prisma.organization.create({ data: input });
    return {
      org_id: row.org_id,
      name: row.name,
      country: row.country,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  },
};
