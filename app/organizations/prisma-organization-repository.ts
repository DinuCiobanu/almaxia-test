import type { Organization as OrganizationRow } from "@prisma/client";
import { prisma } from "../prisma";
import type { Organization } from "./organization";
import type { OrganizationRepository } from "./organization-repository";

function toOrganization(row: OrganizationRow): Organization {
  return {
    org_id: row.org_id,
    name: row.name,
    country: row.country,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export const organizationRepository: OrganizationRepository = {
  create: async (input): Promise<Organization> => {
    const row = await prisma.organization.create({ data: input });
    return toOrganization(row);
  },

  findById: async (org_id): Promise<Organization | null> => {
    const row = await prisma.organization.findUnique({ where: { org_id } });
    return row ? toOrganization(row) : null;
  },

  delete: async (org_id): Promise<void> => {
    await prisma.organization.delete({ where: { org_id } });
  },
};
