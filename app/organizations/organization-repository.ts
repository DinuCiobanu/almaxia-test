import type { Organization } from "./organization";

export type CreateOrganizationInput = {
  name: string;
  country: string;
};

export type OrganizationRepository = {
  create(input: CreateOrganizationInput): Promise<Organization>;
};
