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
    <div
      className="race-card group relative rounded-lg border p-6 transition-all duration-300 hover:-translate-y-1"
      style={
        race.canceled
          ? { borderColor: "var(--accent-primary)", borderWidth: 2 }
          : undefined
      }
    >
      {/* Hover intel breadcrumb */}
      <div
        className="absolute left-0 right-0 top-0 rounded-t-lg px-4 py-2 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ backgroundColor: "var(--accent-primary)" }}
      >
        Calendar intel: {race.country}
        {race.format === "sprint" && " • Sprint weekend"}
      </div>

      {/* Content */}
      <div>
        <div className="mb-2 text-sm font-medium transition-colors duration-300" style={{ color: "var(--text-secondary)" }}>
          Round {race.round}
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h3
            className="text-xl font-semibold transition-colors duration-300"
            style={{
              color: race.canceled ? "var(--text-secondary)" : "var(--text-primary)",
              textDecoration: race.canceled ? "line-through" : undefined,
              opacity: race.canceled ? 0.75 : 1,
            }}
          >
            {race.raceName}
          </h3>
          {race.format === "sprint" && (
            <span
              className="rounded-full px-3 py-1 text-xs font-medium text-white transition-colors duration-300"
              style={{ backgroundColor: "var(--accent-primary)" }}
            >
              Sprint
            </span>
          )}
          {race.canceled && (
            <span
              className="rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white sm:text-xs"
              style={{
                backgroundColor: "var(--accent-primary)",
                boxShadow: "0 2px 10px rgba(195, 0, 0, 0.45)",
              }}
            >
              Removed from calendar
            </span>
          )}
        </div>
        <p
          className="mb-4 text-sm transition-colors duration-300"
          style={{
            color: "var(--text-secondary)",
            textDecoration: race.canceled ? "line-through" : undefined,
            opacity: race.canceled ? 0.7 : 1,
          }}
        >
          {race.circuitName}
          {race.city && ` • ${race.city}`}
        </p>
        <p
          className="text-sm font-medium transition-colors duration-300"
          style={{
            color: "var(--text-secondary)",
            textDecoration: race.canceled ? "line-through" : undefined,
            opacity: race.canceled ? 0.7 : 1,
          }}
        >
          {race.canceled && (
            <span className="mr-2 font-medium" style={{ color: "var(--text-secondary)" }}>
              Originally planned:
            </span>
          )}
          {formatDate(race.raceDate)}
        </p>

        {race.winner && (
          <div
            className="mt-4 rounded-lg border px-3 py-2"
            style={{
              borderColor: "var(--accent-primary)",
              backgroundColor: "rgba(195, 0, 0, 0.08)",
            }}
          >
            <p
              className="text-[11px] font-bold uppercase tracking-wide"
              style={{ color: "var(--accent-primary)" }}
            >
              Race Winner
            </p>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {race.winner}
              {race.winnerHighlight && (
                <span className="ml-2 text-xs font-medium" style={{ color: "var(--accent-primary)" }}>
                  ({race.winnerHighlight})
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

