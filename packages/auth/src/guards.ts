import {
  hasPermission,
  type Permission,
  type Role,
} from "shared";

export class AuthorizationError extends Error {
  readonly code = "FORBIDDEN";
  constructor(message = "Forbidden") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export function requirePermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new AuthorizationError(
      `Permission '${permission}' required for role '${role}'`,
    );
  }
}

export function requireSameOrganization(
  userOrgId: string,
  resourceOrgId: string,
): void {
  if (userOrgId !== resourceOrgId) {
    throw new AuthorizationError("Cross-tenant access denied");
  }
}
