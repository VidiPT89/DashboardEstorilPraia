export const SUSPENSION_THRESHOLD = 3;

// Weighted distribution: most players sit at 0-1 yellow cards, a smaller
// group is one card away from a (simulated) suspension, and a few have
// already reached the simplified 3-card threshold used for this demo.
const YELLOW_CARD_WEIGHTS: Array<{ count: number; weight: number }> = [
  { count: 0, weight: 0.35 },
  { count: 1, weight: 0.35 },
  { count: 2, weight: 0.2 },
  { count: 3, weight: 0.1 },
];

// Red cards are rare: most players have none, a handful have exactly one.
const RED_CARD_WEIGHTS: Array<{ count: number; weight: number }> = [
  { count: 0, weight: 0.85 },
  { count: 1, weight: 0.13 },
  { count: 2, weight: 0.02 },
];

function rollWeighted(weights: Array<{ count: number; weight: number }>): number {
  const roll = Math.random();
  let cumulative = 0;

  for (const { count, weight } of weights) {
    cumulative += weight;
    if (roll <= cumulative) return count;
  }

  return 0;
}

export function generateYellowCardCount(): number {
  return rollWeighted(YELLOW_CARD_WEIGHTS);
}

export function generateRedCardCount(): number {
  return rollWeighted(RED_CARD_WEIGHTS);
}
