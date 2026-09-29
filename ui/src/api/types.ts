export type Organization = {
  org_id: string;
  name: string;
  country: string;
  created_at: string;
  updated_at: string;
};

export type Role = "OWNER" | "ADMIN" | "MEMBER";

export type Membership = {
  membership_id: string;
  user_id: string;
  organization_id: string;
  role: Role;
  created_at: string;
  updated_at: string;
};

export type Plan = "FREE" | "PRO" | "ENTERPRISE";
export type SubscriptionStatus = "ACTIVE" | "SUSPENDED" | "CANCELLED";

export type Subscription = {
  subscription_id: string;
  organization_id: string;
  plan: Plan;
  status: SubscriptionStatus;
  started_at: string;
};

export type Capability = "BASIC_DASHBOARD" | "RECOMMENDATIONS" | "EVIDENCE_CAPTURE" | "API_ACCESS";

export type Entitlements = {
  plan: Plan | null;
  capabilities: Capability[];
};
