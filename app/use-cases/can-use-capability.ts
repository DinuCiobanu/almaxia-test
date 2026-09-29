import type { Capability } from "../entitlements/entitlement";
import { PLAN_CAPABILITIES } from "../entitlements/plan-capabilities";
import type { SubscriptionRepository } from "../subscriptions/subscription-repository";

export type CanUseCapabilityInput = {
  organization_id: string;
  capability: Capability;
};

export class CanUseCapabilityUC {
  constructor(private readonly repo: SubscriptionRepository) {}

  async execute(input: CanUseCapabilityInput): Promise<boolean> {
    const subscription = await this.repo.findByOrganizationId(input.organization_id);
    if (!subscription || subscription.status !== "ACTIVE") return false;
    return PLAN_CAPABILITIES[subscription.plan].has(input.capability);
  }
}
