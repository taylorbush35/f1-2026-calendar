"use client";

import type { Race } from "@/types/race";

interface RaceDetailPanelProps {
  race: Race | null;
}

export default function RaceDetailPanel({ race }: RaceDetailPanelProps) {
  if (!race) {
    return (
      <div
        className="rounded-lg border p-6 transition-colors duration-300"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <p
          className="text-center transition-colors duration-300"
          style={{ color: "var(--text-secondary)" }}
        >
          Select a race to view details
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const isSprint = race.format === "sprint";

  return (
    <div
      className="rounded-lg border p-6 transition-colors duration-300"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div
            className="mb-2 text-sm font-medium transition-colors duration-300"
            style={{ color: "var(--text-secondary)" }}
          >
            Round {race.round}
          </div>
          <h2
            className="text-2xl font-bold transition-colors duration-300"
            style={{ color: "var(--text-primary)" }}
          >
            {race.raceName}
          </h2>
        </div>
        {isSprint && (
          <span
            className="rounded-full px-3 py-1 text-xs font-medium text-white transition-colors duration-300"
            style={{ backgroundColor: "var(--f1-secondary)" }}
          >
            Sprint
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <p
            className="text-sm font-medium transition-colors duration-300"
            style={{ color: "var(--text-secondary)" }}
          >
            Circuit
          </p>
          <p
            className="transition-colors duration-300"
            style={{ color: "var(--text-primary)" }}
          >
            {race.circuitName}
          </p>
        </div>

        <div>
          <p
            className="text-sm font-medium transition-colors duration-300"
            style={{ color: "var(--text-secondary)" }}
          >
            Location
          </p>
          <p
            className="transition-colors duration-300"
            style={{ color: "var(--text-primary)" }}
          >
            {race.city && `${race.city}, `}
            {race.country}
          </p>
        </div>

        <div>
          <p
            className="text-sm font-medium transition-colors duration-300"
            style={{ color: "var(--text-secondary)" }}
          >
            Race Date
          </p>
          <p
            className="transition-colors duration-300"
            style={{ color: "var(--text-primary)" }}
          >
            {formatDate(race.raceDate)}
          </p>
        </div>

        {isSprint && (
          <div
            className="rounded-md px-3 py-2 transition-colors duration-300"
            style={{
              backgroundColor: "var(--f1-primary)",
              color: "white",
            }}
          >
            <p className="text-sm font-medium">Calendar intel: Sprint weekend format</p>
          </div>
        )}
      </div>
    </div>
  );
}
