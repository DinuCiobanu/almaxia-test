import { z } from "zod";
import { CAPABILITIES } from "../app/entitlements/entitlement";
import { ROLE_VALUES } from "../app/memberships/membership";
import { PLANS, SUBSCRIPTION_STATUSES } from "../app/subscriptions/subscription";

export const createOrganizationSchema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
});

export const createUserSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
});

export const addMemberSchema = z.object({
  user_id: z.string().min(1),
  role: z.enum(ROLE_VALUES),
});

export const createSubscriptionSchema = z.object({
  plan: z.enum(PLANS),
  status: z.enum(SUBSCRIPTION_STATUSES).optional(),
  started_at: z.coerce.date().optional(),
});

export const updateSubscriptionStatusSchema = z.object({
  status: z.enum(SUBSCRIPTION_STATUSES),
});

export const capabilityQuerySchema = z.object({
  capability: z.enum(CAPABILITIES).optional(),
});
