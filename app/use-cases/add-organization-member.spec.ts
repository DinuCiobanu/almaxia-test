import { expect } from "chai";
import { organizationRepository } from "../organizations/prisma-organization-repository";
import { userRepository } from "../users/prisma-user-repository";
import { membershipRepository } from "../memberships/prisma-membership-repository";
import { MembershipAlreadyExistsError } from "../memberships/errors";
import { ROLES } from "../memberships/membership";
import { AddOrganizationMemberUC } from "./add-organization-member";

describe("AddOrganizationMemberUC", () => {
  const addOrganizationMember = new AddOrganizationMemberUC(membershipRepository);
  let organizationId: number;
  let userId: number;

  beforeEach(async () => {
    const org = await organizationRepository.create({ name: "Spec Org", country: "US" });
    organizationId = org.org_id;
    const user = await userRepository.create({
      email: "add-member-spec@test.com",
      name: "Spec User",
    });
    userId = user.user_id;
  });

  afterEach(async () => {
    await membershipRepository.deleteByOrganizationId(organizationId);
    await organizationRepository.delete(organizationId);
    await userRepository.delete(userId);
  });

  it("adds a user to an organization", async () => {
    const membership = await addOrganizationMember.execute({
      organization_id: organizationId,
      user_id: userId,
      role: ROLES.OWNER,
    });
    expect(membership.organization_id).to.equal(organizationId);
    expect(membership.user_id).to.equal(userId);
    expect(membership.role).to.equal(ROLES.OWNER);
  });

  it("throws MembershipAlreadyExistsError when the user is already a member", async () => {
    await addOrganizationMember.execute({
      organization_id: organizationId,
      user_id: userId,
      role: ROLES.MEMBER,
    });
    try {
      await addOrganizationMember.execute({
        organization_id: organizationId,
        user_id: userId,
        role: ROLES.ADMIN,
      });
      expect.fail("expected MembershipAlreadyExistsError");
    } catch (error) {
      expect(error).to.be.instanceOf(MembershipAlreadyExistsError);
    }
  });
});
