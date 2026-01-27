import type { CalendarEvent } from "@/types/race";
import { races2026 } from "./races-2026";
import { testingEvents2026 } from "./testing-events-2026";

// Combine all calendar events (testing + races) and sort by date
export const calendarEvents2026: CalendarEvent[] = [
  ...testingEvents2026,
  ...races2026,
].sort((a, b) => {
  // For testing events, use startDate; for races, use raceDate
  const dateA = a.eventType === "testing" ? a.startDate : a.raceDate;
  const dateB = b.eventType === "testing" ? b.startDate : b.raceDate;
  return dateA.localeCompare(dateB);
});
