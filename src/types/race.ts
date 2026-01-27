export type RaceWeekendFormat = "standard" | "sprint";
export type EventType = "race" | "testing";

export type Race = {
  round: number;
  raceName: string;
  circuitName: string;
  country: string;
  city?: string;
  raceDate: string; // ISO YYYY-MM-DD for race Sunday
  weekendStartDate?: string; // optional ISO date
  timeZone?: string; // IANA tz string
  format: RaceWeekendFormat;
  eventType: "race"; // Always "race" for existing races
};

export type TestingEvent = {
  code: "T1" | "T2" | "T3";
  eventName: string;
  circuitName: string;
  country: string;
  city?: string;
  startDate: string; // ISO YYYY-MM-DD for start date
  endDate: string; // ISO YYYY-MM-DD for end date
  timeZone?: string; // IANA tz string
  eventType: "testing";
};

export type CalendarEvent = Race | TestingEvent;


