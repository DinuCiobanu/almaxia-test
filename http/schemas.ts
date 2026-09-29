import { z } from "zod";
import { CAPABILITIES } from "../app/entitlements/entitlement";

export const createOrganizationSchema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export const createMembershipSchema = z.object({
  user_id: z.string().min(1),
  organization_id: z.string().min(1),
  role: z.enum(["OWNER", "ADMIN", "MEMBER"]),
});

export const createSubscriptionSchema = z.object({
  organization_id: z.string().min(1),
  plan: z.enum(["FREE", "PRO", "ENTERPRISE"]),
  status: z.enum(["ACTIVE", "SUSPENDED", "CANCELLED"]).optional(),
  started_at: z.coerce.date().optional(),
});

export const updateSubscriptionStatusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED", "CANCELLED"]),
});

export const capabilityParamSchema = z.object({
  capability: z.enum(CAPABILITIES),
});
