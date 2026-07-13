import { getEstorilSquad } from "@/lib/data/team";
import { PLAYER_SEASON_STATS } from "@/data/player-season-stats";

export interface PlayerWithStats {
  id: string;
  name: string;
  position: string | null;
  shirtNumber: number | null;
  goals: number;
  assists: number;
}

export async function getPlayersWithSeasonStats(): Promise<PlayerWithStats[]> {
  const squad = await getEstorilSquad();

  return PLAYER_SEASON_STATS.map((stat) => {
    const player = squad.find((p) => p.shirtNumber === stat.shirtNumber);
    if (!player) return null;

    return {
      id: player.id,
      name: player.name,
      position: player.position,
      shirtNumber: player.shirtNumber,
      goals: stat.goals,
      assists: stat.assists,
    };
  }).filter((entry): entry is PlayerWithStats => entry !== null);
}
