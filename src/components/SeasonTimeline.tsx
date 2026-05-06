"use client";

import type { CalendarEvent } from "@/types/race";

interface SeasonTimelineProps {
  events: CalendarEvent[];
  selectedEventId?: number | string;
  onSelectEvent?: (id: number | string) => void;
}

export default function SeasonTimeline({
  events,
  selectedEventId,
  onSelectEvent,
}: SeasonTimelineProps) {
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
          className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.2em] sm:mb-4 sm:text-[11px]"
          style={{ color: "var(--text-tertiary)" }}
        >
          Season timeline
        </p>

        <div className="relative flex min-h-[2.25rem] items-center sm:min-h-[2.5rem]">
          {/* Track */}
          <div
            className="absolute left-4 right-4 top-1/2 h-px -translate-y-1/2 sm:left-7 sm:right-7"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--border-strong) 70%, var(--accent-primary)) 12%, color-mix(in srgb, var(--border-strong) 70%, var(--accent-primary)) 88%, transparent 100%)",
              opacity: 0.55,
              boxShadow:
                "0 0 12px color-mix(in srgb, var(--accent-primary) 25%, transparent)",
            }}
          />

          <div className="relative flex w-full items-center justify-between">
            {events.map((event) => {
              const eventId = event.eventType === "race" ? event.round : event.code;
              const isSelected = selectedEventId === eventId;
              const label =
                event.eventType === "race"
                  ? `Round ${event.round}: ${event.raceName}`
                  : `${event.code}: ${event.eventName}`;
              const isTesting = event.eventType === "testing";

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
                    className={`rounded-full transition-all duration-300 ${
                      isTesting ? "h-2 w-2 sm:h-2.5 sm:w-2.5" : "h-2.5 w-2.5 sm:h-3 sm:w-3"
                    } ${isSelected ? "f1-timeline-dot--active scale-[1.7] sm:scale-[1.65]" : "scale-100"}`}
                    style={{
                      backgroundColor: isSelected
                        ? "var(--accent-primary)"
                        : "var(--accent-muted)",
                      opacity: isTesting && !isSelected ? 0.75 : 1,
                      boxShadow: !isSelected
                        ? "0 0 0 1px color-mix(in srgb, var(--bg-primary) 80%, transparent)"
                        : undefined,
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
