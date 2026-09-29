import type { CreateMembershipInput } from "../use-cases/add-organization-member";
import type { Membership } from "./membership";

export type MembershipRepository = {
  create(input: CreateMembershipInput): Promise<Membership>;
  findByOrganizationId(organization_id: number): Promise<Membership[]>;
  deleteByOrganizationId(organization_id: number): Promise<void>;
};
