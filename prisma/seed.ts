import { prisma } from "../app/prisma";
import { organizationRepository } from "../app/organizations/prisma-organization-repository";
import { userRepository } from "../app/users/prisma-user-repository";
import { membershipRepository } from "../app/memberships/prisma-membership-repository";
import { subscriptionRepository } from "../app/subscriptions/prisma-subscription-repository";
import { ROLES } from "../app/memberships/membership";
import { PLAN } from "../app/subscriptions/subscription";

async function main() {
  const organization = await organizationRepository.create({ name: "Acme Inc", country: "US" });
  const user = await userRepository.create({ email: "owner@acme.test", name: "Acme Owner" });
  await membershipRepository.create({
    organization_id: organization.org_id,
    user_id: user.user_id,
    role: ROLES.OWNER,
  });
  await subscriptionRepository.create({ organization_id: organization.org_id, plan: PLAN.PRO });

  console.log(`seeded organization ${organization.org_id} with owner ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
