import type { Plan } from "../subscriptions/subscription";
import type { Capability } from "./entitlement";

// ponytail: hardcoded per plan, move to a DB-backed table if capabilities
// need to change without a deploy (e.g. per-org overrides, admin UI)
export const PLAN_CAPABILITIES: Record<Plan, ReadonlySet<Capability>> = {
  FREE: new Set(["BASIC_DASHBOARD"]),
  PRO: new Set(["BASIC_DASHBOARD", "RECOMMENDATIONS", "EVIDENCE_CAPTURE"]),
  ENTERPRISE: new Set(["BASIC_DASHBOARD", "RECOMMENDATIONS", "EVIDENCE_CAPTURE", "API_ACCESS"]),
};
