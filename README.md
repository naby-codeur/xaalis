# Xaliss Manager

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

## Scripts racine

| Script | Effet |
| --- | --- |
| `pnpm dev` | Démarre toutes les apps en mode watch |
| `pnpm build` | Build de toutes les apps/packages |
| `pnpm lint` | Lint du monorepo |
| `pnpm typecheck` | Vérification TypeScript |

## Ordre de développement

```text
1. API → 2. Web → 3. Mobile
```

Ne jamais commencer par le mobile avant que l'API n'expose au moins l'auth (`login`, `refresh`, `me`).
