import { useState } from "react";
import { OrganizationOverviewPage } from "./pages/OrganizationOverviewPage";

function getInitialOrganizationId(): string {
  return new URLSearchParams(window.location.search).get("organizationId") ?? "";
}

export default function App() {
  const [organizationId, setOrganizationId] = useState(getInitialOrganizationId);
  const [input, setInput] = useState(organizationId);

  return (
    <main>
      <h1>Organization Overview</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setOrganizationId(input.trim());
        }}
      >
        <label>
          Organization ID
          <input value={input} onChange={(event) => setInput(event.target.value)} />
        </label>
        <button type="submit">Load</button>
      </form>
      {organizationId && <OrganizationOverviewPage organizationId={organizationId} />}
    </main>
  );
}
