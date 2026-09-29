import type { Organization } from "../api/types";
import { useFetch } from "../hooks/useFetch";
import { DataSection } from "./DataSection";

export function OrganizationHeader({ organizationId }: { organizationId: string }) {
  const state = useFetch<Organization>(`/organizations/${organizationId}`);

  return (
    <DataSection title="Organization" state={state}>
      {(org) => (
        <dl>
          <dt>Name</dt>
          <dd>{org.name}</dd>
          <dt>Country</dt>
          <dd>{org.country}</dd>
        </dl>
      )}
    </DataSection>
  );
}
