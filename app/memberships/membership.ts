export type Role = "OWNER" | "ADMIN" | "MEMBER";

export type Membership = {
  membership_id: string;
  user_id: string;
  organization_id: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
};
