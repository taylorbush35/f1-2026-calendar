"use client";

import { useMemo } from "react";
import type { Race } from "@/types/race";
import { raceCoordinates } from "@/data/race-coordinates";
import { worldCountries110m } from "@/data/world-countries-110m";

interface GlobeMapProps {
  races: Race[];
  selectedRaceId?: number;
  onSelectRace?: (round: number) => void;
}

interface ArcPath {
  path: string;
  fromRound: number;
  toRound: number;
}

export default function GlobeMap({ races, selectedRaceId, onSelectRace }: GlobeMapProps) {
  // SVG dimensions
  const width = 1000;
  const height = 600;
  const centerX = width / 2;
  const centerY = height / 2;
  const globeRadiusX = 450;
  const globeRadiusY = 280;

  // Compute center longitude from selected race
  const centerLon = selectedRaceId
    ? raceCoordinates[selectedRaceId]?.lon ?? 0
    : 0;

  // Helper: Normalize longitude relative to center longitude
  // Shift lon so centerLon is at 0 (middle of globe)
  function normalizeLon(lon: number, centerLon: number): number {
    let x = lon - centerLon;
    while (x < -180) x += 360;
    while (x > 180) x -= 360;
    return x;
  }

  // Simple equirectangular projection: lat/normalizedLon -> x/y on oval
  const projectPoint = (lat: number, normalizedLon: number) => {
    const x = centerX + (normalizedLon / 180) * globeRadiusX;
    const y = centerY - (lat / 90) * globeRadiusY;
    return { x, y };
  };

  // Convert country polygons to SVG paths with dateline handling
  const countryPaths = useMemo(() => {
    return worldCountries110m.flatMap((country) => {
      return country.rings.map((ring) => {
        const pathParts: string[] = [];
        let prevLon: number | null = null;

        ring.forEach(([lon, lat], index) => {
          const nlon = normalizeLon(lon, centerLon);
          const { x, y } = projectPoint(lat, nlon);

          // Dateline split: if raw longitude jump > 180, start new subpath
          if (prevLon !== null && Math.abs(lon - prevLon) > 180) {
            pathParts.push("Z"); // Close previous subpath
            pathParts.push(`M ${x} ${y}`); // Start new subpath
          } else if (index === 0) {
            pathParts.push(`M ${x} ${y}`);
          } else {
            pathParts.push(`L ${x} ${y}`);
          }

          prevLon = lon;
        });

        pathParts.push("Z"); // Close the path
        return {
          id: country.id,
          path: pathParts.join(" "),
        };
      });
    });
  }, [centerLon]);

  // Compute arc paths between sequential races
  const arcPaths = useMemo(() => {
    const arcs: ArcPath[] = [];
    const sortedRaces = [...races].sort((a, b) => a.round - b.round);

    for (let i = 0; i < sortedRaces.length - 1; i++) {
      const race1 = sortedRaces[i];
      const race2 = sortedRaces[i + 1];
      const coords1 = raceCoordinates[race1.round];
      const coords2 = raceCoordinates[race2.round];

      if (!coords1 || !coords2) continue;

      // Choose lon2 candidate (lon2, lon2+360, lon2-360) that minimizes |(candidate - lon1)|
      let lon1 = coords1.lon;
      let lon2 = coords2.lon;
      const candidates = [lon2, lon2 + 360, lon2 - 360];
      const distances = candidates.map(c => Math.abs(c - lon1));
      const minIndex = distances.indexOf(Math.min(...distances));
      lon2 = candidates[minIndex];

      // Normalize both longitudes
      const nlon1 = normalizeLon(lon1, centerLon);
      const nlon2 = normalizeLon(lon2, centerLon);

      // Project points using normalized longitude
      const point1 = projectPoint(coords1.lat, nlon1);
      const point2 = projectPoint(coords2.lat, nlon2);

      // Calculate midpoint
      const midX = (point1.x + point2.x) / 2;
      const midY = (point1.y + point2.y) / 2;
      
      // Perpendicular offset direction
      const dx = point2.x - point1.x;
      const dy = point2.y - point1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Avoid division by zero for coincident points
      if (distance < 1) {
        continue;
      }
      
      // Offset perpendicular to the line
      let offsetX = -dy / distance;
      let offsetY = dx / distance;
      
      // Arc height (proportional to distance, but capped)
      const arcHeight = Math.min(distance * 0.15, 80);
      
      let controlX = midX + offsetX * arcHeight;
      let controlY = midY + offsetY * arcHeight;
      
      // Flip perpendicular direction if control point is below midpoint (to bend upward)
      if (controlY > midY) {
        offsetX = -offsetX;
        offsetY = -offsetY;
        controlX = midX + offsetX * arcHeight;
        controlY = midY + offsetY * arcHeight;
      }

      // Create quadratic bezier curve
      const path = `M ${point1.x} ${point1.y} Q ${controlX} ${controlY} ${point2.x} ${point2.y}`;

      arcs.push({
        path,
        fromRound: race1.round,
        toRound: race2.round,
      });
    }

    return arcs;
  }, [races, centerLon]);

  return (
    <div className="w-full" style={{ backgroundColor: "var(--background)" }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: "block" }}
        className="transition-colors duration-300"
      >
        {/* Globe oval mask */}
        <defs>
          <clipPath id="globe-clip">
            <ellipse cx={centerX} cy={centerY} rx={globeRadiusX} ry={globeRadiusY} />
          </clipPath>
        </defs>

        {/* World country outlines */}
        <g clipPath="url(#globe-clip)">
          {countryPaths.map((countryPath, index) => (
            <path
              key={`${countryPath.id}-${index}`}
              d={countryPath.path}
              fill="none"
              stroke="var(--text-secondary)"
              strokeOpacity={0.12}
              strokeWidth={0.8}
              className="transition-colors duration-300"
            />
          ))}
        </g>

        {/* Travel arcs between races */}
        <g clipPath="url(#globe-clip)">
          {arcPaths.map((arc) => {
            const isAdjacent =
              arc.fromRound === selectedRaceId || arc.toRound === selectedRaceId;

            return (
              <path
                key={`${arc.fromRound}-${arc.toRound}`}
                d={arc.path}
                fill="none"
                stroke={isAdjacent ? "var(--f1-primary)" : "var(--f1-secondary)"}
                strokeWidth={isAdjacent ? 2 : 1.5}
                opacity={isAdjacent ? 0.6 : 0.25}
                className="transition-all duration-300"
              />
            );
          })}
        </g>

        {/* Globe outline */}
        <ellipse
          cx={centerX}
          cy={centerY}
          rx={globeRadiusX}
          ry={globeRadiusY}
          fill="none"
          stroke="var(--text-secondary)"
          strokeWidth={2}
          opacity={0.3}
        />

        {/* Race nodes */}
        <g clipPath="url(#globe-clip)">
          {races.map((race) => {
            const coords = raceCoordinates[race.round];
            if (!coords) return null;

            const nlon = normalizeLon(coords.lon, centerLon);
            const { x, y } = projectPoint(coords.lat, nlon);
            const isSelected = selectedRaceId === race.round;

            return (
              <circle
                key={race.round}
                cx={x}
                cy={y}
                r={isSelected ? 8 : 5}
                fill={isSelected ? "var(--f1-primary)" : "var(--f1-secondary)"}
                stroke="var(--background)"
                strokeWidth={isSelected ? 3 : 2}
                className={isSelected ? "transition-all duration-300" : "transition-all duration-300 cursor-pointer"}
                style={{
                  filter: isSelected ? "drop-shadow(0 0 4px var(--f1-primary))" : "none",
                }}
                onClick={() => onSelectRace?.(race.round)}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
