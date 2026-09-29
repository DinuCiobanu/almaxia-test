import type { Membership, Role } from "../memberships/membership";
import type { MembershipRepository } from "../memberships/membership-repository";

export type CreateMembershipInput = {
  user_id: number;
  organization_id: number;
  role: Role;
};

export class AddOrganizationMemberUC {
  constructor(private readonly repo: MembershipRepository) {}

  execute(input: CreateMembershipInput): Promise<Membership> {
    return this.repo.create(input);
  }
}
