import { ApiClientError } from "./client";

export type RefreshFn = () => Promise<string | null>;

export function withAutoRefresh<T>(
  call: () => Promise<T>,
  refresh: RefreshFn,
): Promise<T> {
  return call().catch(async (error) => {
    if (error instanceof ApiClientError && error.status === 401) {
      const newToken = await refresh();
      if (newToken) {
        return call();
      }
    }
    throw error;
  });
}
