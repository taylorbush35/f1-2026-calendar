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
    <div className="w-full py-8" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="relative mx-auto max-w-7xl px-4">
        {/* Timeline line */}
        <div
          className="absolute left-4 right-4 top-1/2 h-0.5 -translate-y-1/2 transition-colors duration-300"
          style={{ backgroundColor: "var(--text-secondary)", opacity: 0.3 }}
        />

        {/* Timeline dots */}
        <div className="relative flex items-center justify-between">
          {events.map((event) => {
            const eventId = event.eventType === "race" ? event.round : event.code;
            const isSelected = selectedEventId === eventId;
            const label = event.eventType === "race" 
              ? `Round ${event.round}: ${event.raceName}`
              : `${event.code}: ${event.eventName}`;
            
            return (
              <button
                key={event.eventType === "race" ? event.round : event.code}
                onClick={() => onSelectEvent?.(eventId)}
                className="relative z-10 flex flex-col items-center transition-all duration-300 hover:scale-110"
                aria-label={label}
              >
                <div
                  className={`rounded-full transition-all duration-300 ${
                    event.eventType === "testing" ? "h-2.5 w-2.5" : "h-3 w-3"
                  }`}
                  style={{
                    backgroundColor: isSelected
                      ? "var(--accent-primary)"
                      : "var(--accent-muted)",
                    transform: isSelected ? "scale(1.5)" : "scale(1)",
                    boxShadow: isSelected
                      ? "0 0 0 2px var(--bg-primary), 0 0 0 4px var(--accent-primary)"
                      : "none",
                    opacity: event.eventType === "testing" ? 0.85 : 1,
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
