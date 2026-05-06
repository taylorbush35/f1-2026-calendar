"use client";

import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import NavigationMenu from "@/components/NavigationMenu";
import {
  constructorsStandings2026,
  driversStandings2026,
} from "@/data/standings-2026";

type StandingsTab = "drivers" | "constructors";

export default function StandingsPage() {
  const [activeTab, setActiveTab] = useState<StandingsTab>("drivers");

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-4 sm:mb-8">
          <div className="mb-2 sm:mb-4 flex items-center justify-between gap-2">
            <h1
              className="text-2xl sm:text-4xl font-bold transition-colors duration-300"
              style={{ color: "var(--text-primary)" }}
            >
              F1 2026 Standings
            </h1>
            <div className="flex items-center gap-2">
              <NavigationMenu />
              <ThemeToggle />
            </div>
          </div>
          <p
            className="text-sm sm:text-lg transition-colors duration-300"
            style={{ color: "var(--text-secondary)" }}
          >
            Track the championship battle across both Drivers and Constructors.
          </p>
        </div>

        <div className="mb-4 flex items-center gap-2 md:hidden">
          <button
            onClick={() => setActiveTab("drivers")}
            className="rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200"
            style={{
              backgroundColor:
                activeTab === "drivers"
                  ? "var(--accent-primary)"
                  : "var(--bg-surface)",
              color: activeTab === "drivers" ? "white" : "var(--text-primary)",
            }}
          >
            Drivers
          </button>
          <button
            onClick={() => setActiveTab("constructors")}
            className="rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200"
            style={{
              backgroundColor:
                activeTab === "constructors"
                  ? "var(--accent-primary)"
                  : "var(--bg-surface)",
              color:
                activeTab === "constructors" ? "white" : "var(--text-primary)",
            }}
          >
            Constructors
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <section
            className={`rounded-lg border p-4 sm:p-6 ${
              activeTab !== "drivers" ? "hidden md:block" : ""
            }`}
            style={{
              borderColor:
                activeTab === "drivers"
                  ? "var(--accent-primary)"
                  : "var(--border-subtle)",
              backgroundColor: "var(--bg-surface)",
            }}
          >
            <h2
              className="mb-4 text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Drivers Championship
            </h2>
            <div className="space-y-2">
              {driversStandings2026.map((entry) => (
                <div
                  key={entry.position}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                  style={{
                    borderColor: "var(--border-subtle)",
                    backgroundColor: "var(--bg-primary)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-6 text-sm font-bold"
                      style={{ color: "var(--accent-primary)" }}
                    >
                      {entry.position}
                    </span>
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {entry.driver}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {entry.team}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {entry.points} pts
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section
            className={`rounded-lg border p-4 sm:p-6 ${
              activeTab !== "constructors" ? "hidden md:block" : ""
            }`}
            style={{
              borderColor:
                activeTab === "constructors"
                  ? "var(--accent-primary)"
                  : "var(--border-subtle)",
              backgroundColor: "var(--bg-surface)",
            }}
          >
            <h2
              className="mb-4 text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Constructors Championship
            </h2>
            <div className="space-y-2">
              {constructorsStandings2026.map((entry) => (
                <div
                  key={entry.position}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                  style={{
                    borderColor: "var(--border-subtle)",
                    backgroundColor: "var(--bg-primary)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-6 text-sm font-bold"
                      style={{ color: "var(--accent-primary)" }}
                    >
                      {entry.position}
                    </span>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {entry.constructor}
                    </p>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {entry.points} pts
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
