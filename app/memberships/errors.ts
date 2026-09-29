export class MembershipAlreadyExistsError extends Error {
  constructor(user_id: string, organization_id: string) {
    super(`user ${user_id} is already a member of organization ${organization_id}`);
  }
}
