import { expect } from "chai";
import { organizationRepository } from "../organizations/prisma-organization-repository";
import { subscriptionRepository } from "../subscriptions/prisma-subscription-repository";
import { PLAN, STATUSES } from "../subscriptions/subscription";
import type { Plan, SubscriptionStatus } from "../subscriptions/subscription";
import { CAPABILITY } from "../entitlements/entitlement";
import { CanUseCapabilityUC } from "./can-use-capability";

describe("CanUseCapabilityUC", () => {
  const canUseCapability = new CanUseCapabilityUC(subscriptionRepository);
  let organizationId: string;

  async function givenOrganization(plan?: Plan, status?: SubscriptionStatus) {
    const org = await organizationRepository.create({ name: "Spec Org", country: "US" });
    organizationId = org.org_id;
    if (plan) await subscriptionRepository.create({ organization_id: org.org_id, plan, status });
  }

  afterEach(async () => {
    await subscriptionRepository.deleteByOrganizationId(organizationId);
    await organizationRepository.delete(organizationId);
  });

  it("denies every capability when the organization has no subscription", async () => {
    await givenOrganization();
    const canUse = await canUseCapability.execute({
      organization_id: organizationId,
      capability: CAPABILITY.BASIC_DASHBOARD,
    });
    expect(canUse).to.equal(false);
  });

  it("denies a capability not included in the FREE plan", async () => {
    await givenOrganization(PLAN.FREE);
    const canUse = await canUseCapability.execute({
      organization_id: organizationId,
      capability: CAPABILITY.EVIDENCE_CAPTURE,
    });
    expect(canUse).to.equal(false);
  });

  it("allows a capability included in the PRO plan", async () => {
    await givenOrganization(PLAN.PRO);
    const canUse = await canUseCapability.execute({
      organization_id: organizationId,
      capability: CAPABILITY.EVIDENCE_CAPTURE,
    });
    expect(canUse).to.equal(true);
  });

  it("denies every capability when the subscription is not ACTIVE", async () => {
    await givenOrganization(PLAN.ENTERPRISE, STATUSES.SUSPENDED);
    const canUse = await canUseCapability.execute({
      organization_id: organizationId,
      capability: CAPABILITY.API_ACCESS,
    });
    expect(canUse).to.equal(false);
  });
});
