"use client";

import { useEffect, useMemo, useState } from "react";

import { xaBtnPrimary, xaBtnSecondary, xaGlassPanel, xaInput } from "@/lib/xaalis-ui";

type Project = {
  id: string;
  name: string;
  totalBudget: number;
  availableBudget: number;
};

type ProjectContribution = {
  id: string;
  projectName: string;
  member: string;
  amount: number;
  date: string;
  description: string;
};

const INITIAL_PROJECTS: Project[] = [
  { id: "p-01", name: "Projet Education", totalBudget: 2_000_000, availableBudget: 850_000 },
  { id: "p-02", name: "Projet Sante", totalBudget: 1_500_000, availableBudget: 540_000 },
];

const MOCK_PROJECT_CONTRIBUTIONS: ProjectContribution[] = [
  {
    id: "pc-01",
    projectName: "Projet Education",
    member: "Awa Diop",
    amount: 60_000,
    date: "2026-01-12",
    description: "Avance projet Education",
  },
  {
    id: "pc-02",
    projectName: "Projet Education",
    member: "Fatou Ndiaye",
    amount: 45_000,
    date: "2026-02-07",
    description: "Cotisation projet",
  },
  {
    id: "pc-03",
    projectName: "Projet Sante",
    member: "Mamadou Ba",
    amount: 80_000,
    date: "2026-03-14",
    description: "Appui evenement sante",
  },
];
const DEFAULT_INCOME_SOURCES = ["Cotisation", "Don", "Subvention", "Vente"];
const INCOME_STORAGE_KEY = "xaalis_mock_income_rows";

type IncomeStorageRow = {
  type?: string;
};

export function ProjectsPanel() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [incomeSources, setIncomeSources] = useState<string[]>(DEFAULT_INCOME_SOURCES);
  const [newProject, setNewProject] = useState({
    name: "",
    totalBudget: "",
    availableBudget: "",
  });
  const [budgetMove, setBudgetMove] = useState({
    projectId: INITIAL_PROJECTS[0]?.id ?? "",
    source: DEFAULT_INCOME_SOURCES[0] ?? "Cotisation",
    amount: "",
  });
  const [selectedProjectId, setSelectedProjectId] = useState(INITIAL_PROJECTS[0]?.id ?? "");

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  const linkedContributions = useMemo(() => {
    if (!selectedProject) return [];
    return MOCK_PROJECT_CONTRIBUTIONS.filter(
      (contribution) => contribution.projectName === selectedProject.name,
    );
  }, [selectedProject]);

  const syncIncomeSources = () => {
    try {
      const raw = window.localStorage.getItem(INCOME_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as IncomeStorageRow[];
      if (!Array.isArray(parsed)) return;
      const uniqueTypes = Array.from(
        new Set(
          parsed
            .map((item) => (typeof item?.type === "string" ? item.type.trim() : ""))
            .filter(Boolean),
        ),
      );
      if (uniqueTypes.length > 0) {
        setIncomeSources(uniqueTypes);
      }
    } catch {
      // ignore storage read errors
    }
  };

  useEffect(() => {
    syncIncomeSources();
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key && event.key !== INCOME_STORAGE_KEY) return;
      syncIncomeSources();
    };
    const onIncomeUpdated = () => {
      syncIncomeSources();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("xaalis-income-updated", onIncomeUpdated);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("xaalis-income-updated", onIncomeUpdated);
    };
  }, []);

  useEffect(() => {
    if (incomeSources.length === 0) return;
    if (!incomeSources.includes(budgetMove.source)) {
      setBudgetMove((prev) => ({ ...prev, source: incomeSources[0] }));
    }
  }, [incomeSources, budgetMove.source]);

  const addProject = () => {
    const totalBudget = Number(newProject.totalBudget.replace(",", "."));
    const availableBudget = Number(newProject.availableBudget.replace(",", "."));
    if (!newProject.name.trim() || !Number.isFinite(totalBudget) || !Number.isFinite(availableBudget)) {
      return;
    }

    const project: Project = {
      id: `p-${crypto.randomUUID().slice(0, 8)}`,
      name: newProject.name.trim(),
      totalBudget,
      availableBudget,
    };

    setProjects((prev) => [project, ...prev]);
    setSelectedProjectId(project.id);
    setNewProject({ name: "", totalBudget: "", availableBudget: "" });
  };

  const injectBudget = () => {
    const amount = Number(budgetMove.amount.replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0) return;
    setProjects((prev) =>
      prev.map((project) =>
        project.id === budgetMove.projectId
          ? {
              ...project,
              totalBudget: project.totalBudget + amount,
              availableBudget: project.availableBudget + amount,
            }
          : project,
      ),
    );
    setBudgetMove((prev) => ({ ...prev, amount: "" }));
  };

  return (
    <div className="space-y-8">
      <section className={xaGlassPanel}>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Creer un projet</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Definissez le budget total et le montant disponible pour demarrer.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Nom du projet</span>
            <input
              value={newProject.name}
              onChange={(event) => setNewProject((prev) => ({ ...prev, name: event.target.value }))}
              className={xaInput}
              placeholder="Ex: Projet Jeunesse"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Budget total</span>
            <input
              value={newProject.totalBudget}
              onChange={(event) =>
                setNewProject((prev) => ({ ...prev, totalBudget: event.target.value }))
              }
              className={xaInput}
              placeholder="Ex: 2500000"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Montant disponible</span>
            <input
              value={newProject.availableBudget}
              onChange={(event) =>
                setNewProject((prev) => ({ ...prev, availableBudget: event.target.value }))
              }
              className={xaInput}
              placeholder="Ex: 600000"
            />
          </label>
        </div>

        <button type="button" onClick={addProject} className={`${xaBtnPrimary} mt-5 px-6`}>
          Ajouter le projet
        </button>
      </section>

      <section className={xaGlassPanel}>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Ajouter du budget depuis les autres soldes
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Projet</span>
            <select
              value={budgetMove.projectId}
              onChange={(event) =>
                setBudgetMove((prev) => ({ ...prev, projectId: event.target.value }))
              }
              className={xaInput}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Source</span>
            <select
              value={budgetMove.source}
              onChange={(event) =>
                setBudgetMove((prev) => ({ ...prev, source: event.target.value }))
              }
              className={xaInput}
            >
              {incomeSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Montant a injecter</span>
            <input
              value={budgetMove.amount}
              onChange={(event) =>
                setBudgetMove((prev) => ({ ...prev, amount: event.target.value }))
              }
              className={xaInput}
              placeholder="Ex: 150000"
            />
          </label>
        </div>

        <button type="button" onClick={injectBudget} className={`${xaBtnSecondary} mt-5 px-6`}>
          Alimenter le budget projet
        </button>
      </section>

      <section className={xaGlassPanel}>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Suivi des projets</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[740px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200/80 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
                <th className="py-3 pr-3">Projet</th>
                <th className="py-3 pr-3">Budget total</th>
                <th className="py-3 pr-3">Disponible</th>
                <th className="py-3">Cotisations liees</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const count = MOCK_PROJECT_CONTRIBUTIONS.filter(
                  (contribution) => contribution.projectName === project.name,
                ).length;
                const active = selectedProjectId === project.id;
                return (
                  <tr
                    key={project.id}
                    className={`border-b border-zinc-100 dark:border-zinc-800/70 ${active ? "bg-violet-50/60 dark:bg-violet-950/20" : ""}`}
                  >
                    <td className="py-3 pr-3">
                      <button
                        type="button"
                        onClick={() => setSelectedProjectId(project.id)}
                        className="font-semibold text-violet-700 hover:underline dark:text-violet-300"
                      >
                        {project.name}
                      </button>
                    </td>
                    <td className="py-3 pr-3 text-zinc-700 dark:text-zinc-300">
                      {project.totalBudget.toLocaleString("fr-FR")} XOF
                    </td>
                    <td className="py-3 pr-3 font-semibold text-emerald-700 dark:text-emerald-400">
                      {project.availableBudget.toLocaleString("fr-FR")} XOF
                    </td>
                    <td className="py-3">
                      <span className="rounded-full bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                        {count} cotisation(s)
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className={xaGlassPanel}>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Cotisations liees {selectedProject ? `- ${selectedProject.name}` : ""}
        </h2>
        {linkedContributions.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Aucune cotisation liee a ce projet.</p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {linkedContributions.map((contribution) => (
              <article
                key={contribution.id}
                className="rounded-xl border border-violet-100 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
              >
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{contribution.member}</p>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{contribution.description}</p>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(contribution.date).toLocaleDateString("fr-FR")}
                </p>
                <p className="mt-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  {contribution.amount.toLocaleString("fr-FR")} XOF
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
