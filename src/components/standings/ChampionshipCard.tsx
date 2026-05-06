"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

export type ChampionshipCardVariant = "drivers" | "constructors";

type ChampionshipCardProps = {
  variant: ChampionshipCardVariant;
  eyebrow: string;
  title: string;
  badges?: ReactNode;
  children: ReactNode;
  /** ms — stagger vs sibling card */
  animationDelayMs?: number;
  className?: string;
};

export default function ChampionshipCard({
  variant,
  eyebrow,
  title,
  badges,
  children,
  animationDelayMs = 0,
  className = "",
}: ChampionshipCardProps) {
  const [hovered, setHovered] = useState(false);
  const isDrivers = variant === "drivers";

  const outerShadow = hovered
    ? "0 0 0 1px color-mix(in srgb, var(--accent-primary) 30%, transparent), 0 28px 72px -28px color-mix(in srgb, var(--accent-primary) 38%, transparent), 0 16px 40px -16px rgba(0, 0, 0, 0.5)"
    : "0 0 0 1px color-mix(in srgb, var(--accent-primary) 14%, transparent), 0 22px 56px -24px color-mix(in srgb, var(--accent-primary) 28%, transparent), 0 10px 32px -14px rgba(0, 0, 0, 0.4)";

  const topLineGradient = isDrivers
    ? "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--accent-primary) 85%, transparent) 22%, var(--accent-primary) 50%, color-mix(in srgb, var(--accent-primary) 85%, transparent) 78%, transparent 100%)"
    : "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--text-primary) 14%, transparent) 35%, color-mix(in srgb, var(--text-primary) 22%, transparent) 50%, color-mix(in srgb, var(--text-primary) 14%, transparent) 65%, transparent 100%)";

  const ambientWash = isDrivers
    ? "radial-gradient(circle, color-mix(in srgb, var(--accent-primary) 26%, transparent) 0%, transparent 68%)"
    : "radial-gradient(circle, color-mix(in srgb, var(--text-primary) 10%, transparent) 0%, transparent 70%)";

  return (
    <section
      className={`standings-card-enter group/card relative rounded-2xl transition-all duration-500 ease-out sm:rounded-3xl ${className}`}
      style={
        {
          "--standings-card-delay": animationDelayMs,
          boxShadow: outerShadow,
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
        } as CSSProperties
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="race-panel-inner-gloss relative overflow-hidden rounded-2xl border px-4 pb-5 pt-5 sm:rounded-3xl sm:px-8 sm:pb-8 sm:pt-7"
        style={{
          borderColor: "color-mix(in srgb, var(--text-primary) 8%, transparent)",
          background:
            "linear-gradient(168deg, color-mix(in srgb, var(--bg-surface) 88%, var(--bg-primary)) 0%, var(--bg-surface) 42%, color-mix(in srgb, var(--bg-surface) 76%, var(--bg-muted)) 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl transition-opacity duration-500 sm:h-72 sm:w-72"
          style={{
            background: ambientWash,
            opacity: hovered ? 1 : 0.72,
          }}
        />

        <div
          className="pointer-events-none absolute left-4 right-4 top-0 h-px sm:left-8 sm:right-8"
          style={{
            background: topLineGradient,
            opacity: hovered ? 1 : 0.88,
            transition: "opacity 0.4s ease",
          }}
        />

        <header className="relative z-10 mb-5 sm:mb-6">
          <p
            className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] sm:text-[11px]"
            style={{ color: "var(--text-tertiary)" }}
          >
            {eyebrow}
          </p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2
              className="text-xl font-bold tracking-tight sm:text-2xl"
              style={{ color: "var(--text-primary)" }}
            >
              {title}
            </h2>
            {badges != null && (
              <div className="flex flex-wrap items-center gap-2">{badges}</div>
            )}
          </div>
        </header>

        <div className="relative z-10">{children}</div>
      </div>
    </section>
  );
}
