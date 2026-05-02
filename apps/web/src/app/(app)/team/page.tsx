import Link from "next/link";

import { PageShell } from "@/components/app/page-shell";
import { apiGet } from "@/lib/api-server";
import { getSessionUser } from "@/lib/session";

import {
  ROLE_PERMISSIONS,
  WEB_ROUTES,
  type OrganizationUserDto,
  type Role,
} from "shared";

const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super administrateur",
  ADMIN: "Administrateur",
  MANAGER: "Manager",
  CASHIER: "Caissier",
  VIEWER: "Lecture seule",
};

export default async function TeamPage() {
  const user = await getSessionUser();
  const usersRes = await apiGet<{ data: OrganizationUserDto[] }>(
    "/v1/organization/users",
  );
  const users = usersRes.ok ? usersRes.data.data : [];

  const matrix = (Object.keys(ROLE_PERMISSIONS) as Role[]).map((role) => ({
    role,
    permissions: ROLE_PERMISSIONS[role],
  }));

  return (
    <PageShell
      title="Équipe & accès"
      description="Vue organisation : utilisateurs liés à l’organisation (API), votre session actuelle et la matrice RBAC (cahier des charges §4.3)."
      breadcrumbs={[
        { label: "Tableau de bord", href: WEB_ROUTES.dashboard },
        { label: "Équipe" },
      ]}
      actions={
        <Link
          href={WEB_ROUTES.members}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          Gérer les membres
        </Link>
      }
    >
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Session actuelle
        </h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-zinc-500">E-mail</dt>
            <dd className="font-medium text-zinc-900 dark:text-zinc-100">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-zinc-500">Rôle</dt>
            <dd className="font-medium text-zinc-900 dark:text-zinc-100">
              {ROLE_LABELS[user.role] ?? user.role}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-zinc-500">Organisation</dt>
            <dd className="break-all font-mono text-xs text-zinc-700 dark:text-zinc-300">
              {user.organizationId}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Utilisateurs de l’organisation ({users.length})
        </h2>
        {!usersRes.ok ? (
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
            Chargement des utilisateurs impossible ({usersRes.status}).
          </p>
        ) : null}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase text-zinc-500 dark:border-zinc-800">
                <th className="py-2 pr-4 font-medium">Nom</th>
                <th className="py-2 pr-4 font-medium">E-mail</th>
                <th className="py-2 pr-4 font-medium">Rôle</th>
                <th className="py-2 font-medium">Ajouté</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.membershipId}
                  className="border-b border-zinc-100 dark:border-zinc-800/80"
                >
                  <td className="py-3 pr-4 text-zinc-700 dark:text-zinc-300">
                    {u.name ?? "—"}
                  </td>
                  <td className="py-3 pr-4 font-medium text-zinc-900 dark:text-zinc-100">
                    {u.email}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-zinc-500 dark:text-zinc-400">
                    {new Date(u.joinedAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Matrice des permissions par rôle
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Les contrôles effectifs sont appliqués côté API uniquement.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase text-zinc-500 dark:border-zinc-800">
                <th className="py-2 pr-4 font-medium">Rôle</th>
                <th className="py-2 font-medium">Permissions</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map(({ role, permissions }) => (
                <tr key={role} className="border-b border-zinc-100 dark:border-zinc-800/80">
                  <td className="py-3 pr-4 align-top font-medium text-zinc-900 dark:text-zinc-50">
                    {ROLE_LABELS[role]}
                  </td>
                  <td className="py-3 text-zinc-600 dark:text-zinc-400">
                    <ul className="flex flex-wrap gap-1">
                      {permissions.map((p) => (
                        <li
                          key={p}
                          className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}
