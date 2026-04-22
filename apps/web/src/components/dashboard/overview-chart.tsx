"use client";

import type { MetricsResponse } from "shared";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function formatCompactXof(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} M`;
  }
  if (Math.abs(value) >= 1000) {
    return `${Math.round(value / 1000).toLocaleString("fr-FR")} k`;
  }
  return value.toLocaleString("fr-FR");
}

export function OverviewChart({ data }: { data: MetricsResponse }) {
  if (data.series.length === 0) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Flux net mensuel
        </h2>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Aucune série renvoyée par l’API pour cette organisation (agrégations
          Prisma à brancher ou activer{" "}
          <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-900">
            METRICS_USE_MOCK=1
          </code>{" "}
          en production pour une démo).
        </p>
      </section>
    );
  }

  const mock = Boolean(data.meta.mock);
  const unit =
    typeof data.meta.unit === "string" && data.meta.unit.length > 0
      ? data.meta.unit
      : "XOF";
  const period =
    typeof data.meta.period === "string" ? data.meta.period : null;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Flux net mensuel
        </h2>
        {mock ? (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-950 dark:bg-amber-950/50 dark:text-amber-100">
            Données fictives
          </span>
        ) : null}
      </div>
      {period ? (
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {period}
          {unit ? ` · ${unit}` : ""}
        </p>
      ) : (
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{unit}</p>
      )}

      <div className="mt-6 h-72 w-full min-w-0 text-zinc-900 dark:text-zinc-100">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data.series}
            margin={{ top: 8, right: 12, left: 4, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-zinc-200 dark:stroke-zinc-800"
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-zinc-500"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={formatCompactXof}
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-zinc-500"
              width={44}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(v: number) =>
                `${v.toLocaleString("fr-FR")} ${unit}`.trim()
              }
              labelFormatter={(label) => String(label)}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid rgb(228 228 231)",
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              name="Flux net"
              stroke="currentColor"
              strokeWidth={2}
              dot={{ r: 3, fill: "currentColor" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
