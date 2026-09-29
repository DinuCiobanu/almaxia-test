export const CAPABILITIES = [
  "BASIC_DASHBOARD",
  "RECOMMENDATIONS",
  "EVIDENCE_CAPTURE",
  "API_ACCESS",
] as const;

export type Capability = (typeof CAPABILITIES)[number];
