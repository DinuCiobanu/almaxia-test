import type { CreateMembershipInput } from "../use-cases/add-organization-member";
import type { Membership } from "./membership";

export type MembershipRepository = {
  create(input: CreateMembershipInput): Promise<Membership>;
};
