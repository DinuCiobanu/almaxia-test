import { z } from "zod";

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
