import type { User } from "../users/user";
import type { UserRepository } from "../users/user-repository";

export type CreateUserInput = {
  email: string;
  name: string;
};

export class CreateUserUC {
  constructor(private readonly repo: UserRepository) {}

  execute(input: CreateUserInput): Promise<User> {
    return this.repo.create(input);
  }
}
