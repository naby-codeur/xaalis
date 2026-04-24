export const API_ROUTES = {
  auth: {
    login: "/v1/auth/login",
    register: "/v1/auth/register",
    logout: "/v1/auth/logout",
    refresh: "/v1/auth/refresh",
    me: "/v1/auth/me",
  },
  metrics: {
    overview: "/v1/metrics/overview",
    cashflow: "/v1/metrics/cashflow",
    projects: "/v1/metrics/projects",
    team: "/v1/metrics/team",
  },
  transactions: {
    list: "/v1/transactions",
    create: "/v1/transactions",
    byId: (id: string) => `/v1/transactions/${id}`,
  },
  projects: {
    list: "/v1/projects",
    create: "/v1/projects",
    byId: (id: string) => `/v1/projects/${id}`,
  },
} as const;

export const WEB_ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  transactions: "/transactions",
  projects: "/projects",
  reports: "/reports",
  team: "/team",
  settings: "/settings",
} as const;
