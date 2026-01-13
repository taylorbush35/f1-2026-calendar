"use client";

import type { Race } from "@/types/race";

interface RaceCardProps {
  race: Race;
}

export default function RaceCard({ race }: RaceCardProps) {
  const formatDate = (dateString: string): string => {
    // Parse YYYY-MM-DD as local date to avoid UTC timezone issues
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="race-card group relative rounded-lg border p-6 transition-all duration-300 hover:-translate-y-1">
      {/* Hover intel breadcrumb */}
      <div
        className="absolute left-0 right-0 top-0 rounded-t-lg px-4 py-2 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ backgroundColor: "var(--f1-primary)" }}
      >
        Calendar intel: {race.country}
        {race.format === "sprint" && " • Sprint weekend"}
      </div>

      {/* Content */}
      <div>
        <div className="mb-2 text-sm font-medium transition-colors duration-300" style={{ color: "var(--text-secondary)" }}>
          Round {race.round}
        </div>
        <div className="mb-3 flex items-center gap-2">
          <h3 className="text-xl font-semibold transition-colors duration-300" style={{ color: "var(--text-primary)" }}>
            {race.raceName}
          </h3>
          {race.format === "sprint" && (
            <span
              className="rounded-full px-3 py-1 text-xs font-medium text-white transition-colors duration-300"
              style={{ backgroundColor: "var(--f1-secondary)" }}
            >
              Sprint
            </span>
          )}
        </div>
        <p className="mb-4 text-sm transition-colors duration-300" style={{ color: "var(--text-secondary)" }}>
          {race.circuitName}
          {race.city && ` • ${race.city}`}
        </p>
        <p className="text-sm font-medium transition-colors duration-300" style={{ color: "var(--text-secondary)" }}>
          {formatDate(race.raceDate)}
        </p>
      </div>
    </div>
  );
}

