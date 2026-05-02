export const API_ROUTES = {
  auth: {
    login: "/v1/auth/login",
    register: "/v1/auth/register",
    logout: "/v1/auth/logout",
    refresh: "/v1/auth/refresh",
    me: "/v1/auth/me",
    organizationLogo: "/v1/auth/organization/logo",
  },
  metrics: {
    overview: "/v1/metrics/overview",
    cashflow: "/v1/metrics/cashflow",
    projects: "/v1/metrics/projects",
    team: "/v1/metrics/team",
  },
  projects: {
    list: "/v1/projects",
    create: "/v1/projects",
    byId: (id: string) => `/v1/projects/${id}`,
  },
  members: {
    list: "/v1/members",
    byId: (id: string) => `/v1/members/${id}`,
  },
  contributions: {
    list: "/v1/contributions",
    byId: (id: string) => `/v1/contributions/${id}`,
  },
  organizationUsers: "/v1/organization/users",
} as const;

export const WEB_ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  members: "/members",
  contributions: "/contributions",
  income: "/income",
  expenses: "/expenses",
  projects: "/projects",
  reports: "/reports",
  team: "/team",
  settings: "/settings",
} as const;
