export interface PhysicalMetrics {
  distanceKm: number;
  sprints: number;
  topSpeedKmh: number;
  fatigueIndex: number;
  avgHeartRateBpm: number;
}

type Range = [number, number];

interface PositionRanges {
  distanceKm: Range;
  sprints: Range;
  topSpeedKmh: Range;
  fatigueIndex: Range;
  avgHeartRateBpm: Range;
}

const POSITION_RANGES: Record<string, PositionRanges> = {
  "Guarda-Redes": {
    distanceKm: [3.5, 5.5],
    sprints: [1, 4],
    topSpeedKmh: [22, 26],
    fatigueIndex: [15, 40],
    avgHeartRateBpm: [125, 145],
  },
  Defesa: {
    distanceKm: [9.5, 11.5],
    sprints: [12, 22],
    topSpeedKmh: [28, 31],
    fatigueIndex: [45, 75],
    avgHeartRateBpm: [155, 170],
  },
  Médio: {
    distanceKm: [10.5, 12.5],
    sprints: [18, 30],
    topSpeedKmh: [29, 32],
    fatigueIndex: [50, 85],
    avgHeartRateBpm: [158, 173],
  },
  Avançado: {
    distanceKm: [9, 11],
    sprints: [20, 32],
    topSpeedKmh: [30, 34],
    fatigueIndex: [45, 80],
    avgHeartRateBpm: [155, 172],
  },
};

const DEFAULT_RANGES: PositionRanges = {
  distanceKm: [8, 11],
  sprints: [10, 25],
  topSpeedKmh: [27, 31],
  fatigueIndex: [40, 70],
  avgHeartRateBpm: [145, 165],
};

function randomInRange([min, max]: Range): number {
  return min + Math.random() * (max - min);
}

export function generatePhysicalMetrics(position: string | null): PhysicalMetrics {
  const ranges = (position && POSITION_RANGES[position]) || DEFAULT_RANGES;

  return {
    distanceKm: Number(randomInRange(ranges.distanceKm).toFixed(1)),
    sprints: Math.round(randomInRange(ranges.sprints)),
    topSpeedKmh: Number(randomInRange(ranges.topSpeedKmh).toFixed(1)),
    fatigueIndex: Math.round(randomInRange(ranges.fatigueIndex)),
    avgHeartRateBpm: Math.round(randomInRange(ranges.avgHeartRateBpm)),
  };
}
