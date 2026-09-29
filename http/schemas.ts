import { z } from "zod";
import { CAPABILITIES } from "../contracts/api";

// Query-param validation, not a request body - not part of the contracts/
// API table (which only models request bodies), so it stays local here.
export const capabilityQuerySchema = z.object({
  capability: z.enum(CAPABILITIES).optional(),
});
