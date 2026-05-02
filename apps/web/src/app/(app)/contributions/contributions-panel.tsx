"use client";

import { useEffect, useMemo, useState } from "react";

import { xaBtnPrimary, xaGlassPanel, xaInput } from "@/lib/xaalis-ui";

type PaymentMode = "Mobile Money" | "Virement" | "Especes";

type Contribution = {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  paymentMode: PaymentMode;
  date: string;
  type: string;
  linkedProject?: string;
  description: string;
};

type MemberOption = { id: string; fullName: string };

type ProjectOption = { id: string; name: string };

const MEMBERS: MemberOption[] = [
  { id: "m-01", fullName: "Awa Diop" },
  { id: "m-02", fullName: "Mamadou Ba" },
  { id: "m-03", fullName: "Fatou Ndiaye" },
  { id: "m-04", fullName: "Ibrahima Sow" },
];

const PROJECTS: ProjectOption[] = [
  { id: "p-01", name: "Projet Education" },
  { id: "p-02", name: "Projet Sante" },
  { id: "p-03", name: "Evenement Gala" },
];

const INITIAL_CONTRIBUTIONS: Contribution[] = [
  {
    id: "ct-01",
    memberId: "m-01",
    memberName: "Awa Diop",
    amount: 15000,
    paymentMode: "Mobile Money",
    date: "2026-01-05",
    type: "Mensuel",
    description: "Cotisation du mois de janvier",
  },
  {
    id: "ct-02",
    memberId: "m-02",
    memberName: "Mamadou Ba",
    amount: 60000,
    paymentMode: "Virement",
    date: "2026-01-12",
    type: "Projet",
    linkedProject: "Projet Education",
    description: "Avance pour le projet Education",
  },
  {
    id: "ct-03",
    memberId: "m-03",
    memberName: "Fatou Ndiaye",
    amount: 120000,
    paymentMode: "Especes",
    date: "2026-02-02",
    type: "Annuel",
    description: "Cotisation annuelle 2026",
  },
];

const CONTRIBUTIONS_STORAGE_KEY = "xaalis_mock_contributions";

export function ContributionsPanel() {
  const [rows, setRows] = useState<Contribution[]>(INITIAL_CONTRIBUTIONS);
  const [historyQuery, setHistoryQuery] = useState("");
  const [form, setForm] = useState({
    memberId: MEMBERS[0]?.id ?? "",
    amount: "",
    paymentMode: "Mobile Money" as PaymentMode,
    date: new Date().toISOString().slice(0, 10),
    type: "Mensuel",
    linkedProject: PROJECTS[0]?.name ?? "",
    description: "",
  });

  const total = useMemo(() => rows.reduce((acc, row) => acc + row.amount, 0), [rows]);
  const filteredRows = useMemo(() => {
    const query = historyQuery.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [row.memberName, row.type, row.description, row.paymentMode, row.linkedProject ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [rows, historyQuery]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CONTRIBUTIONS_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Contribution[];
      if (Array.isArray(parsed)) {
        setRows(parsed);
      }
    } catch {
      // ignore invalid local storage payload
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(CONTRIBUTIONS_STORAGE_KEY, JSON.stringify(rows));
    } catch {
      // ignore storage write errors
    }
  }, [rows]);
  const totalsByType = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    for (const row of rows) {
      const key = row.type.trim() || "Non defini";
      const current = map.get(key) ?? { total: 0, count: 0 };
      current.total += row.amount;
      current.count += 1;
      map.set(key, current);
    }
    return Array.from(map.entries())
      .map(([type, stats]) => ({ type, ...stats }))
      .sort((a, b) => b.total - a.total);
  }, [rows]);

  const addContribution = () => {
    const amount = Number(form.amount.replace(",", "."));
    const member = MEMBERS.find((candidate) => candidate.id === form.memberId);
    if (!member || !Number.isFinite(amount) || amount <= 0 || !form.description.trim()) return;

    const contribution: Contribution = {
      id: `ct-${crypto.randomUUID().slice(0, 8)}`,
      memberId: member.id,
      memberName: member.fullName,
      amount,
      paymentMode: form.paymentMode,
      date: form.date,
      type: form.type,
      linkedProject:
        form.type.trim().toLowerCase().includes("projet") ||
        form.type.trim().toLowerCase().includes("evenement")
          ? form.linkedProject
          : undefined,
      description: form.description.trim(),
    };

    setRows((prev) => [contribution, ...prev]);
    setForm((prev) => ({
      ...prev,
      amount: "",
      description: "",
      type: "Mensuel",
      linkedProject: PROJECTS[0]?.name ?? "",
    }));
  };

  const removeContribution = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const exportFilteredExcel = () => {
    const header = ["Date", "Membre", "Montant", "Mode", "Type", "Description"];
    const lines = filteredRows.map((row) =>
      [
        new Date(row.date).toLocaleDateString("fr-FR"),
        row.memberName,
        `${row.amount.toLocaleString("fr-FR")} XOF`,
        row.paymentMode,
        `${row.type}${row.linkedProject ? ` - ${row.linkedProject}` : ""}`,
        row.description,
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cotisations-filtrees-${new Date().toISOString().slice(0, 10)}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportFilteredPdf = () => {
    const rowsHtml = filteredRows
      .map(
        (row) => `
          <tr>
            <td>${new Date(row.date).toLocaleDateString("fr-FR")}</td>
            <td>${row.memberName}</td>
            <td>${row.amount.toLocaleString("fr-FR")} XOF</td>
            <td>${row.paymentMode}</td>
            <td>${row.type}${row.linkedProject ? ` - ${row.linkedProject}` : ""}</td>
            <td>${row.description}</td>
          </tr>
        `,
      )
      .join("");

    const popup = window.open("", "_blank", "width=1000,height=700");
    if (!popup) return;
    popup.document.write(`
      <html>
        <head>
          <title>Export Cotisations</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { font-size: 18px; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #d4d4d8; padding: 8px; text-align: left; vertical-align: top; }
            th { background: #f4f4f5; }
          </style>
        </head>
        <body>
          <h1>Historique des cotisations (filtre applique)</h1>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Membre</th>
                <th>Montant</th>
                <th>Mode</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || `<tr><td colspan="6">Aucune ligne a exporter.</td></tr>`}
            </tbody>
          </table>
        </body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className={`${xaGlassPanel} p-4`}>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Total cotisations</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-700 dark:text-emerald-400">
            {total.toLocaleString("fr-FR")} XOF
          </p>
        </div>
        <div className={`${xaGlassPanel} p-4`}>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Contributions</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{rows.length}</p>
        </div>
        <div className={`${xaGlassPanel} p-4`}>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Membres cotisants</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {new Set(rows.map((row) => row.memberId)).size}
          </p>
        </div>
      </div>

      <section className={xaGlassPanel}>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Ajouter une cotisation</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Selectionnez le membre, le montant, la date, le mode de paiement et le type.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Membre</span>
            <select
              value={form.memberId}
              onChange={(event) => setForm((prev) => ({ ...prev, memberId: event.target.value }))}
              className={xaInput}
            >
              {MEMBERS.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.fullName}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Montant (XOF)</span>
            <input
              value={form.amount}
              onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
              className={xaInput}
              placeholder="Ex: 15000"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Mode paiement</span>
            <select
              value={form.paymentMode}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, paymentMode: event.target.value as PaymentMode }))
              }
              className={xaInput}
            >
              <option value="Mobile Money">Mobile Money</option>
              <option value="Virement">Virement</option>
              <option value="Especes">Especes</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              className={xaInput}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Type</span>
            <input
              value={form.type}
              onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
              className={xaInput}
              placeholder="Ex: Mensuel, Projet Education, Evenement Gala..."
              list="contribution-type-suggestions"
            />
            <datalist id="contribution-type-suggestions">
              <option value="Mensuel" />
              <option value="Annuel" />
              <option value="Projet Education" />
              <option value="Projet Sante" />
              <option value="Evenement Gala" />
            </datalist>
          </label>

          {form.type.trim().toLowerCase().includes("projet") ||
          form.type.trim().toLowerCase().includes("evenement") ? (
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Projet / evenement</span>
              <select
                value={form.linkedProject}
                onChange={(event) => setForm((prev) => ({ ...prev, linkedProject: event.target.value }))}
                className={xaInput}
              >
                {PROJECTS.map((project) => (
                  <option key={project.id} value={project.name}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className={xaInput}
              rows={3}
              placeholder="Ex: pour le mois de janvier, avance pour le projet X"
            />
          </label>
        </div>

        <button type="button" onClick={addContribution} className={`${xaBtnPrimary} mt-5 px-6`}>
          Ajouter la cotisation
        </button>
      </section>

      <section className={xaGlassPanel}>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Historique des cotisations</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <label className="flex w-full max-w-md flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Rechercher dans l'historique</span>
            <input
              value={historyQuery}
              onChange={(event) => setHistoryQuery(event.target.value)}
              className={xaInput}
              placeholder="Nom membre, type, description..."
            />
          </label>
          <div className="flex items-center gap-2 self-end">
            <button
              type="button"
              onClick={exportFilteredExcel}
              className="rounded-full border border-violet-300 px-4 py-2 text-sm font-medium text-violet-800 hover:bg-violet-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Export Excel
            </button>
            <button
              type="button"
              onClick={exportFilteredPdf}
              className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400"
            >
              Export PDF
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200/80 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
                <th className="py-3 pr-3">Membre</th>
                <th className="py-3 pr-3">Montant</th>
                <th className="py-3 pr-3">Mode</th>
                <th className="py-3 pr-3">Date</th>
                <th className="py-3 pr-3">Type</th>
                <th className="py-3 pr-3">Description</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className="border-b border-zinc-100 dark:border-zinc-800/70">
                  <td className="py-3 pr-3 font-medium text-zinc-900 dark:text-zinc-100">{row.memberName}</td>
                  <td className="py-3 pr-3 font-semibold text-emerald-700 dark:text-emerald-400">
                    {row.amount.toLocaleString("fr-FR")} XOF
                  </td>
                  <td className="py-3 pr-3 text-zinc-700 dark:text-zinc-300">{row.paymentMode}</td>
                  <td className="py-3 pr-3 text-zinc-700 dark:text-zinc-300">
                    {new Date(row.date).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="py-3 pr-3">
                    <span className="rounded-full bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                      {row.type}
                      {row.linkedProject ? ` - ${row.linkedProject}` : ""}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-zinc-700 dark:text-zinc-300">{row.description}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => removeContribution(row.id)}
                      className="text-xs text-red-600 hover:underline dark:text-red-400"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Aucun resultat pour cette recherche.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className={xaGlassPanel}>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Types de cotisations disponibles et sommes actuelles
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Synthèse calculée sur toutes les cotisations enregistrées.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200/80 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
                <th className="py-3 pr-3">Type</th>
                <th className="py-3 pr-3">Nombre</th>
                <th className="py-3">Somme actuelle</th>
              </tr>
            </thead>
            <tbody>
              {totalsByType.map((row) => (
                <tr key={row.type} className="border-b border-zinc-100 dark:border-zinc-800/70">
                  <td className="py-3 pr-3 font-medium text-zinc-900 dark:text-zinc-100">{row.type}</td>
                  <td className="py-3 pr-3 text-zinc-700 dark:text-zinc-300">{row.count}</td>
                  <td className="py-3 font-semibold text-emerald-700 dark:text-emerald-400">
                    {row.total.toLocaleString("fr-FR")} XOF
                  </td>
                </tr>
              ))}
              {totalsByType.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Aucun type de cotisation pour le moment.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
