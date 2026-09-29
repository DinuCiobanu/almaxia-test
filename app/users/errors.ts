export class EmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`user with email ${email} already exists`);
  }
}
