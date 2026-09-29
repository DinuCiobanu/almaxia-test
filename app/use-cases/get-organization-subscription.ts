import { SubscriptionNotFoundError } from "../subscriptions/errors";
import type { Subscription } from "../subscriptions/subscription";
import type { SubscriptionRepository } from "../subscriptions/subscription-repository";

export class GetOrganizationSubscriptionUC {
  constructor(private readonly repo: SubscriptionRepository) {}

  async execute(organization_id: number): Promise<Subscription> {
    const subscription = await this.repo.findByOrganizationId(organization_id);
    if (!subscription) throw new SubscriptionNotFoundError(organization_id);
    return subscription;
  }
}
