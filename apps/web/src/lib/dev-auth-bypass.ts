/**
 * Contournement auth **uniquement** en développement (jamais en production),
 * aligné sur `DEV_AUTH_BYPASS` / `NEXT_PUBLIC_DEV_AUTH_BYPASS` et l’API `dev-login`.
 */
export function isWebDevAuthBypassEnabled(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  const raw =
    process.env.DEV_AUTH_BYPASS ?? process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS;
  return raw === "1" || raw?.toLowerCase() === "true";
}
