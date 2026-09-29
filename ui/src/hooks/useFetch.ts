import { useEffect, useState } from "react";
import { apiGet, ApiError } from "../api/client";

export type FetchState<T> =
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "success"; data: T };

/**
 * Fetches `path` on mount and whenever it changes. Pass `treatNotFoundAs` to
 * resolve a 404 as data (e.g. "no subscription yet") instead of an error.
 */
export function useFetch<T>(path: string, options?: { treatNotFoundAs?: T }): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    apiGet<T>(path)
      .then((data) => {
        if (!cancelled) setState({ status: "success", data });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (options?.treatNotFoundAs !== undefined && error instanceof ApiError && error.status === 404) {
          setState({ status: "success", data: options.treatNotFoundAs });
          return;
        }
        setState({ status: "error", error: error instanceof Error ? error : new Error(String(error)) });
      });

    return () => {
      cancelled = true;
    };
    // `options` intentionally excluded: callers pass a fresh literal each
    // render, and it never varies independently of `path` in this app.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return state;
}
