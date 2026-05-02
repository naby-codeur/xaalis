"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import { Pie } from "react-chartjs-2";

import { xaBtnPrimary, xaGlassPanel, xaInput } from "@/lib/xaalis-ui";

ChartJS.register(ArcElement, Tooltip, Legend);

type PaymentChannel = "Virement" | "Mobile Money" | "Especes" | "Cheque";

type IncomeEntry = {
  id: string;
  date: string;
  type: string;
  source: string;
  amount: number;
  paymentChannel: PaymentChannel;
  description: string;
};

const INCOME_STORAGE_KEY = "xaalis_mock_income_rows";
const CONTRIBUTIONS_STORAGE_KEY = "xaalis_mock_contributions";

type StoredContribution = {
  amount?: unknown;
};

function isCotisationType(value: string): boolean {
  return value.trim().toLowerCase().includes("cotis");
}

const INITIAL_INCOME: IncomeEntry[] = [
  {
    id: "inc-01",
    date: "2026-01-05",
    type: "Don",
    source: "Awa Diop",
    amount: 15_000,
    paymentChannel: "Mobile Money",
    description: "Don mensuel de janvier",
  },
  {
    id: "inc-02",
    date: "2026-01-17",
    type: "Don",
    source: "Fondation Keur",
    amount: 350_000,
    paymentChannel: "Virement",
    description: "Don pour soutien des activites sociales",
  },
  {
    id: "inc-03",
    date: "2026-02-02",
    type: "Subvention",
    source: "Mairie de Dakar",
    amount: 500_000,
    paymentChannel: "Virement",
    description: "Subvention programme education",
  },
  {
    id: "inc-04",
    date: "2026-02-22",
    type: "Vente",
    source: "Vente de marchandises",
    amount: 87_000,
    paymentChannel: "Especes",
    description: "Recette stand evenementiel",
  },
];

export function IncomePanel() {
  const [rows, setRows] = useState<IncomeEntry[]>(INITIAL_INCOME);
  const [contributionsTotal, setContributionsTotal] = useState(0);
  const [contributionsCount, setContributionsCount] = useState(0);
  const [journalQuery, setJournalQuery] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: "Don",
    source: "",
    amount: "",
    paymentChannel: "Virement" as PaymentChannel,
    description: "",
  });

  const mergedRows = useMemo(() => {
    const baseRows = rows.filter((row) => !isCotisationType(row.type));
    if (contributionsTotal <= 0) return baseRows;
    const cotisationsRow: IncomeEntry = {
      id: "inc-cotisations-auto",
      date: new Date().toISOString().slice(0, 10),
      type: "Cotisations",
      source: "Module Cotisations",
      amount: contributionsTotal,
      paymentChannel: "Virement",
      description: `Total cumule de ${contributionsCount} cotisation(s).`,
    };
    return [cotisationsRow, ...baseRows];
  }, [rows, contributionsTotal, contributionsCount]);

  const totals = useMemo(() => {
    const total = mergedRows.reduce((sum, row) => sum + row.amount, 0);
    const byType = mergedRows.reduce(
      (acc, row) => {
        const key = row.type.trim().toLowerCase();
        if (key.includes("cotis")) acc.cotisation += row.amount;
        else if (key.includes("don")) acc.don += row.amount;
        else if (key.includes("subvention")) acc.subvention += row.amount;
        else if (key.includes("vente")) acc.vente += row.amount;
        else acc.other += row.amount;
        return acc;
      },
      { cotisation: 0, don: 0, subvention: 0, vente: 0, other: 0 },
    );
    return { total, byType };
  }, [mergedRows]);
  const filteredRows = useMemo(() => {
    const query = journalQuery.trim().toLowerCase();
    if (!query) return mergedRows;
    return mergedRows.filter((row) =>
      [row.type, row.source, row.paymentChannel, row.description, row.date]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [mergedRows, journalQuery]);
  const incomeDistribution = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of filteredRows) {
      map.set(row.type, (map.get(row.type) ?? 0) + row.amount);
    }
    const labels = Array.from(map.keys());
    const values = Array.from(map.values());
    return { labels, values };
  }, [filteredRows]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(INCOME_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as IncomeEntry[];
      if (Array.isArray(parsed)) {
        setRows(parsed);
      }
    } catch {
      // ignore invalid local storage payload
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(INCOME_STORAGE_KEY, JSON.stringify(rows));
      window.dispatchEvent(new Event("xaalis-income-updated"));
    } catch {
      // ignore storage write errors
    }
  }, [rows]);

  useEffect(() => {
    function loadContributionsTotal() {
      try {
        const raw = window.localStorage.getItem(CONTRIBUTIONS_STORAGE_KEY);
        if (!raw) {
          setContributionsTotal(0);
          setContributionsCount(0);
          return;
        }
        const parsed = JSON.parse(raw) as StoredContribution[];
        if (!Array.isArray(parsed)) {
          setContributionsTotal(0);
          setContributionsCount(0);
          return;
        }
        const total = parsed.reduce((sum, row) => {
          const amount = typeof row?.amount === "number" ? row.amount : Number(row?.amount);
          return Number.isFinite(amount) ? sum + amount : sum;
        }, 0);
        setContributionsTotal(total);
        setContributionsCount(parsed.length);
      } catch {
        setContributionsTotal(0);
        setContributionsCount(0);
      }
    }

    loadContributionsTotal();
    window.addEventListener("storage", loadContributionsTotal);
    return () => window.removeEventListener("storage", loadContributionsTotal);
  }, []);

  function addIncome() {
    if (isCotisationType(form.type)) {
      setFormError("Le type Cotisation est reserve au module Cotisations.");
      return;
    }
    const amount = Number(form.amount.replace(",", "."));
    if (!form.source.trim() || !form.description.trim() || !Number.isFinite(amount) || amount <= 0) {
      return;
    }
    setFormError(null);

    const next: IncomeEntry = {
      id: `inc-${crypto.randomUUID().slice(0, 8)}`,
      date: form.date,
      type: form.type,
      source: form.source.trim(),
      amount,
      paymentChannel: form.paymentChannel,
      description: form.description.trim(),
    };
    setRows((prev) => [next, ...prev]);
    setForm((prev) => ({ ...prev, source: "", amount: "", description: "" }));
  }

  function removeIncome(id: string) {
    if (id === "inc-cotisations-auto") return;
    setRows((prev) => prev.filter((row) => row.id !== id));
  }

  function exportFilteredExcel() {
    const header = ["Date", "Type", "Source", "Montant", "Mode", "Description"];
    const lines = filteredRows.map((row) =>
      [
        new Date(row.date).toLocaleDateString("fr-FR"),
        row.type,
        row.source,
        `${row.amount.toLocaleString("fr-FR")} XOF`,
        row.paymentChannel,
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
    link.download = `revenus-filtres-${new Date().toISOString().slice(0, 10)}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportFilteredPdf() {
    const rowsHtml = filteredRows
      .map(
        (row) => `
          <tr>
            <td>${new Date(row.date).toLocaleDateString("fr-FR")}</td>
            <td>${row.type}</td>
            <td>${row.source}</td>
            <td>${row.amount.toLocaleString("fr-FR")} XOF</td>
            <td>${row.paymentChannel}</td>
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
          <title>Export Revenus</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { font-size: 18px; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #d4d4d8; padding: 8px; text-align: left; vertical-align: top; }
            th { background: #f4f4f5; }
          </style>
        </head>
        <body>
          <h1>Journal des revenus (filtre applique)</h1>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Source</th>
                <th>Montant</th>
                <th>Mode</th>
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
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
          Total revenus : {totals.total.toLocaleString("fr-FR")} XOF
        </div>
      </div>

      <section className={xaGlassPanel}>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Ajouter un autre revenu que cotisation
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Les cotisations sont ajoutees automatiquement depuis le module Cotisations.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Type de revenu</span>
            <input
              value={form.type}
              onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
              className={xaInput}
              placeholder="Ex: Don, Subvention, Vente, Sponsoring..."
              list="income-type-suggestions"
            />
            <datalist id="income-type-suggestions">
              <option value="Don" />
              <option value="Subvention" />
              <option value="Vente de marchandises" />
              <option value="Sponsoring" />
            </datalist>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Source</span>
            <input
              value={form.source}
              onChange={(event) => setForm((prev) => ({ ...prev, source: event.target.value }))}
              className={xaInput}
              placeholder="Ex: Fondation Keur / Awa Diop"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Montant (XOF)</span>
            <input
              value={form.amount}
              onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
              className={xaInput}
              placeholder="Ex: 50000"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Mode de reception</span>
            <select
              value={form.paymentChannel}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, paymentChannel: event.target.value as PaymentChannel }))
              }
              className={xaInput}
            >
              <option value="Virement">Virement</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Especes">Especes</option>
              <option value="Cheque">Cheque</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className={xaInput}
              rows={3}
              placeholder="Ex: Don pour appui des activités du mois"
            />
          </label>
        </div>
        {formError ? (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{formError}</p>
        ) : null}

        <button type="button" onClick={addIncome} className={`${xaBtnPrimary} mt-5 px-6`}>
          Enregistrer le revenu
        </button>
      </section>

      <section className={xaGlassPanel}>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Journal des revenus ({rows.length})
        </h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <label className="flex w-full max-w-md flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Rechercher dans le journal</span>
            <input
              value={journalQuery}
              onChange={(event) => setJournalQuery(event.target.value)}
              className={xaInput}
              placeholder="Type, source, mode, description..."
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
                <th className="py-3 pr-3">Date</th>
                <th className="py-3 pr-3">Type</th>
                <th className="py-3 pr-3">Source</th>
                <th className="py-3 pr-3">Montant</th>
                <th className="py-3 pr-3">Mode</th>
                <th className="py-3 pr-3">Description</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className="border-b border-zinc-100 dark:border-zinc-800/70">
                  <td className="py-3 pr-3 text-zinc-700 dark:text-zinc-300">
                    {new Date(row.date).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="py-3 pr-3">
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {row.type}
                    </span>
                  </td>
                  <td className="py-3 pr-3 font-medium text-zinc-900 dark:text-zinc-100">{row.source}</td>
                  <td className="py-3 pr-3 font-semibold text-emerald-700 dark:text-emerald-400">
                    {row.amount.toLocaleString("fr-FR")} XOF
                  </td>
                  <td className="py-3 pr-3 text-zinc-700 dark:text-zinc-300">{row.paymentChannel}</td>
                  <td className="py-3 pr-3 text-zinc-700 dark:text-zinc-300">{row.description}</td>
                  <td className="py-3">
                    {row.id === "inc-cotisations-auto" ? (
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">Automatique</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeIncome(row.id)}
                        className="text-xs text-red-600 hover:underline dark:text-red-400"
                      >
                        Supprimer
                      </button>
                    )}
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
          Graphique : repartition des revenus
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Repartition par type, selon la liste actuellement filtree.
        </p>
        {incomeDistribution.labels.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Aucune donnee a afficher dans le graphique.
          </p>
        ) : (
          <div className="mx-auto mt-6 max-w-xl">
            <Pie
              data={{
                labels: incomeDistribution.labels,
                datasets: [
                  {
                    data: incomeDistribution.values,
                    backgroundColor: [
                      "rgba(16, 185, 129, 0.85)",
                      "rgba(124, 58, 237, 0.85)",
                      "rgba(245, 158, 11, 0.85)",
                      "rgba(14, 165, 233, 0.85)",
                      "rgba(236, 72, 153, 0.85)",
                      "rgba(99, 102, 241, 0.85)",
                    ],
                    borderColor: "#ffffff",
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: { position: "bottom" },
                  tooltip: {
                    callbacks: {
                      label: (context) =>
                        `${context.label}: ${Number(context.raw).toLocaleString("fr-FR")} XOF`,
                    },
                  },
                },
              }}
            />
          </div>
        )}
      </section>
    </div>
  );
}
