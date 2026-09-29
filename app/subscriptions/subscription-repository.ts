import type { CreateSubscriptionInput } from "../use-cases/create-subscription";
import type { UpdateSubscriptionStatusInput } from "../use-cases/update-subscription-status";
import type { Subscription } from "./subscription";

export type SubscriptionRepository = {
  create(input: CreateSubscriptionInput): Promise<Subscription>;
  updateStatus(input: UpdateSubscriptionStatusInput): Promise<Subscription>;
  findByOrganizationId(organization_id: string): Promise<Subscription | null>;
  deleteByOrganizationId(organization_id: string): Promise<void>;
};
