# Mobile App (`apps/mobile`)

Application Expo pour Xaalis.

Objectif actuel (etape 8): parcours `login -> dashboard` avec restauration de session et refresh token.

## Commandes

Depuis la racine du monorepo:

```bash
pnpm --filter mobile start
pnpm --filter mobile android
pnpm --filter mobile ios
pnpm --filter mobile lint
pnpm --filter mobile test
```

## Variables d'environnement

Configurer au minimum:

- `EXPO_PUBLIC_API_URL` : URL de l'API (`http://localhost:4000` en local).
- `EXPO_PUBLIC_DEV_AUTH_BYPASS` : `1`/`true` pour afficher le bouton de login dev.

Exemple:

```bash
EXPO_PUBLIC_API_URL=http://localhost:4000
EXPO_PUBLIC_DEV_AUTH_BYPASS=true
```

## Flux auth mobile

- Login/Register renvoient `accessToken` + `refreshToken`.
- Les tokens sont stockes via `expo-secure-store`.
- Au demarrage (`app/index.tsx`), l'app appelle `initializeAuthSession()`:
  - si `me` passe: redirection dashboard;
  - si `401`: tentative de refresh (`POST /v1/auth/refresh`) puis retry `me`;
  - en echec: purge session et redirection login.
- Sur 401 en cours de session, le client tente un refresh unique puis rejoue la requete.

## Tests unitaires

Tests actuels:

- `src/services/api.test.ts`
  - refresh avec/sans token,
  - persistence des tokens retournes,
  - coalescence des refresh concurrents,
  - nettoyage session si refresh invalide.
