import type { CreateOrganizationInput } from "../use-cases/create-organization";
import type { Organization } from "./organization";

export type OrganizationRepository = {
  create(input: CreateOrganizationInput): Promise<Organization>;
};
