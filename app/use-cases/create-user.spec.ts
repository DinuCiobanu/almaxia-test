import { expect } from "chai";
import { userRepository } from "../users/prisma-user-repository";
import { EmailAlreadyExistsError } from "../users/errors";
import { CreateUserUC } from "./create-user";

describe("CreateUserUC", () => {
  const createUser = new CreateUserUC(userRepository);
  const email = "create-user-spec@test.com";
  let userId: string;

  afterEach(async () => {
    await userRepository.delete(userId);
  });

  it("creates a user", async () => {
    const user = await createUser.execute({ email, name: "Spec User" });
    userId = user.user_id;
    expect(user.email).to.equal(email);
    expect(user.name).to.equal("Spec User");
    expect(user.user_id).to.be.a("string").that.is.not.empty;
  });

  it("throws EmailAlreadyExistsError on duplicate email", async () => {
    const user = await createUser.execute({ email, name: "First" });
    userId = user.user_id;
    try {
      await createUser.execute({ email, name: "Second" });
      expect.fail("expected EmailAlreadyExistsError");
    } catch (error) {
      expect(error).to.be.instanceOf(EmailAlreadyExistsError);
    }
  });
});
