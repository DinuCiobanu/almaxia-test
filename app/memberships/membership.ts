export const ROLES = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_VALUES = Object.values(ROLES);

export type Membership = {
  membership_id: string;
  user_id: string;
  organization_id: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
};
