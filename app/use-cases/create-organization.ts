import type { Organization } from "../organizations/organization";
import type {
  CreateOrganizationInput,
  OrganizationRepository,
} from "../organizations/organization-repository";

export class CreateOrganizationUC {
  constructor(private readonly repo: OrganizationRepository) {}

  execute(input: CreateOrganizationInput): Promise<Organization> {
    return this.repo.create(input);
  }
}
