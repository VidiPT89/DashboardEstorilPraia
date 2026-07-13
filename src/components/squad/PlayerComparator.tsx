"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { PlayerWithStats } from "@/lib/data/player-stats";

type PlayerComparatorProps = {
  players: PlayerWithStats[];
};

function toRadarData(playerA: PlayerWithStats, playerB: PlayerWithStats, labels: [string, string, string]) {
  const maxGoals = Math.max(playerA.goals, playerB.goals, 1);
  const maxAssists = Math.max(playerA.assists, playerB.assists, 1);
  const maxContributions = Math.max(playerA.goals + playerA.assists, playerB.goals + playerB.assists, 1);

  return [
    {
      metric: labels[0],
      [playerA.name]: Math.round((playerA.goals / maxGoals) * 100),
      [playerB.name]: Math.round((playerB.goals / maxGoals) * 100),
      rawA: playerA.goals,
      rawB: playerB.goals,
    },
    {
      metric: labels[1],
      [playerA.name]: Math.round((playerA.assists / maxAssists) * 100),
      [playerB.name]: Math.round((playerB.assists / maxAssists) * 100),
      rawA: playerA.assists,
      rawB: playerB.assists,
    },
    {
      metric: labels[2],
      [playerA.name]: Math.round(((playerA.goals + playerA.assists) / maxContributions) * 100),
      [playerB.name]: Math.round(((playerB.goals + playerB.assists) / maxContributions) * 100),
      rawA: playerA.goals + playerA.assists,
      rawB: playerB.goals + playerB.assists,
    },
  ];
}

export function PlayerComparator({ players }: PlayerComparatorProps) {
  const t = useTranslations("squad.comparator");
  const [playerAId, setPlayerAId] = useState(players[0]?.id);
  const [playerBId, setPlayerBId] = useState(players[1]?.id ?? players[0]?.id);

  const playerA = players.find((p) => p.id === playerAId) ?? players[0];
  const playerB = players.find((p) => p.id === playerBId) ?? players[0];

  const data = useMemo(
    () => toRadarData(playerA, playerB, [t("goals"), t("assists"), t("contributions")]),
    [playerA, playerB, t],
  );

  if (players.length < 2) return null;

  return (
    <div className="card p-5">
      <h2 className="mb-1 text-base font-semibold">{t("title")}</h2>
      <p className="mb-4 text-xs text-[var(--muted)]">{t("intro")}</p>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <PlayerSelect players={players} value={playerAId} onChange={setPlayerAId} />
        <PlayerSelect players={players} value={playerBId} onChange={setPlayerBId} />
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="var(--chart-grid)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--chart-ink-muted)", fontSize: 12 }} />
          <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--foreground)",
            }}
            formatter={(_value, name, item) => {
              const raw = name === playerA.name ? item.payload.rawA : item.payload.rawB;
              return [raw, name];
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span style={{ color: "var(--foreground)", fontSize: 12 }}>{value}</span>}
          />
          <Radar
            name={playerA.name}
            dataKey={playerA.name}
            stroke="var(--chart-scored)"
            fill="var(--chart-scored)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Radar
            name={playerB.name}
            dataKey={playerB.name}
            stroke="var(--chart-conceded)"
            fill="var(--chart-conceded)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

type PlayerSelectProps = {
  players: PlayerWithStats[];
  value: string;
  onChange: (id: string) => void;
};

function PlayerSelect({ players, value, onChange }: PlayerSelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]"
    >
      {players.map((player) => (
        <option key={player.id} value={player.id}>
          {player.name}
        </option>
      ))}
    </select>
  );
}
