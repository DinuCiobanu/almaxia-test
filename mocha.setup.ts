process.loadEnvFile(".env.test");

const { prisma } = require("./app/prisma");

exports.mochaHooks = {
  async afterAll() {
    await prisma.$disconnect();
  },
};
