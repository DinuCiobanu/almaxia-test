export class OrganizationAlreadyHasSubscriptionError extends Error {
  constructor(organization_id: string) {
    super(`organization ${organization_id} already has a subscription`);
  }
}

export class SubscriptionNotFoundError extends Error {
  constructor(organization_id: string) {
    super(`organization ${organization_id} has no subscription`);
  }
}
