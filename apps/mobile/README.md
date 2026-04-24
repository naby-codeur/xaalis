<<<<<<< HEAD
# Mobile App (`apps/mobile`)

Application Expo pour Xaalis Manager.

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
=======
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
