"use client";

import { useTranslations } from "next-intl";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type PointsEvolutionChartProps = {
  data: Array<{ matchday: number; points: number }>;
};

export function PointsEvolutionChart({ data }: PointsEvolutionChartProps) {
  const t = useTranslations("home.charts");

  return (
    <div className="card card-interactive p-5">
      <h2 className="mb-4 text-base font-semibold">{t("pointsEvolutionTitle")}</h2>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="matchday"
            tick={{ fill: "var(--chart-ink-muted)", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "var(--chart-grid)" }}
            label={{ value: t("pointsEvolutionAxis"), position: "insideBottom", offset: -4, fill: "var(--chart-ink-muted)", fontSize: 11 }}
          />
          <YAxis
            tick={{ fill: "var(--chart-ink-muted)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--foreground)",
            }}
          />
          <Line
            type="monotone"
            dataKey="points"
            stroke="var(--chart-line)"
            strokeWidth={2}
            dot={{ r: 4, fill: "var(--chart-line)", stroke: "var(--surface)", strokeWidth: 2 }}
            activeDot={{ r: 5, stroke: "var(--surface)", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
