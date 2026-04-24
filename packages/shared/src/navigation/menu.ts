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
    key: "transactions",
    labelKey: "menu.transactions",
    icon: "receipt",
    web: { path: WEB_ROUTES.transactions },
    mobile: { tab: true },
    requiredPermission: PERMISSIONS.TRANSACTION_READ,
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
