import { OrganizationNotFoundError } from "../organizations/errors";
import type { Organization } from "../organizations/organization";
import type { OrganizationRepository } from "../organizations/organization-repository";

export class GetOrganizationUC {
  constructor(private readonly repo: OrganizationRepository) {}

  async execute(org_id: string): Promise<Organization> {
    const organization = await this.repo.findById(org_id);
    if (!organization) throw new OrganizationNotFoundError(org_id);
    return organization;
  }
}
