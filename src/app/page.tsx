"use client";

import { useState, useMemo } from "react";
import { races2026 } from "@/data/races-2026";
import ThemeToggle from "@/components/ThemeToggle";
import GlobeMap from "@/components/GlobeMap";
import SeasonTimeline from "@/components/SeasonTimeline";
import RacePanel from "@/components/RacePanel";

export default function Home() {
  // Step 2: Wire up selection state
  const [selectedRaceId, setSelectedRaceId] = useState<number>(races2026[0]?.round || 1);

  const selectedRace = useMemo(
    () => races2026.find((race) => race.round === selectedRaceId) || null,
    [selectedRaceId]
  );

  const handleSelectRace = (round: number) => {
    setSelectedRaceId(round);
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: "var(--bg-primary)" }}>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold transition-colors duration-300" style={{ color: "var(--text-primary)" }}>
                F1 2026 Calendar
              </h1>
              <ThemeToggle />
            </div>
            <p className="mt-2 text-lg transition-colors duration-300" style={{ color: "var(--text-secondary)" }}>
              A product-first view of the season — weekends, formats, and the
              rhythm of the calendar.
            </p>
          </div>
          <div className="text-sm transition-colors duration-300" style={{ color: "var(--text-secondary)" }}>
            {races2026.length} races loaded
          </div>
        </div>

        {/* Hero: Globe/Map view */}
        <div className="mb-8 overflow-hidden rounded-lg border transition-colors duration-300" style={{ borderColor: "var(--border-subtle)", minHeight: "600px" }}>
          <GlobeMap
            races={races2026}
            selectedRaceId={selectedRaceId}
            onSelectRace={handleSelectRace}
          />
        </div>

        {/* Race panel */}
        <div className="mb-8">
          <RacePanel race={selectedRace} />
        </div>

        {/* Timeline scrubber */}
        <SeasonTimeline
          races={races2026}
          selectedRaceId={selectedRaceId}
          onSelectRace={handleSelectRace}
        />
      </main>
    </div>
  );
}
