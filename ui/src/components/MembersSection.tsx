import type { Membership } from "../api/types";
import { useFetch } from "../hooks/useFetch";
import { DataSection } from "./DataSection";

export function MembersSection({ organizationId }: { organizationId: string }) {
  const state = useFetch<Membership[]>(`/organizations/${organizationId}/members`);

  return (
    <DataSection title="Members" state={state}>
      {(members) =>
        members.length === 0 ? (
          <p>No members.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.membership_id}>
                  <td>{member.user_id}</td>
                  <td>{member.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </DataSection>
  );
}
