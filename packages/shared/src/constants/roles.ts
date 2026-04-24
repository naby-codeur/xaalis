export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  CASHIER: "CASHIER",
  VIEWER: "VIEWER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY: Role[] = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.MANAGER,
  ROLES.CASHIER,
  ROLES.VIEWER,
];

export function isAtLeast(role: Role, minimum: Role): boolean {
  return ROLE_HIERARCHY.indexOf(role) <= ROLE_HIERARCHY.indexOf(minimum);
}
