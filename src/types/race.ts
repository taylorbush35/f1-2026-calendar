export type RaceWeekendFormat = "standard" | "sprint";

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
};


