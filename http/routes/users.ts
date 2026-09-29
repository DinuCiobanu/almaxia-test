import express from "express";
import { userRepository } from "../../app/users/prisma-user-repository";
import { EmailAlreadyExistsError } from "../../app/users/errors";
import { CreateUserUC } from "../../app/use-cases/create-user";
import { validateBody } from "../validate-body";
import { createUserSchema } from "../schemas";

const router = express.Router();
const createUser = new CreateUserUC(userRepository);

router.post("/users", validateBody(createUserSchema), async (req, res) => {
  try {
    const user = await createUser.execute(req.body);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      res.status(409).json({ error: error.message });
      return;
    }
    throw error;
  }
});

export default router;
