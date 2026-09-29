import { prisma } from "../prisma";
import type { User } from "./user";
import type { UserRepository } from "./user-repository";

export const prismaUserRepository: UserRepository = {
  create: async (input): Promise<User> => {
    const row = await prisma.user.create({ data: input });
    return {
      user_id: row.user_id,
      email: row.email,
      name: row.name,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  },
};
