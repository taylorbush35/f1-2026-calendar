"use client";

import { useState } from "react";
import type { CalendarEvent, Race } from "@/types/race";

interface RacePanelProps {
  event: CalendarEvent | null;
  allEvents?: CalendarEvent[];
  onNavigate?: (eventId: number | string) => void;
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

export default function RacePanel({ event, allEvents = [], onNavigate }: RacePanelProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  if (!event) {
    return null;
  }

  // Find current event index and determine prev/next
  const currentIndex = allEvents.findIndex((e) => {
    if (e.eventType === "race" && event.eventType === "race") {
      return e.round === event.round;
    }
    if (e.eventType === "testing" && event.eventType === "testing") {
      return e.code === event.code;
    }
    return false;
  });

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allEvents.length - 1;

  const handlePrevious = () => {
    if (!hasPrevious || !onNavigate) return;
    const prevEvent = allEvents[currentIndex - 1];
    const prevId = prevEvent.eventType === "race" ? prevEvent.round : prevEvent.code;
    onNavigate(prevId);
  };

  const handleNext = () => {
    if (!hasNext || !onNavigate) return;
    const nextEvent = allEvents[currentIndex + 1];
    const nextId = nextEvent.eventType === "race" ? nextEvent.round : nextEvent.code;
    onNavigate(nextId);
  };

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateRange = (startDate: string, endDate: string): string => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} – ${end}`;
  };

  const badges = event.eventType === "race" ? getRaceBadges(event) : [];

  return (
    <div
      className="group relative rounded-lg border px-4 py-4 sm:px-8 sm:py-6 transition-all duration-[180ms] ease-out"
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
      {/* Navigation arrows */}
      {onNavigate && (
        <>
          {/* Left arrow */}
          <button
            onClick={handlePrevious}
            disabled={!hasPrevious}
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              backgroundColor: hasPrevious ? "rgba(195, 0, 0, 0.08)" : "transparent",
              color: "var(--accent-primary)",
              opacity: hasPrevious ? 1 : 0.3,
            }}
            onMouseEnter={(e) => {
              if (hasPrevious) {
                e.currentTarget.style.backgroundColor = "rgba(195, 0, 0, 0.15)";
                e.currentTarget.style.transform = "scale(1.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (hasPrevious) {
                e.currentTarget.style.backgroundColor = "rgba(195, 0, 0, 0.08)";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
            aria-label="Previous event"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Right arrow */}
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              backgroundColor: hasNext ? "rgba(195, 0, 0, 0.08)" : "transparent",
              color: "var(--accent-primary)",
              opacity: hasNext ? 1 : 0.3,
            }}
            onMouseEnter={(e) => {
              if (hasNext) {
                e.currentTarget.style.backgroundColor = "rgba(195, 0, 0, 0.15)";
                e.currentTarget.style.transform = "scale(1.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (hasNext) {
                e.currentTarget.style.backgroundColor = "rgba(195, 0, 0, 0.08)";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
            aria-label="Next event"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 5L12.5 10L7.5 15"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}
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
      <div className="relative pl-4 sm:pl-6">
        {/* Round/Code label and Badges */}
        <div className="mb-1 flex items-center gap-3">
          <div
            className="text-xs font-medium uppercase tracking-wide transition-colors duration-300"
            style={{ color: "var(--text-tertiary)" }}
          >
            {event.eventType === "race" ? `Round ${event.round}` : event.code}
          </div>
          
          {event.eventType === "testing" && (
            <span
              className="rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide transition-all duration-[180ms] ease-out"
              style={{
                borderColor: "var(--accent-primary)",
                color: "var(--accent-primary)",
                backgroundColor: "transparent",
                boxShadow: isHovered 
                  ? "0 0 0 1px var(--accent-primary), 0 0 8px rgba(195, 0, 0, 0.2)" 
                  : "none",
                opacity: isHovered ? 1 : 0.9,
              }}
            >
              Pre-Season Testing
            </span>
          )}
          
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
          className="mb-2 sm:mb-3 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-300"
          style={{ color: "var(--text-primary)" }}
        >
          {event.eventType === "race" ? event.raceName : event.eventName}
        </h2>

        {/* Subhead: Circuit · Location */}
        <p
          className="mb-4 text-lg transition-colors duration-300"
          style={{ color: "var(--text-secondary)" }}
        >
          {event.circuitName} · {event.city && `${event.city}, `}
          {event.country}
        </p>

        {/* Date */}
        <p
          className="text-sm transition-colors duration-300"
          style={{ color: "var(--text-tertiary)" }}
        >
          {event.eventType === "race" 
            ? formatDate(event.raceDate)
            : formatDateRange(event.startDate, event.endDate)
          }
        </p>
      </div>
    </div>
  );
}
