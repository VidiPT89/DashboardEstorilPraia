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
import type { PlayerWithStats } from "@/lib/data/player-stats";

type TopScorersChartProps = {
  players: PlayerWithStats[];
};

export function TopScorersChart({ players }: TopScorersChartProps) {
  const t = useTranslations("home.charts");

  const data = [...players]
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
    .slice(0, 7)
    .map((player) => ({ name: player.name.split(" ").slice(-1)[0], goals: player.goals, assists: player.assists }));

  return (
    <div className="card p-5">
      <h2 className="mb-4 text-base font-semibold">{t("topScorersTitle")}</h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }} barGap={2}>
          <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--chart-ink-muted)", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "var(--chart-grid)" }}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={40}
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
            formatter={(value) => <span style={{ color: "var(--foreground)", fontSize: 12 }}>{value}</span>}
          />
          <Bar dataKey="goals" name={t("goals")} fill="var(--chart-scored)" radius={[4, 4, 0, 0]} maxBarSize={22} />
          <Bar dataKey="assists" name={t("assists")} fill="var(--chart-conceded)" radius={[4, 4, 0, 0]} maxBarSize={22} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
