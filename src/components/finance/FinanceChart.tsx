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
import { formatSeasonLabel } from "@/lib/season";

type FinanceChartProps = {
  data: Array<{ season: string; revenue: number | null; expenses: number | null }>;
};

export function FinanceChart({ data }: FinanceChartProps) {
  const t = useTranslations("finance");

  const chartData = data.map((row) => ({
    seasonLabel: formatSeasonLabel(row.season) ?? row.season,
    revenue: row.revenue ?? undefined,
    expenses: row.expenses ?? undefined,
  }));

  return (
    <div className="card p-5">
      <h2 className="section-title mb-4 text-base font-semibold">{t("chartTitle")}</h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 8, right: 16, left: -16, bottom: 0 }} barGap={2}>
          <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="seasonLabel"
            tick={{ fill: "var(--chart-ink-muted)", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "var(--chart-grid)" }}
          />
          <YAxis
            tick={{ fill: "var(--chart-ink-muted)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => `${(value / 1_000_000).toFixed(1)}M`}
          />
          <Tooltip
            formatter={(value) => `${new Intl.NumberFormat("pt-PT").format(Number(value))} €`}
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
            formatter={(value) => <span style={{ color: "var(--foreground)", fontSize: 12 }}>{value}</span>}
          />
          <Bar dataKey="revenue" name={t("revenueLabel")} fill="var(--chart-won)" radius={[4, 4, 0, 0]} maxBarSize={36} />
          <Bar dataKey="expenses" name={t("expensesLabel")} fill="var(--chart-lost)" radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
