"use client";

import { useMemo } from "react";
import type { CalendarEvent, Race } from "@/types/race";

interface SeasonTimelineProps {
  events: CalendarEvent[];
  selectedEventId?: number | string;
  onSelectEvent?: (id: number | string) => void;
}

function isCountingRace(r: Race): boolean {
  return r.championshipRound != null;
}

export default function SeasonTimeline({
  events,
  selectedEventId,
  onSelectEvent,
}: SeasonTimelineProps) {
  const sortedRaces = useMemo(() => {
    return events
      .filter((e): e is Race => e.eventType === "race")
      .sort((a, b) => a.round - b.round);
  }, [events]);

  const countingRaces = useMemo(
    () => sortedRaces.filter(isCountingRace),
    [sortedRaces]
  );

  const totalChampionshipRaces = countingRaces.length;

  const selectedTimelineIndex = useMemo(() => {
    return events.findIndex((ev) => {
      const id = ev.eventType === "race" ? ev.round : ev.code;
      return id === selectedEventId;
    });
  }, [events, selectedEventId]);

  const selectedRace = useMemo((): Race | undefined => {
    if (typeof selectedEventId !== "number") return undefined;
    return sortedRaces.find((r) => r.round === selectedEventId);
  }, [sortedRaces, selectedEventId]);

  const maxChampionshipRoundBeforeSelection = useMemo(() => {
    const ti =
      selectedTimelineIndex >= 0 ? selectedTimelineIndex : 0;
    let max = 0;
    for (let j = 0; j < ti; j++) {
      const e = events[j];
      if (e.eventType === "race" && e.championshipRound != null) {
        max = Math.max(max, e.championshipRound);
      }
    }
    return max;
  }, [events, selectedTimelineIndex]);

  const headline = useMemo(() => {
    if (totalChampionshipRaces === 0) return "";

    if (selectedRace != null && selectedRace.championshipRound != null) {
      const cr = selectedRace.championshipRound;
      const progressPercent = Math.round(
        ((cr - 1) / totalChampionshipRaces) * 100
      );
      return `Round ${cr} of ${totalChampionshipRaces} · Season progress: ${progressPercent}%`;
    }

    if (selectedRace != null && !isCountingRace(selectedRace)) {
      const roundsCompletedBefore = events
        .slice(0, selectedTimelineIndex >= 0 ? selectedTimelineIndex : 0)
        .filter((e) => e.eventType === "race" && e.championshipRound != null)
        .length;
      const pct =
        totalChampionshipRaces > 0
          ? Math.round(
              (roundsCompletedBefore / totalChampionshipRaces) * 100
            )
          : 0;
      return `Not a scoring round · Season progress: ${pct}%`;
    }

    const maxBefore = maxChampionshipRoundBeforeSelection;

    if (maxBefore === 0) {
      return `Pre-season · Season progress: 0%`;
    }

    const progressPercent = Math.round(
      (maxBefore / totalChampionshipRaces) * 100
    );
    return `After Round ${maxBefore} of ${totalChampionshipRaces} · Season progress: ${progressPercent}%`;
  }, [
    selectedRace,
    totalChampionshipRaces,
    events,
    selectedTimelineIndex,
    maxChampionshipRoundBeforeSelection,
  ]);

  const progressFillPct = useMemo(() => {
    if (events.length <= 1) return 100;
    const idx =
      selectedTimelineIndex >= 0 ? selectedTimelineIndex : 0;
    return Math.max(0, Math.min(100, (idx / (events.length - 1)) * 100));
  }, [events.length, selectedTimelineIndex]);

  return (
    <div
      className="race-panel-inner-gloss w-full rounded-2xl border px-3 py-5 sm:rounded-3xl sm:px-5 sm:py-7"
      style={{
        borderColor: "color-mix(in srgb, var(--border-subtle) 85%, var(--accent-primary))",
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--bg-surface) 75%, var(--bg-primary)) 0%, color-mix(in srgb, var(--bg-surface) 92%, var(--bg-muted)) 100%)",
        boxShadow:
          "0 0 40px -18px color-mix(in srgb, var(--accent-primary) 22%, transparent), 0 8px 24px -12px rgba(0, 0, 0, 0.35)",
      }}
    >
      <div className="relative mx-auto max-w-7xl px-1 sm:px-2">
        <p
          className="mb-1 text-center text-[10px] font-bold uppercase tracking-[0.2em] sm:text-[11px]"
          style={{ color: "var(--text-tertiary)" }}
        >
          Season timeline
        </p>
        {headline !== "" && (
          <p
            className="mb-3 text-center text-[11px] font-semibold tabular-nums sm:mb-4 sm:text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            {headline}
          </p>
        )}

        <div className="relative flex min-h-[2.5rem] items-center sm:min-h-[2.75rem]">
          <div
            className="absolute left-4 right-4 top-1/2 h-px -translate-y-1/2 sm:left-7 sm:right-7"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--border-strong) 70%, var(--accent-primary)) 12%, color-mix(in srgb, var(--border-strong) 70%, var(--accent-primary)) 88%, transparent 100%)",
              opacity: 0.4,
              boxShadow:
                "0 0 12px color-mix(in srgb, var(--accent-primary) 20%, transparent)",
            }}
          />

          <div
            className="pointer-events-none absolute left-4 top-1/2 h-0.5 max-w-[calc(100%-2rem)] -translate-y-1/2 overflow-hidden rounded-full sm:left-7 sm:max-w-[calc(100%-3.5rem)]"
            style={{
              width: `${progressFillPct}%`,
              transition: "width 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
              background:
                "linear-gradient(90deg, color-mix(in srgb, var(--accent-primary) 92%, white) 0%, var(--accent-primary) 50%, color-mix(in srgb, var(--accent-primary) 75%, transparent) 100%)",
              boxShadow:
                "0 0 16px color-mix(in srgb, var(--accent-primary) 50%, transparent)",
            }}
            aria-hidden
          />

          <div className="relative flex w-full items-center justify-between">
            {events.map((event, i) => {
              const eventId = event.eventType === "race" ? event.round : event.code;
              const isSelected = selectedEventId === eventId;
              const label =
                event.eventType === "race"
                  ? event.championshipRound != null
                    ? `Round ${event.championshipRound}: ${event.raceName}`
                    : event.raceName
                  : `${event.code}: ${event.eventName}`;
              const isTesting = event.eventType === "testing";
              const race = event.eventType === "race" ? event : null;
              const isCanceledSlot =
                race != null && !isCountingRace(race);

              const activeIdx =
                selectedTimelineIndex >= 0 ? selectedTimelineIndex : 0;

              let isPast = i < activeIdx;
              let isFuture = i > activeIdx;

              if (race != null && isCountingRace(race)) {
                const cr = race.championshipRound!;
                if (selectedRace?.championshipRound != null) {
                  isPast = cr < selectedRace.championshipRound;
                  isFuture = cr > selectedRace.championshipRound;
                } else if (typeof selectedEventId !== "number") {
                  const t = maxChampionshipRoundBeforeSelection;
                  isPast = cr <= t;
                  isFuture = cr > t;
                }
              }

              const baseSize = isTesting
                ? "h-2 w-2 sm:h-2.5 sm:w-2.5"
                : "h-2.5 w-2.5 sm:h-3 sm:w-3";
              const activeScale =
                "scale-[1.9] sm:scale-[1.85] f1-timeline-dot--active";
              const idleScale = "scale-100";

              let opacity = 1;
              if (isCanceledSlot && !isSelected) {
                opacity = 0.32;
              } else if (!isSelected) {
                if (isFuture) opacity = isTesting ? 0.42 : 0.36;
                else if (isPast) opacity = isTesting ? 0.68 : 0.78;
              }

              let bg = "var(--accent-muted)";
              if (isSelected) {
                bg = "var(--accent-primary)";
              } else if (isCanceledSlot) {
                bg =
                  "color-mix(in srgb, var(--text-tertiary) 55%, var(--bg-muted))";
              } else if (isPast && race != null && isCountingRace(race)) {
                bg =
                  "color-mix(in srgb, var(--accent-primary) 58%, var(--accent-muted))";
              } else if (isPast && isTesting) {
                bg =
                  "color-mix(in srgb, var(--accent-primary) 35%, var(--accent-muted))";
              }

              let boxShadow: string | undefined;
              if (isCanceledSlot && !isSelected) {
                boxShadow =
                  "0 0 0 1px dashed color-mix(in srgb, var(--text-tertiary) 45%, transparent)";
              } else if (isPast && race != null && isCountingRace(race)) {
                boxShadow =
                  "0 0 0 1px color-mix(in srgb, var(--accent-primary) 45%, transparent), 0 0 10px -2px color-mix(in srgb, var(--accent-primary) 30%, transparent)";
              } else if (!isSelected) {
                boxShadow =
                  "0 0 0 1px color-mix(in srgb, var(--bg-primary) 80%, transparent)";
              }

              return (
                <button
                  key={event.eventType === "race" ? event.round : event.code}
                  type="button"
                  onClick={() => onSelectEvent?.(eventId)}
                  className="relative z-10 flex flex-col items-center transition-transform duration-300 hover:scale-110"
                  aria-label={label}
                  aria-current={isSelected ? "true" : undefined}
                >
                  <span
                    className={`rounded-full transition-all duration-300 ${baseSize} ${
                      isSelected ? activeScale : idleScale
                    }`}
                    style={{
                      backgroundColor: bg,
                      opacity,
                      ...(boxShadow != null ? { boxShadow } : {}),
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
