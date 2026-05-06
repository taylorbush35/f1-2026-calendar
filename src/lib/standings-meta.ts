import { races2026 } from "@/data/races-2026";

/** Latest championship round with a recorded winner (excludes canceled races). */
export function getLatestCompletedChampionshipRound(): number | null {
  const rounds = races2026
    .filter((r) => !r.canceled && r.winner && r.championshipRound != null)
    .map((r) => r.championshipRound!);
  if (rounds.length === 0) return null;
  return Math.max(...rounds);
}
