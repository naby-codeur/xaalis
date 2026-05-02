"use client";

import { useMemo, useState } from "react";

import { xaBtnPrimary, xaGlassPanel, xaInput } from "@/lib/xaalis-ui";

type PaymentMethod = "Virement" | "Mobile Money" | "Especes" | "Cheque";
type ExpenseStatus = "Planifiee" | "Payee" | "Annulee";

type ExpenseEntry = {
  id: string;
  date: string;
  type: string;
  beneficiary: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: ExpenseStatus;
  reference: string;
  description: string;
};

const INITIAL_EXPENSES: ExpenseEntry[] = [
  {
    id: "exp-01",
    date: "2026-01-10",
    type: "Loyer",
    beneficiary: "Agence Immo Dakar",
    amount: 180_000,
    paymentMethod: "Virement",
    status: "Payee",
    reference: "LOY-2026-01",
    description: "Paiement du loyer mensuel du siege",
  },
  {
    id: "exp-02",
    date: "2026-01-20",
    type: "Materiel",
    beneficiary: "Papeterie Sahel",
    amount: 42_500,
    paymentMethod: "Especes",
    status: "Payee",
    reference: "MAT-017",
    description: "Achat fournitures et encre imprimante",
  },
  {
    id: "exp-03",
    date: "2026-02-04",
    type: "Evenement",
    beneficiary: "Salle Polyvalente Mbao",
    amount: 95_000,
    paymentMethod: "Mobile Money",
    status: "Planifiee",
    reference: "EVT-GALA",
    description: "Reservation salle pour evenement communautaire",
  },
];

export function ExpensesPanel() {
  const [rows, setRows] = useState<ExpenseEntry[]>(INITIAL_EXPENSES);
  const [journalQuery, setJournalQuery] = useState("");
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: "Autre",
    beneficiary: "",
    amount: "",
    paymentMethod: "Virement" as PaymentMethod,
    status: "Planifiee" as ExpenseStatus,
    reference: "",
    description: "",
  });

  const totals = useMemo(() => {
    const total = rows.reduce((sum, row) => sum + row.amount, 0);
    const paid = rows.filter((row) => row.status === "Payee").reduce((sum, row) => sum + row.amount, 0);
    const planned = rows
      .filter((row) => row.status === "Planifiee")
      .reduce((sum, row) => sum + row.amount, 0);
    return { total, paid, planned };
  }, [rows]);
  const filteredRows = useMemo(() => {
    const query = journalQuery.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [
        row.type,
        row.beneficiary,
        row.paymentMethod,
        row.status,
        row.reference,
        row.description,
        row.date,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [rows, journalQuery]);

  function addExpense() {
    const amount = Number(form.amount.replace(",", "."));
    if (
      !form.beneficiary.trim() ||
      !form.reference.trim() ||
      !form.description.trim() ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return;
    }

    const next: ExpenseEntry = {
      id: `exp-${crypto.randomUUID().slice(0, 8)}`,
      date: form.date,
      type: form.type,
      beneficiary: form.beneficiary.trim(),
      amount,
      paymentMethod: form.paymentMethod,
      status: form.status,
      reference: form.reference.trim(),
      description: form.description.trim(),
    };

    setRows((prev) => [next, ...prev]);
    setForm((prev) => ({
      ...prev,
      beneficiary: "",
      amount: "",
      reference: "",
      description: "",
      status: "Planifiee",
    }));
  }

  function removeExpense(id: string) {
    setRows((prev) => prev.filter((row) => row.id !== id));
  }

  function markPaid(id: string) {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, status: "Payee" as const } : row)),
    );
  }

  function exportFilteredExcel() {
    const header = ["Date", "Type", "Beneficiaire", "Montant", "Mode", "Statut", "Reference", "Description"];
    const lines = filteredRows.map((row) =>
      [
        new Date(row.date).toLocaleDateString("fr-FR"),
        row.type,
        row.beneficiary,
        `${row.amount.toLocaleString("fr-FR")} XOF`,
        row.paymentMethod,
        row.status,
        row.reference,
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
    link.download = `depenses-filtrees-${new Date().toISOString().slice(0, 10)}.xls`;
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
            <td>${row.beneficiary}</td>
            <td>${row.amount.toLocaleString("fr-FR")} XOF</td>
            <td>${row.paymentMethod}</td>
            <td>${row.status}</td>
            <td>${row.reference}</td>
            <td>${row.description}</td>
          </tr>
        `,
      )
      .join("");
    const popup = window.open("", "_blank", "width=1100,height=700");
    if (!popup) return;
    popup.document.write(`
      <html>
        <head>
          <title>Export Depenses</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { font-size: 18px; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #d4d4d8; padding: 8px; text-align: left; vertical-align: top; }
            th { background: #f4f4f5; }
          </style>
        </head>
        <body>
          <h1>Journal des depenses (filtre applique)</h1>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Beneficiaire</th>
                <th>Montant</th>
                <th>Mode</th>
                <th>Statut</th>
                <th>Reference</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || `<tr><td colspan="8">Aucune ligne a exporter.</td></tr>`}
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
      <div className="grid gap-4 sm:grid-cols-3">
        <div className={`${xaGlassPanel} p-4`}>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Depenses totales</p>
          <p className="mt-1 text-2xl font-semibold text-rose-700 dark:text-rose-400">
            {totals.total.toLocaleString("fr-FR")} XOF
          </p>
        </div>
        <div className={`${xaGlassPanel} p-4`}>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Deja payees</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {totals.paid.toLocaleString("fr-FR")} XOF
          </p>
        </div>
        <div className={`${xaGlassPanel} p-4`}>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Planifiees</p>
          <p className="mt-1 text-2xl font-semibold text-amber-700 dark:text-amber-400">
            {totals.planned.toLocaleString("fr-FR")} XOF
          </p>
        </div>
      </div>

      <section className={xaGlassPanel}>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Ajouter une depense</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Saisissez les modalites completes : date, type, beneficiaire, mode de paiement et statut.
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
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Type</span>
            <input
              value={form.type}
              onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
              className={xaInput}
              placeholder="Ex: Loyer, Salaire, Transport, Maintenance..."
              list="expense-type-suggestions"
            />
            <datalist id="expense-type-suggestions">
              <option value="Loyer" />
              <option value="Salaire" />
              <option value="Transport" />
              <option value="Materiel" />
              <option value="Evenement" />
              <option value="Autre" />
            </datalist>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Beneficiaire</span>
            <input
              value={form.beneficiary}
              onChange={(event) => setForm((prev) => ({ ...prev, beneficiary: event.target.value }))}
              className={xaInput}
              placeholder="Ex: Papeterie Sahel"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Montant (XOF)</span>
            <input
              value={form.amount}
              onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
              className={xaInput}
              placeholder="Ex: 45000"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Mode de paiement</span>
            <select
              value={form.paymentMethod}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, paymentMethod: event.target.value as PaymentMethod }))
              }
              className={xaInput}
            >
              <option value="Virement">Virement</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Especes">Especes</option>
              <option value="Cheque">Cheque</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Statut</span>
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as ExpenseStatus }))}
              className={xaInput}
            >
              <option value="Planifiee">Planifiee</option>
              <option value="Payee">Payee</option>
              <option value="Annulee">Annulee</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Reference</span>
            <input
              value={form.reference}
              onChange={(event) => setForm((prev) => ({ ...prev, reference: event.target.value }))}
              className={xaInput}
              placeholder="Ex: FAC-2026-019"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className={xaInput}
              rows={3}
              placeholder="Ex: Achat de fournitures administratives"
            />
          </label>
        </div>

        <button type="button" onClick={addExpense} className={`${xaBtnPrimary} mt-5 px-6`}>
          Enregistrer la depense
        </button>
      </section>

      <section className={xaGlassPanel}>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Journal des depenses ({rows.length})
        </h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <label className="flex w-full max-w-md flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Rechercher dans le journal</span>
            <input
              value={journalQuery}
              onChange={(event) => setJournalQuery(event.target.value)}
              className={xaInput}
              placeholder="Type, beneficiaire, mode, statut, reference..."
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
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200/80 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
                <th className="py-3 pr-3">Date</th>
                <th className="py-3 pr-3">Type</th>
                <th className="py-3 pr-3">Beneficiaire</th>
                <th className="py-3 pr-3">Montant</th>
                <th className="py-3 pr-3">Mode</th>
                <th className="py-3 pr-3">Statut</th>
                <th className="py-3 pr-3">Reference</th>
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
                  <td className="py-3 pr-3 text-zinc-700 dark:text-zinc-300">{row.type}</td>
                  <td className="py-3 pr-3 font-medium text-zinc-900 dark:text-zinc-100">{row.beneficiary}</td>
                  <td className="py-3 pr-3 font-semibold text-rose-700 dark:text-rose-400">
                    {row.amount.toLocaleString("fr-FR")} XOF
                  </td>
                  <td className="py-3 pr-3 text-zinc-700 dark:text-zinc-300">{row.paymentMethod}</td>
                  <td className="py-3 pr-3">
                    <span
                      className={
                        row.status === "Payee"
                          ? "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : row.status === "Annulee"
                            ? "rounded-full bg-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200"
                            : "rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                      }
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-zinc-700 dark:text-zinc-300">{row.reference}</td>
                  <td className="py-3 pr-3 text-zinc-700 dark:text-zinc-300">{row.description}</td>
                  <td className="py-3">
                    {row.status !== "Payee" ? (
                      <button
                        type="button"
                        onClick={() => markPaid(row.id)}
                        className="mr-2 text-xs text-emerald-700 hover:underline dark:text-emerald-400"
                      >
                        Marquer payee
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => removeExpense(row.id)}
                      className="text-xs text-red-600 hover:underline dark:text-red-400"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Aucun resultat pour cette recherche.
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
