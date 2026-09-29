import type { Organization } from "../organizations/organization";
import type { OrganizationRepository } from "../organizations/organization-repository";

export type CreateOrganizationInput = {
  name: string;
  country: string;
};

export class CreateOrganizationUC {
  constructor(private readonly repo: OrganizationRepository) {}

  execute(input: CreateOrganizationInput): Promise<Organization> {
    return this.repo.create(input);
  }
}
