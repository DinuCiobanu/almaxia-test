export class MembershipAlreadyExistsError extends Error {
  constructor(user_id: number, organization_id: number) {
    super(`user ${user_id} is already a member of organization ${organization_id}`);
  }
}
