import type { Subscription, SubscriptionStatus } from "../subscriptions/subscription";
import type { SubscriptionRepository } from "../subscriptions/subscription-repository";

export type UpdateSubscriptionStatusInput = {
  organization_id: string;
  status: SubscriptionStatus;
};

export class UpdateSubscriptionStatusUC {
  constructor(private readonly repo: SubscriptionRepository) {}

  execute(input: UpdateSubscriptionStatusInput): Promise<Subscription> {
    return this.repo.updateStatus(input);
  }
}
