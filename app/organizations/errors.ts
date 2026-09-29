export class OrganizationNotFoundError extends Error {
  constructor(org_id: number) {
    super(`organization ${org_id} not found`);
  }
}
