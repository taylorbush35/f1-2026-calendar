"use client";

import { useState } from "react";
import type { CalendarEvent, Race } from "@/types/race";

interface RacePanelProps {
  event: CalendarEvent | null;
  allEvents?: CalendarEvent[];
  onNavigate?: (eventId: number | string) => void;
}

function getRaceBadges(race: Race): string[] {
  const badges: string[] = [];
  if (race.format === "sprint") {
    badges.push("SPRINT");
  }
  return badges;
}

function panelContentKey(event: CalendarEvent): string {
  return event.eventType === "race"
    ? `race-${event.round}`
    : `test-${event.code}`;
}

export default function RacePanel({ event, allEvents = [], onNavigate }: RacePanelProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (!event) {
    return null;
  }

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
  const isCanceledRace = event.eventType === "race" && event.canceled;
  const showWinner =
    event.eventType === "race" && Boolean(event.winner) && !isCanceledRace;

  const outerGlow = isCanceledRace
    ? isHovered
      ? "0 0 0 1px color-mix(in srgb, var(--accent-primary) 55%, transparent), 0 0 48px -8px color-mix(in srgb, var(--accent-primary) 50%, transparent), 0 16px 40px -12px rgba(0, 0, 0, 0.5)"
      : "0 0 0 1px color-mix(in srgb, var(--accent-primary) 40%, transparent), 0 0 36px -10px color-mix(in srgb, var(--accent-primary) 40%, transparent), 0 12px 32px -12px rgba(0, 0, 0, 0.45)"
    : isHovered
      ? "0 0 0 1px color-mix(in srgb, var(--accent-primary) 32%, transparent), 0 28px 72px -28px color-mix(in srgb, var(--accent-primary) 42%, transparent), 0 16px 40px -16px rgba(0, 0, 0, 0.55)"
      : "0 0 0 1px color-mix(in srgb, var(--accent-primary) 16%, transparent), 0 22px 56px -24px color-mix(in srgb, var(--accent-primary) 32%, transparent), 0 10px 32px -14px rgba(0, 0, 0, 0.4)";

  return (
    <div
      className="group relative rounded-2xl sm:rounded-3xl transition-all duration-500 ease-out"
      style={{
        boxShadow: outerGlow,
        transform: isHovered ? "translateY(-3px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="race-panel-inner-gloss relative overflow-hidden rounded-2xl sm:rounded-3xl px-4 pb-5 pt-5 sm:px-10 sm:pb-8 sm:pt-7"
        style={{
          background:
            "linear-gradient(168deg, color-mix(in srgb, var(--bg-surface) 88%, var(--bg-primary)) 0%, var(--bg-surface) 42%, color-mix(in srgb, var(--bg-surface) 75%, var(--bg-muted)) 100%)",
        }}
      >
        {/* Top cinematic accent */}
        <div
          className="pointer-events-none absolute left-4 right-4 top-0 h-px sm:left-8 sm:right-8"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--accent-primary) 85%, transparent) 22%, var(--accent-primary) 50%, color-mix(in srgb, var(--accent-primary) 85%, transparent) 78%, transparent 100%)",
            opacity: isHovered ? 1 : 0.85,
            transition: "opacity 0.4s ease",
          }}
        />

        {/* Ambient red wash */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--accent-primary) 28%, transparent) 0%, transparent 70%)",
            opacity: isHovered ? 0.95 : 0.55,
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--accent-primary) 12%, transparent) 0%, transparent 68%)",
            opacity: 0.5,
          }}
        />

        {onNavigate && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              disabled={!hasPrevious}
              className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 enabled:hover:scale-110 enabled:active:scale-95 sm:left-4 sm:h-11 sm:w-11 disabled:cursor-not-allowed disabled:opacity-25"
              style={{
                backgroundColor: "color-mix(in srgb, var(--bg-surface) 55%, transparent)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "var(--accent-primary)",
                boxShadow: hasPrevious
                  ? "0 0 24px -8px color-mix(in srgb, var(--accent-primary) 45%, transparent)"
                  : undefined,
              }}
              aria-label="Previous event"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 15L7.5 10L12.5 5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!hasNext}
              className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 enabled:hover:scale-110 enabled:active:scale-95 sm:right-4 sm:h-11 sm:w-11 disabled:cursor-not-allowed disabled:opacity-25"
              style={{
                backgroundColor: "color-mix(in srgb, var(--bg-surface) 55%, transparent)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "var(--accent-primary)",
                boxShadow: hasNext
                  ? "0 0 24px -8px color-mix(in srgb, var(--accent-primary) 45%, transparent)"
                  : undefined,
              }}
              aria-label="Next event"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 5L12.5 10L7.5 15"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}

        <div
          key={panelContentKey(event)}
          className="race-panel-animate-in relative z-10 pl-9 pr-9 sm:pl-12 sm:pr-12"
        >
          <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4 sm:gap-3">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              {event.eventType === "race" ? `Round ${event.round}` : event.code}
            </span>

            {event.eventType === "testing" && (
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white sm:px-3 sm:text-[11px]"
                style={{
                  background:
                    "linear-gradient(180deg, color-mix(in srgb, var(--accent-primary) 92%, white) 0%, var(--accent-primary) 100%)",
                  boxShadow:
                    "0 0 20px -6px color-mix(in srgb, var(--accent-primary) 65%, transparent), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)",
                }}
              >
                Pre-Season Testing
              </span>
            )}

            {isCanceledRace && (
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white sm:px-3 sm:text-[11px]"
                style={{
                  backgroundColor: "var(--accent-primary)",
                  boxShadow: "0 0 28px -6px color-mix(in srgb, var(--accent-primary) 70%, transparent)",
                }}
              >
                Removed from calendar
              </span>
            )}

            {badges.map((badge) =>
              badge === "SPRINT" ? (
                <span
                  key={badge}
                  className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white sm:px-3.5 sm:py-1.5 sm:text-[11px]"
                  style={{
                    background:
                      "linear-gradient(180deg, color-mix(in srgb, var(--accent-primary) 88%, white) 0%, color-mix(in srgb, var(--accent-primary) 92%, black) 100%)",
                    boxShadow:
                      "0 0 22px -5px color-mix(in srgb, var(--accent-primary) 70%, transparent), inset 0 1px 0 0 rgba(255, 255, 255, 0.22)",
                  }}
                >
                  Sprint
                </span>
              ) : (
                <span
                  key={badge}
                  className="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  style={{
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-tertiary)",
                  }}
                >
                  {badge}
                </span>
              )
            )}
          </div>

          <h2
            className="mb-2 text-2xl font-bold leading-[1.1] tracking-tight sm:mb-3 sm:text-3xl md:text-4xl"
            style={{
              color: isCanceledRace ? "var(--text-secondary)" : "var(--text-primary)",
              textDecoration: isCanceledRace ? "line-through" : undefined,
              opacity: isCanceledRace ? 0.72 : 1,
            }}
          >
            {event.eventType === "race" ? event.raceName : event.eventName}
          </h2>

          <p
            className="mb-1 text-sm font-medium leading-relaxed sm:text-base md:text-lg"
            style={{
              color: "var(--text-secondary)",
              textDecoration: isCanceledRace ? "line-through" : undefined,
              opacity: isCanceledRace ? 0.65 : 1,
            }}
          >
            {event.circuitName}
            {" · "}
            {event.city ? `${event.city}, ${event.country}` : event.country}
          </p>

          <p
            className="text-xs font-medium sm:text-sm"
            style={{
              color: "var(--text-tertiary)",
              textDecoration: isCanceledRace ? "line-through" : undefined,
              opacity: isCanceledRace ? 0.65 : 1,
            }}
          >
            {event.eventType === "race" && isCanceledRace && (
              <span className="mr-2" style={{ color: "var(--text-secondary)" }}>
                Originally planned:
              </span>
            )}
            {event.eventType === "race"
              ? formatDate(event.raceDate)
              : formatDateRange(event.startDate, event.endDate)}
          </p>

          {showWinner && (
            <div className="relative mt-7 sm:mt-9">
              <div
                className="pointer-events-none absolute inset-0 -mx-2 rounded-xl opacity-[0.35] sm:-mx-3"
                style={{
                  backgroundImage: `
                    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
                    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                    repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(255,255,255,0.04) 5px, rgba(255,255,255,0.04) 6px)
                  `,
                  backgroundSize: "14px 14px, 14px 14px, auto",
                  maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
                }}
              />
              <div
                className="relative border-t pt-6 sm:pt-7"
                style={{
                  borderColor: "color-mix(in srgb, var(--border-subtle) 65%, transparent)",
                }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.28em] sm:text-[11px]"
                  style={{ color: "var(--accent-primary)" }}
                >
                  Race Winner
                </p>
                <div className="race-winner-animate-in mt-3 flex flex-col gap-1 sm:mt-4">
                  <p
                    className="text-2xl font-bold leading-none tracking-tight sm:text-3xl md:text-4xl"
                    style={{
                      background: `linear-gradient(105deg, var(--text-primary) 0%, var(--text-primary) 55%, color-mix(in srgb, var(--accent-primary) 85%, var(--text-primary)) 100%)`,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                      filter: "drop-shadow(0 0 28px color-mix(in srgb, var(--accent-primary) 35%, transparent))",
                    }}
                  >
                    {event.winner}
                  </p>
                  {event.winnerHighlight && (
                    <p
                      className="text-sm font-semibold sm:text-base"
                      style={{ color: "var(--accent-primary)" }}
                    >
                      {event.winnerHighlight}
                    </p>
                  )}
                  <div
                    className="mt-3 h-0.5 max-w-[12rem] rounded-full sm:mt-4"
                    style={{
                      background:
                        "linear-gradient(90deg, var(--accent-primary), color-mix(in srgb, var(--accent-primary) 15%, transparent))",
                      boxShadow: "0 0 16px color-mix(in srgb, var(--accent-primary) 45%, transparent)",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
