# Xaalis

Plateforme SaaS de gestion financière pour ONG, associations, PME, coopératives et structures multi-projets.

Monorepo **Web + Mobile + API + packages partagés**.

## Structure

```text
apps/
  web/        Application Next.js (landing + back-office)
  api/        Backend Fastify (cœur métier)
  mobile/     Application Expo (login-first)

packages/
  db/         Prisma + MongoDB
  shared/     Types · Zod · constantes · navigation (web + mobile)
  auth/       JWT · guards (serveur uniquement)
  api-client/ Client HTTP typé (web + mobile)
  config/     Configuration d'environnement typée
  ui-tokens/  Design tokens
```

Voir :

- [`docs/cahier-charges.md`](./docs/cahier-charges.md) — spécifications
- [`docs/architecture.md`](./docs/architecture.md) — architecture technique

## Prérequis

- Node.js ≥ 20
- pnpm ≥ 9
- MongoDB (local ou distant)

## Démarrage

```bash
pnpm install
cp .env.example .env.local

pnpm dev                    # lance web + api en parallèle
pnpm --filter api dev
pnpm --filter web dev
pnpm --filter mobile start
```

## Onboarding rapide (< 1 jour)

```bash
# 1) Installer
pnpm install

# 2) Configurer les variables
cp .env.example .env.local

# 3) Lancer les services coeur
pnpm --filter api dev
pnpm --filter web dev

# 4) Mobile (optionnel)
pnpm --filter mobile start
```

## Scripts racine

| Script | Effet |
| --- | --- |
| `pnpm dev` | Démarre toutes les apps en mode watch |
| `pnpm build` | Build de toutes les apps/packages |
| `pnpm lint` | Lint du monorepo |
| `pnpm typecheck` | Vérification TypeScript |
| `pnpm test` | Exécution des tests disponibles |

## Qualité / CI

Le pipeline CI GitHub est défini dans `.github/workflows/ci.yml` avec les étapes:

1. install
2. lint
3. typecheck
4. test
5. build

Commande locale équivalente:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Observabilité minimale

- **API**: chaque réponse d'erreur inclut `requestId` + header `x-request-id`.
- **Web**: `global-error.tsx` journalise les erreurs globales côté client (`console.error`) comme point d'intégration pour Sentry.
- **Secrets observabilité**: placeholders `SENTRY_DSN_API` et `SENTRY_DSN_WEB` dans `.env.example`.

## Ordre de développement

```text
1. API → 2. Web → 3. Mobile
```

Ne jamais commencer par le mobile avant que l'API n'expose au moins l'auth (`login`, `refresh`, `me`).
