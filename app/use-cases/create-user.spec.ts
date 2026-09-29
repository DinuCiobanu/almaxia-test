import { expect } from "chai";
import { prisma } from "../prisma";
import { prismaUserRepository } from "../users/prisma-user-repository";
import { EmailAlreadyExistsError } from "../users/errors";
import { CreateUserUC } from "./create-user";

describe("CreateUserUC", () => {
  const createUser = new CreateUserUC(prismaUserRepository);
  const email = "create-user-spec@test.com";

  afterEach(async () => {
    await prisma.user.deleteMany({ where: { email } });
  });

  after(async () => {
    await prisma.$disconnect();
  });

  it("creates a user", async () => {
    const user = await createUser.execute({ email, name: "Spec User" });
    expect(user.email).to.equal(email);
    expect(user.name).to.equal("Spec User");
    expect(user.user_id).to.be.a("string").that.is.not.empty;
  });

  it("throws EmailAlreadyExistsError on duplicate email", async () => {
    await createUser.execute({ email, name: "First" });
    try {
      await createUser.execute({ email, name: "Second" });
      expect.fail("expected EmailAlreadyExistsError");
    } catch (error) {
      expect(error).to.be.instanceOf(EmailAlreadyExistsError);
    }
  });
});
