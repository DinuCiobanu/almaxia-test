import type { ReactNode } from "react";
import type { FetchState } from "../hooks/useFetch";

type DataSectionProps<T> = {
  title: string;
  state: FetchState<T>;
  children: (data: T) => ReactNode;
};

export function DataSection<T>({ title, state, children }: DataSectionProps<T>) {
  return (
    <section>
      <h2>{title}</h2>
      {state.status === "loading" && <p>Loading…</p>}
      {state.status === "error" && <p role="alert">Error: {state.error.message}</p>}
      {state.status === "success" && children(state.data)}
    </section>
  );
}
