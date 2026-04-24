import { ApiClient, createEndpoints } from "api-client";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const apiClient = new ApiClient({
  baseUrl,
  credentials: "include",
});

export const api = createEndpoints(apiClient);
