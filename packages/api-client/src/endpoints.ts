import {
  API_ROUTES,
  type AuthenticatedUser,
  type LoginInput,
  type MetricsResponse,
  type RegisterInput,
} from "shared";

import { ApiClient } from "./client";

export interface AuthResponse {
  user: AuthenticatedUser;
  accessToken: string;
  refreshToken?: string;
}

export function createEndpoints(client: ApiClient) {
  return {
    auth: {
      login: (input: LoginInput) =>
        client.post<AuthResponse>(API_ROUTES.auth.login, input),
      register: (input: RegisterInput) =>
        client.post<AuthResponse>(API_ROUTES.auth.register, input),
      logout: () => client.post<{ ok: true }>(API_ROUTES.auth.logout),
      refresh: () => client.post<AuthResponse>(API_ROUTES.auth.refresh),
      me: () => client.get<AuthenticatedUser>(API_ROUTES.auth.me),
    },
    metrics: {
      overview: () => client.get<MetricsResponse>(API_ROUTES.metrics.overview),
      cashflow: () => client.get<MetricsResponse>(API_ROUTES.metrics.cashflow),
      projects: () => client.get<MetricsResponse>(API_ROUTES.metrics.projects),
      team: () => client.get<MetricsResponse>(API_ROUTES.metrics.team),
    },
  };
}

export type Endpoints = ReturnType<typeof createEndpoints>;
