export type Plan = "FREE" | "PRO" | "ENTERPRISE";

export type SubscriptionStatus = "ACTIVE" | "SUSPENDED" | "CANCELLED";

export type Subscription = {
  subscription_id: string;
  organization_id: string;
  plan: Plan;
  status: SubscriptionStatus;
  started_at: Date;
};
