export class OrganizationNotFoundError extends Error {
  constructor(org_id: string) {
    super(`organization ${org_id} not found`);
  }
}
