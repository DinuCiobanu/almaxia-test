import { OrganizationHeader } from "../components/OrganizationHeader";
import { SubscriptionSection } from "../components/SubscriptionSection";
import { MembersSection } from "../components/MembersSection";
import { CapabilitiesSection } from "../components/CapabilitiesSection";

export function OrganizationOverviewPage({ organizationId }: { organizationId: string }) {
  return (
    <div>
      <OrganizationHeader organizationId={organizationId} />
      <SubscriptionSection organizationId={organizationId} />
      <MembersSection organizationId={organizationId} />
      <CapabilitiesSection organizationId={organizationId} />
    </div>
  );
}
