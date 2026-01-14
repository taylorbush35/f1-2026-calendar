"use client";

import type { Race } from "@/types/race";

interface RacePanelProps {
  race: Race | null;
}

export default function RacePanel({ race }: RacePanelProps) {
  if (!race) {
    return null;
  }

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className="relative rounded-lg border px-8 py-6 transition-all duration-300 ease-out"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
        boxShadow: "0 0 0 1px var(--border-subtle), 0 1px 3px 0 rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Left accent rail */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg transition-colors duration-300"
        style={{ backgroundColor: "var(--accent-primary)" }}
      />

      {/* Connector dot */}
      <div
        className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full transition-colors duration-300"
        style={{
          backgroundColor: "var(--accent-primary)",
          boxShadow: "0 0 0 2px var(--bg-surface)",
        }}
      />

      {/* Content */}
      <div className="relative pl-6">
        {/* Round label */}
        <div
          className="mb-1 text-xs font-medium uppercase tracking-wide transition-colors duration-300"
          style={{ color: "var(--text-tertiary)" }}
        >
          Round {race.round}
        </div>

        {/* Headline */}
        <h2
          className="mb-3 text-3xl font-bold tracking-tight transition-colors duration-300"
          style={{ color: "var(--text-primary)" }}
        >
          {race.raceName}
        </h2>

        {/* Subhead: Circuit · Location */}
        <p
          className="mb-4 text-lg transition-colors duration-300"
          style={{ color: "var(--text-secondary)" }}
        >
          {race.circuitName} · {race.city && `${race.city}, `}
          {race.country}
        </p>

        {/* Date */}
        <p
          className="text-sm transition-colors duration-300"
          style={{ color: "var(--text-tertiary)" }}
        >
          {formatDate(race.raceDate)}
        </p>
      </div>
    </div>
  );
}