"use client";

import { useMemo, useState } from "react";

import { xaBtnPrimary, xaBtnSecondary, xaGlassPanel, xaInput } from "@/lib/xaalis-ui";

type Sex = "F" | "M";

type Member = {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  sex: Sex;
};

type MemberContribution = {
  id: string;
  memberId: string;
  date: string;
  amount: number;
  paymentMode: "Mobile Money" | "Virement" | "Especes";
  type: string;
  description: string;
};

const MOCK_MEMBERS: Member[] = [
  { id: "m-01", fullName: "Awa Diop", phone: "+221 77 100 20 30", address: "Dakar, Mermoz", sex: "F" },
  { id: "m-02", fullName: "Mamadou Ba", phone: "+221 76 310 02 21", address: "Thies, Cite Lamy", sex: "M" },
  { id: "m-03", fullName: "Fatou Ndiaye", phone: "+221 78 410 55 73", address: "Rufisque, Keury Souf", sex: "F" },
];

const MOCK_HISTORY: MemberContribution[] = [
  { id: "c-01", memberId: "m-01", date: "2026-01-05", amount: 15000, paymentMode: "Mobile Money", type: "Mensuel", description: "Cotisation janvier" },
  { id: "c-02", memberId: "m-01", date: "2026-02-06", amount: 15000, paymentMode: "Virement", type: "Projet Education", description: "Avance projet Education" },
  { id: "c-03", memberId: "m-02", date: "2026-01-09", amount: 10000, paymentMode: "Especes", type: "Mensuel", description: "Cotisation janvier" },
  { id: "c-04", memberId: "m-03", date: "2026-03-11", amount: 20000, paymentMode: "Mobile Money", type: "Projet Sante", description: "Contribution projet Sante" },
];

const EMPTY_FORM: Omit<Member, "id"> = { fullName: "", phone: "", address: "", sex: "F" };

export function MembersPanel() {
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(MOCK_MEMBERS[0]?.id ?? "");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [membersQuery, setMembersQuery] = useState("");
  const [form, setForm] = useState<Omit<Member, "id">>(EMPTY_FORM);

  const selectedMember = useMemo(
    () => members.find((member) => member.id === selectedMemberId) ?? null,
    [members, selectedMemberId],
  );
  const memberHistory = useMemo(
    () => MOCK_HISTORY.filter((item) => item.memberId === selectedMemberId),
    [selectedMemberId],
  );
  const filteredMembers = useMemo(() => {
    const query = membersQuery.trim().toLowerCase();
    if (!query) return members;
    return members.filter((member) =>
      [member.fullName, member.phone, member.address, member.sex].join(" ").toLowerCase().includes(query),
    );
  }, [members, membersQuery]);

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function submitForm() {
    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim()) return;

    if (editingId) {
      setMembers((prev) =>
        prev.map((member) =>
          member.id === editingId ? { ...member, ...form, fullName: form.fullName.trim() } : member,
        ),
      );
      resetForm();
      return;
    }

    const next: Member = {
      id: `m-${crypto.randomUUID().slice(0, 8)}`,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      sex: form.sex,
    };
    setMembers((prev) => [next, ...prev]);
    setSelectedMemberId(next.id);
    resetForm();
  }

  function startEdit(member: Member) {
    setEditingId(member.id);
    setForm({ fullName: member.fullName, phone: member.phone, address: member.address, sex: member.sex });
  }

  function deleteMember(memberId: string) {
    setMembers((prev) => prev.filter((member) => member.id !== memberId));
    if (selectedMemberId === memberId) {
      const fallback = members.find((member) => member.id !== memberId);
      setSelectedMemberId(fallback?.id ?? "");
    }
    if (editingId === memberId) resetForm();
  }

  function openHistory(memberId: string) {
    setSelectedMemberId(memberId);
    setHistoryOpen(true);
  }

  function exportMembersExcel() {
    const header = ["Nom complet", "Telephone", "Adresse", "Sexe"];
    const lines = filteredMembers.map((member) =>
      [member.fullName, member.phone, member.address, member.sex === "F" ? "Femme" : "Homme"]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `membres-filtres-${new Date().toISOString().slice(0, 10)}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportMembersPdf() {
    const rowsHtml = filteredMembers
      .map(
        (member) => `
          <tr>
            <td>${member.fullName}</td>
            <td>${member.phone}</td>
            <td>${member.address}</td>
            <td>${member.sex === "F" ? "Femme" : "Homme"}</td>
          </tr>
        `,
      )
      .join("");
    const popup = window.open("", "_blank", "width=950,height=700");
    if (!popup) return;
    popup.document.write(`
      <html>
        <head>
          <title>Export Membres</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { font-size: 18px; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #d4d4d8; padding: 8px; text-align: left; }
            th { background: #f4f4f5; }
          </style>
        </head>
        <body>
          <h1>Liste des membres (filtre applique)</h1>
          <table>
            <thead>
              <tr>
                <th>Nom complet</th>
                <th>Telephone</th>
                <th>Adresse</th>
                <th>Sexe</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || `<tr><td colspan="4">Aucune ligne a exporter.</td></tr>`}
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
      <section className={xaGlassPanel}>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {editingId ? "Modifier un membre" : "Ajouter un membre"}
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Coordonnees completes : nom, telephone, adresse et sexe.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Nom complet</span>
            <input value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} className={xaInput} placeholder="Ex: Awa Diop" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Numero telephone</span>
            <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className={xaInput} placeholder="Ex: +221 77 000 00 00" />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Adresse</span>
            <input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} className={xaInput} placeholder="Ex: Dakar, Parcelles Assainies" />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:max-w-xs">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Sexe</span>
            <select value={form.sex} onChange={(e) => setForm((p) => ({ ...p, sex: e.target.value as Sex }))} className={xaInput}>
              <option value="F">Femme</option>
              <option value="M">Homme</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={submitForm} className={`${xaBtnPrimary} px-5`}>
            {editingId ? "Mettre a jour" : "Ajouter le membre"}
          </button>
          <button type="button" onClick={resetForm} className={`${xaBtnSecondary} px-5`}>
            Annuler
          </button>
        </div>
      </section>

      <section className={xaGlassPanel}>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Membres ({members.length})</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Cliquez sur un membre pour afficher l'historique de ses cotisations.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <label className="flex w-full max-w-md flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Rechercher un membre</span>
            <input
              value={membersQuery}
              onChange={(event) => setMembersQuery(event.target.value)}
              className={xaInput}
              placeholder="Nom, telephone, adresse..."
            />
          </label>
          <div className="flex items-center gap-2 self-end">
            <button
              type="button"
              onClick={exportMembersExcel}
              className="rounded-full border border-violet-300 px-4 py-2 text-sm font-medium text-violet-800 hover:bg-violet-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Export Excel
            </button>
            <button
              type="button"
              onClick={exportMembersPdf}
              className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400"
            >
              Export PDF
            </button>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200/80 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
                <th className="py-3 pr-3">Nom</th>
                <th className="py-3 pr-3">Telephone</th>
                <th className="py-3 pr-3">Adresse</th>
                <th className="py-3 pr-3">Sexe</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => {
                const active = selectedMemberId === member.id;
                return (
                  <tr key={member.id} className={`border-b border-zinc-100 transition-colors dark:border-zinc-800/70 ${active ? "bg-violet-50/70 dark:bg-violet-950/20" : ""}`}>
                    <td className="py-3 pr-3">
                      <button type="button" onClick={() => openHistory(member.id)} className="font-semibold text-violet-700 hover:underline dark:text-violet-300">
                        {member.fullName}
                      </button>
                    </td>
                    <td className="py-3 pr-3 text-zinc-700 dark:text-zinc-300">{member.phone}</td>
                    <td className="py-3 pr-3 text-zinc-700 dark:text-zinc-300">{member.address}</td>
                    <td className="py-3 pr-3 text-zinc-700 dark:text-zinc-300">{member.sex === "F" ? "Femme" : "Homme"}</td>
                    <td className="py-3">
                      <div className="flex gap-3 text-xs">
                        <button type="button" onClick={() => startEdit(member)} className="text-emerald-700 hover:underline dark:text-emerald-400">
                          Modifier
                        </button>
                        <button type="button" onClick={() => deleteMember(member.id)} className="text-red-600 hover:underline dark:text-red-400">
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Aucun membre trouve pour cette recherche.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {historyOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setHistoryOpen(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-violet-200/70 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-950"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Historique des cotisations {selectedMember ? `- ${selectedMember.fullName}` : ""}
              </h2>
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="rounded-lg border border-zinc-300 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Fermer
              </button>
            </div>

            {memberHistory.length === 0 ? (
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Aucune cotisation pour ce membre.</p>
            ) : (
              <div className="xaalis-scroll-fun mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                {memberHistory.map((item) => (
                  <article key={item.id} className="rounded-xl border border-violet-100 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/70">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">{item.type}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {new Date(item.date).toLocaleDateString("fr-FR")} - {item.paymentMode}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{item.description}</p>
                    <p className="mt-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                      {item.amount.toLocaleString("fr-FR")} XOF
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
