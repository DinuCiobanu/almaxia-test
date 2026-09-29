import type { CreateUserInput } from "../use-cases/create-user";
import type { User } from "./user";

export type UserRepository = {
  create(input: CreateUserInput): Promise<User>;
};
