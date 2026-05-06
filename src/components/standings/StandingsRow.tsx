"use client";

import type { CSSProperties } from "react";

type RowStyle = CSSProperties & { "--standings-stagger"?: number };

type StandingsRowProps = {
  position: number;
  points: number;
  maxPoints: number;
  staggerMs: number;
  isLeader: boolean;
  primary: string;
  secondary?: string;
  accent: "drivers" | "constructors";
};

export default function StandingsRow({
  position,
  points,
  maxPoints,
  staggerMs,
  isLeader,
  primary,
  secondary,
  accent,
}: StandingsRowProps) {
  const ratio = maxPoints > 0 ? points / maxPoints : 0;
  const barWidthPct = Math.min(100, Math.max(ratio * 100, points > 0 ? 6 : 2));

  const barBg =
    accent === "drivers"
      ? "linear-gradient(90deg, color-mix(in srgb, var(--accent-primary) 55%, transparent) 0%, color-mix(in srgb, var(--accent-primary) 25%, transparent) 100%)"
      : "linear-gradient(90deg, color-mix(in srgb, var(--text-primary) 18%, transparent) 0%, color-mix(in srgb, var(--text-primary) 8%, transparent) 100%)";

  const rowBg = isLeader
    ? "linear-gradient(90deg, color-mix(in srgb, var(--accent-primary) 12%, var(--bg-primary)) 0%, color-mix(in srgb, var(--bg-surface) 55%, var(--bg-primary)) 48%, var(--bg-primary) 100%)"
    : "linear-gradient(180deg, color-mix(in srgb, var(--bg-muted) 35%, var(--bg-primary)) 0%, var(--bg-primary) 100%)";

  const rowBorder = isLeader
    ? "color-mix(in srgb, var(--accent-primary) 35%, transparent)"
    : "color-mix(in srgb, var(--text-primary) 8%, transparent)";

  const rowGlow = isLeader
    ? "0 0 24px -8px color-mix(in srgb, var(--accent-primary) 45%, transparent), inset 3px 0 0 0 var(--accent-primary)"
    : undefined;

  const rowStyle: RowStyle = {
    "--standings-stagger": staggerMs,
    background: rowBg,
    borderColor: rowBorder,
    boxShadow: rowGlow,
  };

  return (
    <div
      className="standings-row-enter standings-row-interactive group/row flex items-center gap-3 rounded-xl border px-3 py-3 transition-all duration-300 sm:gap-4 sm:px-4 sm:py-3.5"
      style={rowStyle}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold tabular-nums transition-all duration-300 sm:h-9 sm:w-9 sm:text-base"
        style={{
          color: "var(--accent-primary)",
          backgroundColor: "color-mix(in srgb, var(--accent-primary) 14%, transparent)",
          boxShadow: isLeader
            ? "0 0 16px -4px color-mix(in srgb, var(--accent-primary) 55%, transparent)"
            : "0 0 12px -6px color-mix(in srgb, var(--accent-primary) 25%, transparent)",
        }}
      >
        {position}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className="truncate text-sm font-semibold sm:text-base"
            style={{ color: "var(--text-primary)" }}
          >
            {primary}
          </p>
          {isLeader && (
            <span
              className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white sm:text-[10px]"
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in srgb, var(--accent-primary) 88%, white) 0%, var(--accent-primary) 100%)",
                boxShadow: "0 0 14px -4px color-mix(in srgb, var(--accent-primary) 60%, transparent)",
              }}
            >
              Leader
            </span>
          )}
        </div>
        {secondary != null && secondary !== "" && (
          <p
            className="mt-0.5 truncate text-xs sm:text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {secondary}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5 text-right">
        <span
          className="text-sm font-bold tabular-nums whitespace-nowrap sm:text-base"
          style={{ color: "var(--text-primary)" }}
        >
          {points} pts
        </span>
        <div
          className="h-1 w-[min(4.5rem,18vw)] overflow-hidden rounded-full sm:w-20"
          style={{ backgroundColor: "color-mix(in srgb, var(--text-primary) 6%, transparent)" }}
          aria-hidden
        >
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-out"
            style={{
              width: `${barWidthPct}%`,
              background: barBg,
              opacity: 0.85,
            }}
          />
        </div>
      </div>
    </div>
  );
}
