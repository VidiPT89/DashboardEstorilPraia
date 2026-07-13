"use client";

import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type HomeAwayChartProps = {
  data: Array<{ venue: "home" | "away"; won: number; drawn: number; lost: number }>;
};

export function HomeAwayChart({ data }: HomeAwayChartProps) {
  const t = useTranslations("home.charts");

  const chartData = data.map((row) => ({
    ...row,
    venueLabel: row.venue === "home" ? t("homeAwayHome") : t("homeAwayAway"),
  }));

  return (
    <div className="card p-5">
      <h2 className="mb-4 text-base font-semibold">{t("homeAwayTitle")}</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 8, right: 16, left: -16, bottom: 0 }} barGap={2}>
          <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="venueLabel"
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
          <Bar dataKey="won" name={t("won")} fill="var(--chart-won)" radius={[4, 4, 0, 0]} maxBarSize={36}>
            <LabelList dataKey="won" position="top" fill="var(--chart-ink-muted)" fontSize={11} />
          </Bar>
          <Bar dataKey="drawn" name={t("drawn")} fill="var(--chart-drawn)" radius={[4, 4, 0, 0]} maxBarSize={36}>
            <LabelList dataKey="drawn" position="top" fill="var(--chart-ink-muted)" fontSize={11} />
          </Bar>
          <Bar dataKey="lost" name={t("lost")} fill="var(--chart-lost)" radius={[4, 4, 0, 0]} maxBarSize={36}>
            <LabelList dataKey="lost" position="top" fill="var(--chart-ink-muted)" fontSize={11} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
