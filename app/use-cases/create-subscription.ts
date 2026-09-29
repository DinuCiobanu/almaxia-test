import type { Plan, Subscription, SubscriptionStatus } from "../subscriptions/subscription";
import type { SubscriptionRepository } from "../subscriptions/subscription-repository";

export type CreateSubscriptionInput = {
  organization_id: string;
  plan: Plan;
  status?: SubscriptionStatus;
  started_at?: Date;
};

export class CreateSubscriptionUC {
  constructor(private readonly repo: SubscriptionRepository) {}

  execute(input: CreateSubscriptionInput): Promise<Subscription> {
    return this.repo.create(input);
  }
}
