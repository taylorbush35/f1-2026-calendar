"use client";

import { useState, type ReactNode } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import NavigationMenu from "@/components/NavigationMenu";
import SitePageTitle from "@/components/SitePageTitle";
import ChampionshipCard from "@/components/standings/ChampionshipCard";
import StandingsRow from "@/components/standings/StandingsRow";
import {
  constructorsStandings2026,
  driversStandings2026,
} from "@/data/standings-2026";
import { getLatestCompletedChampionshipRound } from "@/lib/standings-meta";

type StandingsTab = "drivers" | "constructors";

function MetaBadge({ children }: { children: ReactNode }) {
  return (
    <span
      className="rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider sm:text-[10px]"
      style={{
        borderColor: "color-mix(in srgb, var(--text-primary) 12%, transparent)",
        color: "var(--text-tertiary)",
        backgroundColor: "color-mix(in srgb, var(--bg-muted) 80%, transparent)",
      }}
    >
      {children}
    </span>
  );
}

function StandingsUpdateBanner({ round }: { round: number }) {
  return (
    <div
      className="race-panel-inner-gloss inline-flex max-w-full overflow-hidden rounded-lg border shadow-lg transition-shadow duration-300"
      style={{
        borderColor: "color-mix(in srgb, var(--text-primary) 10%, transparent)",
        boxShadow:
          "0 6px 28px -14px color-mix(in srgb, var(--accent-primary) 40%, transparent), 0 0 0 1px color-mix(in srgb, var(--accent-primary) 14%, transparent)",
      }}
      role="status"
      aria-label={`Standings reflect results through round ${round}`}
    >
      <div
        className="w-1 shrink-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--accent-primary) 92%, white) 0%, var(--accent-primary) 100%)",
        }}
        aria-hidden
      />
      <div
        className="flex items-center px-3 py-2 sm:px-3.5 sm:py-2"
        style={{
          background:
            "linear-gradient(168deg, color-mix(in srgb, var(--bg-surface) 92%, var(--bg-primary)) 0%, var(--bg-surface) 100%)",
        }}
      >
        <span
          className="text-xs font-bold tabular-nums sm:text-sm"
          style={{ color: "var(--text-primary)" }}
        >
          Updated through Round {round}
        </span>
      </div>
    </div>
  );
}

export default function StandingsPage() {
  const [activeTab, setActiveTab] = useState<StandingsTab>("drivers");
  const latestRound = getLatestCompletedChampionshipRound();

  const maxDriverPoints = driversStandings2026[0]?.points ?? 1;
  const maxConstructorPoints = constructorsStandings2026[0]?.points ?? 1;

  const driverRowBaseStagger = 100;
  const constructorRowBaseStagger = 260;

  return (
    <div
      className="relative min-h-screen overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Depth: vignette + ambient glow (calendar / race-panel family) */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 65% at 50% -5%, color-mix(in srgb, var(--accent-primary) 14%, transparent) 0%, transparent 52%), radial-gradient(ellipse 70% 55% at 80% 100%, color-mix(in srgb, var(--accent-primary) 8%, transparent) 0%, transparent 45%), radial-gradient(ellipse 120% 80% at 50% 50%, transparent 40%, color-mix(in srgb, var(--bg-primary) 72%, black) 100%)",
        }}
        aria-hidden
      />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-4 sm:mb-8">
          <div className="mb-2 sm:mb-4 flex items-center justify-between gap-2">
            <SitePageTitle pageLabel="Standings" />
            <div className="flex items-center gap-2">
              <NavigationMenu />
              <ThemeToggle />
            </div>
          </div>
          <div className="mb-2 flex flex-col justify-between gap-3 sm:gap-4 sm:flex-row sm:items-end">
            <p
              className="text-sm transition-colors duration-300 sm:text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              Championship order — drivers and constructors in one place, with the
              same clarity as the calendar.
            </p>
            {latestRound != null && (
              <div className="shrink-0 sm:self-end">
                <StandingsUpdateBanner round={latestRound} />
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setActiveTab("drivers")}
            className="rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300"
            style={{
              backgroundColor:
                activeTab === "drivers"
                  ? "var(--accent-primary)"
                  : "color-mix(in srgb, var(--bg-surface) 85%, transparent)",
              color: activeTab === "drivers" ? "white" : "var(--text-primary)",
              borderColor:
                activeTab === "drivers"
                  ? "color-mix(in srgb, var(--accent-primary) 40%, transparent)"
                  : "color-mix(in srgb, var(--text-primary) 10%, transparent)",
              boxShadow:
                activeTab === "drivers"
                  ? "0 0 24px -8px color-mix(in srgb, var(--accent-primary) 55%, transparent)"
                  : undefined,
            }}
          >
            Drivers
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("constructors")}
            className="rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300"
            style={{
              backgroundColor:
                activeTab === "constructors"
                  ? "var(--accent-primary)"
                  : "color-mix(in srgb, var(--bg-surface) 85%, transparent)",
              color:
                activeTab === "constructors" ? "white" : "var(--text-primary)",
              borderColor:
                activeTab === "constructors"
                  ? "color-mix(in srgb, var(--accent-primary) 40%, transparent)"
                  : "color-mix(in srgb, var(--text-primary) 10%, transparent)",
              boxShadow:
                activeTab === "constructors"
                  ? "0 0 24px -8px color-mix(in srgb, var(--accent-primary) 55%, transparent)"
                  : undefined,
            }}
          >
            Constructors
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <ChampionshipCard
            variant="drivers"
            eyebrow="Driver Battle"
            title="Driver's Championship"
            animationDelayMs={0}
            className={activeTab !== "drivers" ? "hidden md:block" : ""}
            badges={
              <>
                <MetaBadge>Points</MetaBadge>
                <MetaBadge>{driversStandings2026.length} drivers</MetaBadge>
              </>
            }
          >
            <div
              className="flex flex-col gap-2 sm:gap-2.5"
              role="list"
              aria-label="Driver standings"
            >
              {driversStandings2026.map((entry, index) => (
                <div key={entry.position} role="listitem">
                  <StandingsRow
                    position={entry.position}
                    points={entry.points}
                    maxPoints={maxDriverPoints}
                    staggerMs={driverRowBaseStagger + index * 20}
                    isLeader={entry.position === 1}
                    primary={entry.driver}
                    secondary={entry.team}
                    accent="drivers"
                  />
                </div>
              ))}
            </div>
          </ChampionshipCard>

          <ChampionshipCard
            variant="constructors"
            eyebrow="Team Battle"
            title="Constructor's Championship"
            animationDelayMs={90}
            className={activeTab !== "constructors" ? "hidden md:block" : ""}
            badges={
              <>
                <MetaBadge>Points</MetaBadge>
                <MetaBadge>{constructorsStandings2026.length} teams</MetaBadge>
              </>
            }
          >
            <div
              className="flex flex-col gap-2 sm:gap-2.5"
              role="list"
              aria-label="Constructor standings"
            >
              {constructorsStandings2026.map((entry, index) => (
                <div key={entry.position} role="listitem">
                  <StandingsRow
                    position={entry.position}
                    points={entry.points}
                    maxPoints={maxConstructorPoints}
                    staggerMs={constructorRowBaseStagger + index * 20}
                    isLeader={entry.position === 1}
                    primary={entry.constructor}
                    accent="constructors"
                  />
                </div>
              ))}
            </div>
          </ChampionshipCard>
        </div>
      </main>
    </div>
  );
}
