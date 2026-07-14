import { getTranslations } from "next-intl/server";
import { SimulatedDataBadge } from "@/components/ui/SimulatedDataBadge";
import type { PlayerPhysicalData } from "@/lib/data/simulated-metrics";

type PhysicalPerformanceSectionProps = {
  players: PlayerPhysicalData[];
};

export async function PhysicalPerformanceSection({ players }: PhysicalPerformanceSectionProps) {
  const t = await getTranslations("physical");

  if (players.length === 0) return null;

  return (
    <div
      className="card mt-6 overflow-hidden border-dashed"
      style={{ borderColor: "var(--simulated-border)" }}
    >
      <div className="space-y-3 border-b border-[var(--border)] px-5 py-4">
        <h2 className="section-title text-base font-semibold">{t("title")}</h2>
        <SimulatedDataBadge label={t("badgeLabel")} note={t("badgeNote")} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-[var(--muted)]">
              <th className="px-5 py-3 font-medium">{t("table.player")}</th>
              <th className="px-2 py-3 text-center font-medium">{t("table.distance")}</th>
              <th className="px-2 py-3 text-center font-medium">{t("table.sprints")}</th>
              <th className="px-2 py-3 text-center font-medium">{t("table.topSpeed")}</th>
              <th className="px-2 py-3 text-center font-medium">{t("table.heartRate")}</th>
              <th className="px-5 py-3 font-medium">{t("table.fatigue")}</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr
                key={player.playerId}
                className="border-t border-[var(--border)] transition-colors hover:bg-[var(--surface-raised)]"
              >
                <td className="px-5 py-2.5">
                  <span className="font-medium">{player.playerName}</span>
                  {player.shirtNumber ? (
                    <span className="ml-1.5 text-xs text-[var(--muted)]">#{player.shirtNumber}</span>
                  ) : null}
                </td>
                <td className="px-2 py-2.5 text-center tabular-nums">{player.metrics.distanceKm} km</td>
                <td className="px-2 py-2.5 text-center tabular-nums">{player.metrics.sprints}</td>
                <td className="px-2 py-2.5 text-center tabular-nums">{player.metrics.topSpeedKmh} km/h</td>
                <td className="px-2 py-2.5 text-center tabular-nums">{player.metrics.avgHeartRateBpm} bpm</td>
                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--surface-raised)]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${player.metrics.fatigueIndex}%`,
                          backgroundColor: "var(--simulated-accent)",
                        }}
                      />
                    </div>
                    <span className="tabular-nums text-xs text-[var(--muted)]">{player.metrics.fatigueIndex}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
