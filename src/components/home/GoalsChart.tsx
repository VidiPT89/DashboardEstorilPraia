"use client";

import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type GoalsChartProps = {
  data: Array<{ matchday: number; scored: number; conceded: number }>;
};

export function GoalsChart({ data }: GoalsChartProps) {
  const t = useTranslations("home.charts");

  if (data.length === 0) {
    return (
      <div className="card card-interactive p-5">
        <h2 className="section-title mb-4 text-base font-semibold">{t("goalsTitle")}</h2>
        <p className="flex h-[260px] items-center justify-center text-center text-sm text-[var(--muted)]">
          {t("noMatchesYet")}
        </p>
      </div>
    );
  }

  return (
    <div className="card card-interactive p-5">
      <h2 className="section-title mb-4 text-base font-semibold">{t("goalsTitle")}</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }} barGap={2}>
          <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="matchday"
            tick={{ fill: "var(--chart-ink-muted)", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "var(--chart-grid)" }}
          />
          <YAxis tick={{ fill: "var(--chart-ink-muted)", fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--foreground)",
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: "var(--foreground)", fontSize: 12 }}>{value}</span>
            )}
          />
          <Bar dataKey="scored" name={t("goalsScored")} fill="var(--chart-scored)" radius={[4, 4, 0, 0]} maxBarSize={20} />
          <Bar dataKey="conceded" name={t("goalsConceded")} fill="var(--chart-conceded)" radius={[4, 4, 0, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
