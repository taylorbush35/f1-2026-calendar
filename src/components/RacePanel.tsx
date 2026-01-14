"use client";

import { useState } from "react";
import type { Race } from "@/types/race";

interface RacePanelProps {
  race: Race | null;
}

// Helper to determine race badges based on race properties
// TODO: Extend with race times, distances, and calendar logic for NIGHT, BACK-TO-BACK, LONG HAUL
function getRaceBadges(race: Race): string[] {
  const badges: string[] = [];
  
  // Sprint format (current implementation)
  if (race.format === "sprint") {
    badges.push("SPRINT");
  }
  
  // Future: Add NIGHT detection based on race time
  // if (race.raceTime && isNightRace(race.raceTime)) {
  //   badges.push("NIGHT");
  // }
  
  // Future: Add BACK-TO-BACK detection based on calendar proximity
  // if (isBackToBack(race, allRaces)) {
  //   badges.push("BACK-TO-BACK");
  // }
  
  // Future: Add LONG HAUL detection based on travel distance
  // if (isLongHaul(race, previousRace)) {
  //   badges.push("LONG HAUL");
  // }
  
  return badges;
}

export default function RacePanel({ race }: RacePanelProps) {
  const [isHovered, setIsHovered] = useState(false);
  
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

  const badges = getRaceBadges(race);

  return (
    <div
      className="group relative rounded-lg border px-8 py-6 transition-all duration-[180ms] ease-out"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
        boxShadow: isHovered
          ? "0 0 0 1px var(--border-subtle), 0 4px 12px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)"
          : "0 0 0 1px var(--border-subtle), 0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        transform: isHovered ? "translateY(-1px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left accent rail */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg transition-all duration-[180ms] ease-out"
        style={{
          backgroundColor: isHovered ? "var(--accent-primary)" : "var(--accent-primary)",
          opacity: isHovered ? 1 : 0.85,
          boxShadow: isHovered ? "0 0 8px var(--accent-primary)" : "none",
        }}
      />

      {/* Connector dot */}
      <div
        className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full transition-all duration-[180ms] ease-out"
        style={{
          backgroundColor: "var(--accent-primary)",
          boxShadow: isHovered
            ? "0 0 0 2px var(--bg-surface), 0 0 8px var(--accent-primary)"
            : "0 0 0 2px var(--bg-surface)",
        }}
      />

      {/* Content */}
      <div className="relative pl-6">
        {/* Round label and Badges */}
        <div className="mb-1 flex items-center gap-3">
          <div
            className="text-xs font-medium uppercase tracking-wide transition-colors duration-300"
            style={{ color: "var(--text-tertiary)" }}
          >
            Round {race.round}
          </div>
          
          {/* Badge cluster */}
          {badges.length > 0 && (
            <div className="flex items-center gap-2">
              {badges.map((badge) => {
                // Sprint badges are red by default; other badges are neutral
                const isSprint = badge === "SPRINT";
                const isActiveBadge = isSprint;
                
                return (
                  <span
                    key={badge}
                    className="rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide transition-all duration-[180ms] ease-out"
                    style={{
                      borderColor: isActiveBadge ? "var(--accent-primary)" : "var(--border-subtle)",
                      color: isActiveBadge ? "var(--accent-primary)" : "var(--text-tertiary)",
                      backgroundColor: "transparent",
                      boxShadow: isActiveBadge && isHovered 
                        ? "0 0 0 1px var(--accent-primary), 0 0 8px rgba(195, 0, 0, 0.2)" 
                        : "none",
                      opacity: isActiveBadge && isHovered ? 1 : isActiveBadge ? 0.9 : 1,
                    }}
                  >
                    {badge}
                  </span>
                );
              })}
            </div>
          )}
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
