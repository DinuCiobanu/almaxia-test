import type { Capability } from "../entitlements/entitlement";
import { PLAN_CAPABILITIES } from "../entitlements/plan-capabilities";
import { STATUSES, type Plan } from "../subscriptions/subscription";
import type { SubscriptionRepository } from "../subscriptions/subscription-repository";

export type OrganizationEntitlements = {
  plan: Plan | null;
  capabilities: Capability[];
};

export class GetOrganizationEntitlementsUC {
  constructor(private readonly repo: SubscriptionRepository) {}

  async execute(organization_id: number): Promise<OrganizationEntitlements> {
    const subscription = await this.repo.findByOrganizationId(organization_id);
    if (!subscription || subscription.status !== STATUSES.ACTIVE)
      return { plan: null, capabilities: [] };
    return { plan: subscription.plan, capabilities: [...PLAN_CAPABILITIES[subscription.plan]] };
  }
}
