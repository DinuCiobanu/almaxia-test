import type { Membership } from "../memberships/membership";
import type { MembershipRepository } from "../memberships/membership-repository";

export class ListOrganizationMembersUC {
  constructor(private readonly repo: MembershipRepository) {}

  execute(organization_id: string): Promise<Membership[]> {
    return this.repo.findByOrganizationId(organization_id);
  }
}
