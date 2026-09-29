export const ROLES = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_VALUES = Object.values(ROLES);

export type Membership = {
  membership_id: number;
  user_id: number;
  organization_id: number;
  role: Role;
  created_at: Date;
  updated_at: Date;
};
