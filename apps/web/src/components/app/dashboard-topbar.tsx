"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type DashboardTopbarProps = {
  user: {
    email: string;
    name?: string | null;
    role: string;
    organizationLogoUrl?: string | null;
  };
  /** When true, header `left` matches collapsed sidebar width (`w-16`). */
  sidebarCollapsed?: boolean;
};

const DEMO_NOTIFICATIONS = [
  "Nouveau membre ajouté à l'organisation.",
  "Cotisation mensuelle validée avec succès.",
  "Rappel: échéance d'abonnement dans 5 jours.",
  "Rapport mensuel disponible.",
  "Une nouvelle dépense a été enregistrée.",
  "Votre export comptable est prêt.",
];

const DEMO_SUBSCRIPTION_ITEMS = [
  "Plan actuel: Pro",
  "Utilisateurs actifs: 24 / 50",
  "Stockage: 12.4 Go / 50 Go",
  "Facturation: Prochaine échéance le 05/05/2026",
  "Options: Notifications avancées actives",
  "Support prioritaire: activé",
];

export function DashboardTopbar({ user, sidebarCollapsed = false }: DashboardTopbarProps) {
  const [orgLogo, setOrgLogo] = useState<string | null>(user.organizationLogoUrl ?? null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [logoSaving, setLogoSaving] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const subscriptionRef = useRef<HTMLDivElement | null>(null);

  const isAdmin = useMemo(() => user.role.toUpperCase() === "ADMIN", [user.role]);

  useEffect(() => {
    async function loadLogo() {
      const res = await fetch("/api/org/logo", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json().catch(() => ({}))) as { logoUrl?: string | null };
      setOrgLogo(data.logoUrl ?? null);
    }
    void loadLogo();
  }, []);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
      if (subscriptionRef.current && !subscriptionRef.current.contains(target)) {
        setSubscriptionOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      if (!result) return;
      setLogoSaving(true);
      setLogoError(null);
      try {
        const res = await fetch("/api/org/logo", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ logoUrl: result }),
        });
        const payload = (await res.json().catch(() => ({}))) as {
          logoUrl?: string | null;
          error?: { message?: string };
        };
        if (!res.ok) {
          setLogoError(payload.error?.message ?? "Impossible de mettre à jour le logo.");
          return;
        }
        setOrgLogo(payload.logoUrl ?? null);
      } finally {
        setLogoSaving(false);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleLogoRemove() {
    setLogoSaving(true);
    setLogoError(null);
    try {
      const res = await fetch("/api/org/logo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logoUrl: null }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        logoUrl?: string | null;
        error?: { message?: string };
      };
      if (!res.ok) {
        setLogoError(payload.error?.message ?? "Impossible de supprimer le logo.");
        return;
      }
      setOrgLogo(payload.logoUrl ?? null);
    } finally {
      setLogoSaving(false);
    }
  }

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-30 border-b border-violet-200/40 bg-white/75 px-6 py-3.5 shadow-sm shadow-violet-500/5 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/75 dark:shadow-black/20 ${sidebarCollapsed ? "md:left-16" : "md:left-64"}`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-8">
        <div className="w-full max-w-[22rem]">
          <label className="sr-only" htmlFor="global-search">
            Recherche
          </label>
          <input
            id="global-search"
            type="search"
            placeholder="Rechercher membres, cotisations…"
            className="h-10 w-full rounded-xl border border-violet-200/70 bg-white/90 px-3.5 text-sm text-zinc-900 shadow-inner shadow-violet-500/5 outline-none transition-[border-color,box-shadow] placeholder:text-zinc-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-violet-500 dark:focus:ring-violet-400/15"
          />
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden text-right text-xs leading-tight text-zinc-500 sm:block dark:text-zinc-400">
            <p className="font-medium text-violet-950 dark:text-zinc-200">
              {user.name ?? "Bienvenue"}
            </p>
            <p className="text-[11px] uppercase tracking-wide text-violet-600/80 dark:text-violet-300/80">
              {user.role}
            </p>
          </div>

          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen((v) => !v);
                setSubscriptionOpen(false);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200/80 bg-white/80 text-violet-700 transition-all hover:border-violet-300 hover:bg-violet-50 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
              aria-label="Notifications"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
            </button>
            {notificationsOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-72 rounded-2xl border border-violet-100/90 bg-white/95 p-2 shadow-2xl shadow-violet-500/15 backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-950/95">
                <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-300">
                  Notifications
                </p>
                <div className="xaalis-scroll-fun max-h-52 space-y-0.5 overflow-y-auto pr-1">
                  {DEMO_NOTIFICATIONS.map((item) => (
                    <p
                      key={item}
                      className="cursor-default rounded-xl px-2 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-violet-50 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative" ref={subscriptionRef}>
            <button
              type="button"
              onClick={() => {
                setSubscriptionOpen((v) => !v);
                setNotificationsOpen(false);
              }}
              className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-teal-500/25 transition-all hover:from-emerald-400 hover:to-teal-400 hover:shadow-lg dark:shadow-teal-900/30"
            >
              Abonnement
            </button>
            {subscriptionOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-80 rounded-2xl border border-teal-100/90 bg-white/95 p-2 shadow-2xl shadow-teal-500/10 backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-950/95">
                <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                  Détails abonnement
                </p>
                <div className="xaalis-scroll-fun max-h-52 space-y-0.5 overflow-y-auto pr-1">
                  {DEMO_SUBSCRIPTION_ITEMS.map((item) => (
                    <p
                      key={item}
                      className="cursor-default rounded-xl px-2 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-teal-50/80 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-violet-200/60 bg-white/60 px-3 py-1.5 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/50">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-violet-200 bg-gradient-to-br from-violet-50 to-teal-50 text-xs font-semibold text-violet-600 dark:border-violet-800 dark:from-zinc-800 dark:to-zinc-900 dark:text-violet-300">
              {orgLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={orgLogo} alt="Logo organisation" className="h-full w-full object-cover" />
              ) : (
                "ORG"
              )}
            </div>

            {isAdmin ? (
              <div className="flex items-center gap-2 text-xs">
                <label className="cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100">
                  {logoSaving ? "Enregistrement..." : "Changer logo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={logoSaving}
                    onChange={handleLogoUpload}
                  />
                </label>
                {orgLogo ? (
                  <button
                    type="button"
                    onClick={handleLogoRemove}
                    disabled={logoSaving}
                    className="text-red-600 hover:text-red-700 disabled:opacity-60 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Supprimer
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {logoError ? (
        <div className="mx-auto mt-2 w-full max-w-6xl text-right text-xs text-red-600 dark:text-red-400">
          {logoError}
        </div>
      ) : null}
    </header>
  );
}
