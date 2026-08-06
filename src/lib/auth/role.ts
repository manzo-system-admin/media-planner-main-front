export type AdminRole = "admin" | "staff";

/**
 * Legacy accounts carry `admin: true` with no `role` claim — treated as
 * role "admin" for backward compatibility so existing sessions don't get
 * locked out by this claim change. New accounts should always be
 * provisioned with an explicit `role`.
 */
export function resolveRole(claims: Record<string, unknown>): AdminRole | null {
  if (claims.role === "staff") return "staff";
  if (claims.role === "admin" || claims.admin === true) return "admin";
  return null;
}
