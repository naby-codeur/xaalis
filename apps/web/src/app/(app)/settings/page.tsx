import Link from "next/link";

import { PageShell } from "@/components/app/page-shell";
import { getSessionUser } from "@/lib/session";

import { WEB_ROUTES } from "shared";

export default async function SettingsPage() {
  const user = await getSessionUser();

  return (
    <PageShell
      title="Paramètres"
      description="Configuration du compte et de l’organisation. Les changements sensibles (mot de passe, facturation) passeront par l’API sécurisée."
      breadcrumbs={[
        { label: "Tableau de bord", href: WEB_ROUTES.dashboard },
        { label: "Paramètres" },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Compte</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-xs uppercase text-zinc-500">E-mail</dt>
              <dd className="font-medium">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-zinc-500">Nom affiché</dt>
              <dd>{user.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-zinc-500">Rôle</dt>
              <dd className="uppercase">{user.role}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-zinc-500">
            Changement de mot de passe : à brancher sur{" "}
            <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-900">PATCH /v1/users/me</code>{" "}
            (futur).
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Organisation</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-xs uppercase text-zinc-500">Identifiant organisation</dt>
              <dd className="break-all font-mono text-xs">{user.organizationId}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-zinc-500">
            Le logo organisation se gère depuis la barre supérieure du tableau de bord
            (admin, permission <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-900">org.settings.manage</code>
            ).
          </p>
          <Link
            href={WEB_ROUTES.dashboard}
            className="mt-4 inline-block text-sm font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
          >
            Retour au tableau de bord
          </Link>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 lg:col-span-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Notifications & préférences
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Canaux e-mail et alertes métier (section prévue au cahier des charges §10–§6
            extensions). Interface à connecter à l&apos;API lorsque les endpoints seront
            disponibles.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 opacity-60">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" disabled className="rounded" />
              Rappels d&apos;échéance cotisations
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" disabled className="rounded" />
              Rapport hebdomadaire
            </label>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
