"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { xaBtnPrimary, xaBtnSecondary, xaGlassPanel, xaInput } from "@/lib/xaalis-ui";

type ReportRow = {
  id: string;
  date: string;
  module: "Revenus" | "Depenses" | "Cotisations" | "Projets";
  category: string;
  paymentMode: "Mobile Money" | "Virement" | "Especes" | "Cheque";
  amountIn: number;
  amountOut: number;
  label: string;
};

type PeriodFilter = "3m" | "6m" | "12m";
type ModuleFilter = "Tous" | ReportRow["module"];
type PaymentFilter = "Tous" | ReportRow["paymentMode"];

const COLORS = ["#7c3aed", "#14b8a6", "#f59e0b", "#f43f5e", "#2563eb", "#22c55e"];

const MOCK_ROWS: ReportRow[] = [
  { id: "r-01", date: "2026-01-05", module: "Cotisations", category: "Mensuel", paymentMode: "Mobile Money", amountIn: 15000, amountOut: 0, label: "Cotisation Awa Diop" },
  { id: "r-02", date: "2026-01-08", module: "Revenus", category: "Don", paymentMode: "Virement", amountIn: 300000, amountOut: 0, label: "Don Fondation Keur" },
  { id: "r-03", date: "2026-01-10", module: "Depenses", category: "Loyer", paymentMode: "Virement", amountIn: 0, amountOut: 180000, label: "Loyer siege" },
  { id: "r-04", date: "2026-01-15", module: "Projets", category: "Projet Education", paymentMode: "Virement", amountIn: 60000, amountOut: 25000, label: "Approvisionnement projet Education" },
  { id: "r-05", date: "2026-02-03", module: "Revenus", category: "Subvention", paymentMode: "Virement", amountIn: 450000, amountOut: 0, label: "Subvention municipale" },
  { id: "r-06", date: "2026-02-09", module: "Depenses", category: "Materiel", paymentMode: "Especes", amountIn: 0, amountOut: 42500, label: "Achat fournitures" },
  { id: "r-07", date: "2026-02-14", module: "Cotisations", category: "Annuel", paymentMode: "Mobile Money", amountIn: 120000, amountOut: 0, label: "Cotisation annuelle Fatou" },
  { id: "r-08", date: "2026-03-02", module: "Revenus", category: "Vente", paymentMode: "Especes", amountIn: 96000, amountOut: 0, label: "Vente de marchandises" },
  { id: "r-09", date: "2026-03-06", module: "Depenses", category: "Transport", paymentMode: "Mobile Money", amountIn: 0, amountOut: 36000, label: "Transport terrain" },
  { id: "r-10", date: "2026-03-11", module: "Projets", category: "Projet Sante", paymentMode: "Mobile Money", amountIn: 80000, amountOut: 30000, label: "Contributions projet Sante" },
  { id: "r-11", date: "2026-04-04", module: "Revenus", category: "Don", paymentMode: "Cheque", amountIn: 220000, amountOut: 0, label: "Don entreprise partenaire" },
  { id: "r-12", date: "2026-04-19", module: "Depenses", category: "Salaire", paymentMode: "Virement", amountIn: 0, amountOut: 260000, label: "Salaires equipe projet" },
  { id: "r-13", date: "2026-05-02", module: "Cotisations", category: "Mensuel", paymentMode: "Mobile Money", amountIn: 25000, amountOut: 0, label: "Cotisations groupe local" },
  { id: "r-14", date: "2026-05-18", module: "Depenses", category: "Evenement", paymentMode: "Especes", amountIn: 0, amountOut: 95000, label: "Organisation atelier communautaire" },
  { id: "r-15", date: "2026-06-07", module: "Revenus", category: "Subvention", paymentMode: "Virement", amountIn: 500000, amountOut: 0, label: "Subvention programme 2e semestre" },
];

function monthLabel(value: string): string {
  return new Date(value).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
}

export function ReportsAdvancedPanel() {
  const [period, setPeriod] = useState<PeriodFilter>("6m");
  const [moduleFilter, setModuleFilter] = useState<ModuleFilter>("Tous");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("Tous");

  const filteredRows = useMemo(() => {
    const monthsBack = period === "3m" ? 3 : period === "6m" ? 6 : 12;
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - monthsBack);
    cutoff.setHours(0, 0, 0, 0);

    return MOCK_ROWS.filter((row) => {
      const inPeriod = new Date(row.date) >= cutoff;
      const moduleOk = moduleFilter === "Tous" || row.module === moduleFilter;
      const paymentOk = paymentFilter === "Tous" || row.paymentMode === paymentFilter;
      return inPeriod && moduleOk && paymentOk;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [period, moduleFilter, paymentFilter]);

  const summary = useMemo(() => {
    const income = filteredRows.reduce((sum, row) => sum + row.amountIn, 0);
    const expense = filteredRows.reduce((sum, row) => sum + row.amountOut, 0);
    const net = income - expense;
    const avgTicket = filteredRows.length > 0 ? (income + expense) / filteredRows.length : 0;
    return { income, expense, net, avgTicket };
  }, [filteredRows]);

  const monthly = useMemo(() => {
    const map = new Map<string, { month: string; revenus: number; depenses: number }>();
    for (const row of filteredRows) {
      const key = row.date.slice(0, 7);
      const existing = map.get(key) ?? { month: monthLabel(`${key}-01`), revenus: 0, depenses: 0 };
      existing.revenus += row.amountIn;
      existing.depenses += row.amountOut;
      map.set(key, existing);
    }
    return Array.from(map.values());
  }, [filteredRows]);

  const categorySplit = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of filteredRows) {
      map.set(row.category, (map.get(row.category) ?? 0) + row.amountIn + row.amountOut);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [filteredRows]);

  const moduleBars = useMemo(() => {
    const base = [
      { module: "Revenus", value: 0 },
      { module: "Depenses", value: 0 },
      { module: "Cotisations", value: 0 },
      { module: "Projets", value: 0 },
    ];
    for (const row of filteredRows) {
      const found = base.find((entry) => entry.module === row.module);
      if (found) found.value += row.amountIn + row.amountOut;
    }
    return base;
  }, [filteredRows]);

  function exportCsv() {
    const header = ["Date", "Module", "Categorie", "ModePaiement", "MontantEntree", "MontantSortie", "Libelle"];
    const lines = filteredRows.map((row) =>
      [row.date, row.module, row.category, row.paymentMode, row.amountIn, row.amountOut, row.label]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `xaalis-rapport-avance-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <section className={`${xaGlassPanel} space-y-4`}>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex min-w-[9rem] flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Periode</span>
            <select value={period} onChange={(e) => setPeriod(e.target.value as PeriodFilter)} className={xaInput}>
              <option value="3m">3 derniers mois</option>
              <option value="6m">6 derniers mois</option>
              <option value="12m">12 derniers mois</option>
            </select>
          </label>
          <label className="flex min-w-[10rem] flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Module</span>
            <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value as ModuleFilter)} className={xaInput}>
              <option value="Tous">Tous</option>
              <option value="Revenus">Revenus</option>
              <option value="Depenses">Depenses</option>
              <option value="Cotisations">Cotisations</option>
              <option value="Projets">Projets</option>
            </select>
          </label>
          <label className="flex min-w-[10rem] flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Paiement</span>
            <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value as PaymentFilter)} className={xaInput}>
              <option value="Tous">Tous</option>
              <option value="Virement">Virement</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Especes">Especes</option>
              <option value="Cheque">Cheque</option>
            </select>
          </label>
          <button type="button" onClick={exportCsv} className={`${xaBtnPrimary} px-5`}>
            Export CSV detaille
          </button>
          <button type="button" onClick={() => { setPeriod("6m"); setModuleFilter("Tous"); setPaymentFilter("Tous"); }} className={`${xaBtnSecondary} px-5`}>
            Reinitialiser
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className={`${xaGlassPanel} p-4`}>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Total entrees</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-700 dark:text-emerald-400">{summary.income.toLocaleString("fr-FR")} XOF</p>
        </article>
        <article className={`${xaGlassPanel} p-4`}>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Total sorties</p>
          <p className="mt-1 text-2xl font-semibold text-rose-700 dark:text-rose-400">{summary.expense.toLocaleString("fr-FR")} XOF</p>
        </article>
        <article className={`${xaGlassPanel} p-4`}>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Resultat net</p>
          <p className={`mt-1 text-2xl font-semibold ${summary.net >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}>
            {summary.net.toLocaleString("fr-FR")} XOF
          </p>
        </article>
        <article className={`${xaGlassPanel} p-4`}>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Ticket moyen</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{Math.round(summary.avgTicket).toLocaleString("fr-FR")} XOF</p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className={xaGlassPanel}>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Evolution revenus / depenses</h3>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-zinc-200 dark:stroke-zinc-800" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => `${value.toLocaleString("fr-FR")} XOF`} />
                <Legend />
                <Bar dataKey="revenus" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="depenses" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className={xaGlassPanel}>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Repartition par categories</h3>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categorySplit} dataKey="value" nameKey="name" innerRadius={58} outerRadius={100} paddingAngle={2}>
                  {categorySplit.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toLocaleString("fr-FR")} XOF`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className={`${xaGlassPanel} space-y-4`}>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Poids par module</h3>
        <div className="grid gap-2">
          {moduleBars.map((item, index) => {
            const max = Math.max(...moduleBars.map((m) => m.value), 1);
            const pct = Math.round((item.value / max) * 100);
            return (
              <div key={item.module} className="rounded-xl border border-zinc-200/80 bg-white/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">{item.module}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">{item.value.toLocaleString("fr-FR")} XOF</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: COLORS[index % COLORS.length] }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className={xaGlassPanel}>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Tableau detaille</h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{filteredRows.length} ligne(s) selon les filtres actifs.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200/80 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
                <th className="py-3 pr-3">Date</th>
                <th className="py-3 pr-3">Module</th>
                <th className="py-3 pr-3">Categorie</th>
                <th className="py-3 pr-3">Paiement</th>
                <th className="py-3 pr-3">Entree</th>
                <th className="py-3 pr-3">Sortie</th>
                <th className="py-3">Libelle</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className="border-b border-zinc-100 dark:border-zinc-800/70">
                  <td className="py-3 pr-3 text-zinc-700 dark:text-zinc-300">{new Date(row.date).toLocaleDateString("fr-FR")}</td>
                  <td className="py-3 pr-3"><span className="rounded-full bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">{row.module}</span></td>
                  <td className="py-3 pr-3 text-zinc-700 dark:text-zinc-300">{row.category}</td>
                  <td className="py-3 pr-3 text-zinc-700 dark:text-zinc-300">{row.paymentMode}</td>
                  <td className="py-3 pr-3 font-semibold text-emerald-700 dark:text-emerald-400">{row.amountIn ? `${row.amountIn.toLocaleString("fr-FR")} XOF` : "-"}</td>
                  <td className="py-3 pr-3 font-semibold text-rose-700 dark:text-rose-400">{row.amountOut ? `${row.amountOut.toLocaleString("fr-FR")} XOF` : "-"}</td>
                  <td className="py-3 text-zinc-700 dark:text-zinc-300">{row.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
