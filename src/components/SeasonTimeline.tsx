"use client";

import type { Race } from "@/types/race";

interface SeasonTimelineProps {
  races: Race[];
  selectedRaceId?: number;
  onSelectRace?: (round: number) => void;
}

export default function SeasonTimeline({
  races,
  selectedRaceId,
  onSelectRace,
}: SeasonTimelineProps) {
  return (
    <div className="w-full py-8" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="relative mx-auto max-w-7xl px-4">
        {/* Timeline line */}
        <div
          className="absolute left-4 right-4 top-1/2 h-0.5 -translate-y-1/2 transition-colors duration-300"
          style={{ backgroundColor: "var(--text-secondary)", opacity: 0.3 }}
        />

        {/* Timeline dots */}
        <div className="relative flex items-center justify-between">
          {races.map((race) => {
            const isSelected = selectedRaceId === race.round;
            return (
              <button
                key={race.round}
                onClick={() => onSelectRace?.(race.round)}
                className="relative z-10 flex flex-col items-center transition-all duration-300 hover:scale-110"
                aria-label={`Select round ${race.round}: ${race.raceName}`}
              >
                <div
                  className="h-3 w-3 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isSelected
                      ? "var(--accent-primary)"
                      : "var(--accent-muted)",
                    transform: isSelected ? "scale(1.5)" : "scale(1)",
                    boxShadow: isSelected
                      ? "0 0 0 2px var(--bg-primary), 0 0 0 4px var(--accent-primary)"
                      : "none",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
