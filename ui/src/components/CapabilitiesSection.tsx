import type { Entitlements } from "../api/types";
import { useFetch } from "../hooks/useFetch";
import { DataSection } from "./DataSection";

export function CapabilitiesSection({ organizationId }: { organizationId: string }) {
  const state = useFetch<Entitlements>(`/organizations/${organizationId}/entitlements`);

  return (
    <DataSection title="Capabilities" state={state}>
      {(entitlements) =>
        entitlements.capabilities.length === 0 ? (
          <p>No capabilities available.</p>
        ) : (
          <ul>
            {entitlements.capabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
        )
      }
    </DataSection>
  );
}
