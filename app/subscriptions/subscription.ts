export const PLAN = {
  FREE: "FREE",
  PRO: "PRO",
  ENTERPRISE: "ENTERPRISE",
} as const;

export type Plan = (typeof PLAN)[keyof typeof PLAN];

export const PLANS = Object.values(PLAN);

export const STATUSES = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  CANCELLED: "CANCELLED",
} as const;

export type SubscriptionStatus = (typeof STATUSES)[keyof typeof STATUSES];

export const SUBSCRIPTION_STATUSES = Object.values(STATUSES);

export type Subscription = {
  subscription_id: number;
  organization_id: number;
  plan: Plan;
  status: SubscriptionStatus;
  started_at: Date;
};
