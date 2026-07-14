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

export function generateYellowCardCount(): number {
  const roll = Math.random();
  let cumulative = 0;

  for (const { count, weight } of YELLOW_CARD_WEIGHTS) {
    cumulative += weight;
    if (roll <= cumulative) return count;
  }

  return 0;
}
