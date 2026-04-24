import {
  API_ROUTES,
  type AuthenticatedUser,
  type LoginInput,
  type MetricsResponse,
<<<<<<< HEAD
  type Project,
  type RegisterInput,
  type Transaction,
=======
  type RegisterInput,
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
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
<<<<<<< HEAD
    transactions: {
      list: () => client.get<{ data: Transaction[] }>(API_ROUTES.transactions.list),
    },
    projects: {
      list: () => client.get<{ data: Project[] }>(API_ROUTES.projects.list),
    },
=======
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
  };
}

export type Endpoints = ReturnType<typeof createEndpoints>;
