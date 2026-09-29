/**
 * The contract between frontend and backend: request schemas (validated at
 * runtime AND checked at compile time via z.infer) and response schemas,
 * for every endpoint. Both sides import from here - neither hand-declares
 * its own copy. This file can and should exist before a single route
 * handler is implemented; it's what the two engineers agree on and build
 * against in parallel. It also doubles as the source for openapi.ts.
 *
 * Enum values themselves (ROLE_VALUES, PLANS, ...) are imported from the
 * backend's domain layer rather than redeclared here - that's the one
 * place they're allowed to be Prisma-schema-adjacent truth. Everything
 * else in this file only describes JSON-representable wire shapes.
 */
import { z } from "zod";
import { ROLE_VALUES } from "../app/memberships/membership";
import { PLANS, SUBSCRIPTION_STATUSES } from "../app/subscriptions/subscription";
import { CAPABILITIES } from "../app/entitlements/entitlement";

export { ROLE_VALUES, PLANS, SUBSCRIPTION_STATUSES, CAPABILITIES };

// ---------- Organization ----------

export const createOrganizationRequest = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
});
export type CreateOrganizationRequest = z.infer<typeof createOrganizationRequest>;

export const organizationSchema = z.object({
  org_id: z.string(),
  name: z.string(),
  country: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Organization = z.infer<typeof organizationSchema>;

// ---------- Membership ----------

export const roleSchema = z.enum(ROLE_VALUES);
export type Role = z.infer<typeof roleSchema>;

export const addMemberRequest = z.object({
  user_id: z.string().min(1),
  role: roleSchema,
});
export type AddMemberRequest = z.infer<typeof addMemberRequest>;

export const membershipSchema = z.object({
  membership_id: z.string(),
  user_id: z.string(),
  organization_id: z.string(),
  role: roleSchema,
  created_at: z.string(),
  updated_at: z.string(),
});
export type Membership = z.infer<typeof membershipSchema>;

export const membershipListSchema = z.array(membershipSchema);

// ---------- Subscription ----------

export const planSchema = z.enum(PLANS);
export type Plan = z.infer<typeof planSchema>;

export const subscriptionStatusSchema = z.enum(SUBSCRIPTION_STATUSES);
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

export const createSubscriptionRequest = z.object({
  plan: planSchema,
  status: subscriptionStatusSchema.optional(),
  // Wire type is a string (JSON has no Date) - Date coercion, if needed, is
  // a backend-internal concern, not part of the contract.
  started_at: z.iso.datetime().optional(),
});
export type CreateSubscriptionRequest = z.infer<typeof createSubscriptionRequest>;

export const updateSubscriptionStatusRequest = z.object({
  status: subscriptionStatusSchema,
});
export type UpdateSubscriptionStatusRequest = z.infer<typeof updateSubscriptionStatusRequest>;

export const subscriptionSchema = z.object({
  subscription_id: z.string(),
  organization_id: z.string(),
  plan: planSchema,
  status: subscriptionStatusSchema,
  started_at: z.string(),
});
export type Subscription = z.infer<typeof subscriptionSchema>;

// ---------- Entitlements ----------

export const capabilitySchema = z.enum(CAPABILITIES);
export type Capability = z.infer<typeof capabilitySchema>;

export const entitlementsSchema = z.object({
  plan: planSchema.nullable(),
  capabilities: z.array(capabilitySchema),
});
export type Entitlements = z.infer<typeof entitlementsSchema>;

export const canUseResponseSchema = z.object({
  canUse: z.boolean(),
});
export type CanUseResponse = z.infer<typeof canUseResponseSchema>;

// ---------- User ----------

export const createUserRequest = z.object({
  email: z.email(),
  name: z.string().min(1),
});
export type CreateUserRequest = z.infer<typeof createUserRequest>;

export const userSchema = z.object({
  user_id: z.string(),
  email: z.string(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type User = z.infer<typeof userSchema>;

// ---------- Route surface ----------
// One entry per endpoint: method, path (":id" params match Express's own
// syntax), request schema (if any), and response schema. This table is
// itself part of the contract - the frontend iterates it to build a typed
// API client, and openapi.ts walks it to generate the OpenAPI document.
//
// getEntitlements' ?capability= variant (-> CanUseResponse instead of
// Entitlements) isn't represented here - modeling a query-param-dependent
// response shape in this table (and in the OpenAPI doc) is real added
// complexity for one endpoint; canUseResponseSchema exists so the route
// handler can still validate against it, just not through this table.

export const API = {
  createOrganization: { method: "POST", path: "/organizations", request: createOrganizationRequest, response: organizationSchema },
  getOrganization: { method: "GET", path: "/organizations/:id", response: organizationSchema },
  addMember: { method: "POST", path: "/organizations/:id/members", request: addMemberRequest, response: membershipSchema },
  listMembers: { method: "GET", path: "/organizations/:id/members", response: membershipListSchema },
  createSubscription: { method: "POST", path: "/organizations/:id/subscription", request: createSubscriptionRequest, response: subscriptionSchema },
  getSubscription: { method: "GET", path: "/organizations/:id/subscription", response: subscriptionSchema },
  updateSubscriptionStatus: { method: "PATCH", path: "/organizations/:id/subscription/status", request: updateSubscriptionStatusRequest, response: subscriptionSchema },
  getEntitlements: { method: "GET", path: "/organizations/:id/entitlements", response: entitlementsSchema },
  createUser: { method: "POST", path: "/users", request: createUserRequest, response: userSchema },
} as const;
