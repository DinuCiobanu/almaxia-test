import type { Subscription } from "../api/types";
import { useFetch } from "../hooks/useFetch";
import { DataSection } from "./DataSection";

export function SubscriptionSection({ organizationId }: { organizationId: string }) {
  const state = useFetch<Subscription | null>(`/organizations/${organizationId}/subscription`, {
    treatNotFoundAs: null,
  });

  return (
    <DataSection title="Subscription" state={state}>
      {(subscription) =>
        subscription ? (
          <dl>
            <dt>Plan</dt>
            <dd>{subscription.plan}</dd>
            <dt>Status</dt>
            <dd>{subscription.status}</dd>
          </dl>
        ) : (
          <p>No subscription.</p>
        )
      }
    </DataSection>
  );
}
