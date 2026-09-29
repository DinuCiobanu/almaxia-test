import express from "express";
import { userRepository } from "../../app/users/prisma-user-repository";
import { EmailAlreadyExistsError } from "../../app/users/errors";
import { CreateUserUC } from "../../app/use-cases/create-user";
import { validateBody } from "../validate-body";
import { respond } from "../respond";
import { createUserRequest, userSchema } from "../../contracts/api";

const router = express.Router();
const createUser = new CreateUserUC(userRepository);

router.post("/users", validateBody(createUserRequest), async (req, res) => {
  try {
    const user = await createUser.execute(req.body);
    respond(res, userSchema, user, 201);
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      res.status(409).json({ error: error.message });
      return;
    }
    throw error;
  }
});

export default router;
