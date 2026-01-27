"use client";

import { useState, useMemo } from "react";
import { races2026 } from "@/data/races-2026";
import { testingEvents2026 } from "@/data/testing-events-2026";
import { calendarEvents2026 } from "@/data/calendar-events-2026";
import type { CalendarEvent } from "@/types/race";
import ThemeToggle from "@/components/ThemeToggle";
import GlobeMap from "@/components/GlobeMap";
import SeasonTimeline from "@/components/SeasonTimeline";
import RacePanel from "@/components/RacePanel";

export default function Home() {
  // Selection state: can be a race round (number) or testing code (string like "T1")
  const [selectedEventId, setSelectedEventId] = useState<number | string>(
    races2026[0]?.round || 1
  );

  const selectedEvent = useMemo(
    () => {
      if (typeof selectedEventId === "number") {
        return races2026.find((race) => race.round === selectedEventId) || null;
      } else {
        return testingEvents2026.find((test) => test.code === selectedEventId) || null;
      }
    },
    [selectedEventId]
  );

  const handleSelectEvent = (id: number | string) => {
    setSelectedEventId(id);
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: "var(--bg-primary)" }}>
      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <div className="mb-2 sm:mb-4 flex items-center justify-between gap-2">
            <h1 className="text-2xl sm:text-4xl font-bold transition-colors duration-300" style={{ color: "var(--text-primary)" }}>
              F1 2026 Calendar
            </h1>
            <ThemeToggle />
          </div>
          <div className="mb-2 flex flex-col justify-between gap-2 sm:gap-4 sm:flex-row sm:items-end">
            <p className="text-sm sm:text-lg transition-colors duration-300" style={{ color: "var(--text-secondary)" }}>
              A product-first view of the season — weekends, formats, and the
              rhythm of the calendar.
            </p>
            <div className="text-xs sm:text-sm transition-colors duration-300" style={{ color: "var(--text-secondary)" }}>
              {races2026.length} races, {testingEvents2026.length} testing events
            </div>
          </div>
        </div>

        {/* Hero: Globe/Map view */}
        <div className="mb-4 sm:mb-8 overflow-hidden rounded-lg border transition-colors duration-300" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="h-[280px] sm:h-[400px] md:h-[600px] w-full">
            <GlobeMap
              races={races2026}
              testingEvents={testingEvents2026}
              selectedEventId={selectedEventId}
              onSelectEvent={handleSelectEvent}
            />
          </div>
        </div>

        {/* Event panel */}
        <div className="mb-4 sm:mb-8">
          <RacePanel 
            event={selectedEvent} 
            allEvents={calendarEvents2026}
            onNavigate={handleSelectEvent}
          />
        </div>

        {/* Timeline scrubber */}
        <SeasonTimeline
          events={calendarEvents2026}
          selectedEventId={selectedEventId}
          onSelectEvent={handleSelectEvent}
        />
      </main>
    </div>
  );
}
