import { ApiClient, createEndpoints } from "api-client";

import { getAccessToken } from "./secure-store";

const baseUrl =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";

export const apiClient = new ApiClient({
  baseUrl,
  credentials: "omit",
  getAccessToken,
});

export const api = createEndpoints(apiClient);
