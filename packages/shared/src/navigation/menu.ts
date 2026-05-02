import { PERMISSIONS, type Permission } from "../constants/permissions";
import { WEB_ROUTES } from "../constants/routes";

export interface MenuItem {
  key: string;
  labelKey: string;
  icon: string;
  web?: { path: string };
  mobile?: { tab: boolean; stack?: string };
  requiredPermission?: Permission;
}

export const MENU_ITEMS: readonly MenuItem[] = [
  {
    key: "dashboard",
    labelKey: "menu.dashboard",
    icon: "layout-dashboard",
    web: { path: WEB_ROUTES.dashboard },
    mobile: { tab: true },
  },
  {
    key: "members",
    labelKey: "menu.members",
    icon: "users",
    web: { path: WEB_ROUTES.members },
  },
  {
    key: "contributions",
    labelKey: "menu.contributions",
    icon: "hand-coins",
    web: { path: WEB_ROUTES.contributions },
  },
  {
    key: "income",
    labelKey: "menu.income",
    icon: "trending-up",
    web: { path: WEB_ROUTES.income },
  },
  {
    key: "expenses",
    labelKey: "menu.expenses",
    icon: "trending-down",
    web: { path: WEB_ROUTES.expenses },
  },
  {
    key: "projects",
    labelKey: "menu.projects",
    icon: "folder-kanban",
    web: { path: WEB_ROUTES.projects },
    mobile: { tab: true },
    requiredPermission: PERMISSIONS.PROJECT_READ,
  },
  {
    key: "reports",
    labelKey: "menu.reports",
    icon: "bar-chart-3",
    web: { path: WEB_ROUTES.reports },
    mobile: { tab: false, stack: "reports" },
    requiredPermission: PERMISSIONS.REPORTS_READ,
  },
  {
    key: "team",
    labelKey: "menu.team",
    icon: "users",
    web: { path: WEB_ROUTES.team },
    mobile: { tab: false, stack: "team" },
    requiredPermission: PERMISSIONS.USERS_READ,
  },
  {
    key: "settings",
    labelKey: "menu.settings",
    icon: "settings",
    web: { path: WEB_ROUTES.settings },
    mobile: { tab: false, stack: "settings" },
  },
] as const;
