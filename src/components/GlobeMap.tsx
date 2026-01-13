"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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

  // Globe longitude offset state (animated camera position)
  const [globeLonOffset, setGlobeLonOffset] = useState(0);

  // Drag panning state and refs
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startLonOffsetRef = useRef(0);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedDragRef = useRef(false);

  // Drag constants
  const DRAG_SENSITIVITY = 0.8;
  const DRAG_THRESHOLD = 4;
  const degreesPerPixel = 360 / width;

  // Zoom state
  const [zoom, setZoom] = useState(1);
  const [userHasZoomed, setUserHasZoomed] = useState(false);

  // Zoom constants
  const minZoom = 1;
  const maxZoom = 2.5;

  // Clamp zoom between minZoom and maxZoom
  const setZoomClamped = (newZoom: number) => {
    const clamped = Math.max(minZoom, Math.min(maxZoom, newZoom));
    setZoom(clamped);
    setUserHasZoomed(true);
  };

  // Animate globe offset to selected race's longitude (shortest rotation)
  useEffect(() => {
    // Don't animate if user is dragging
    if (isDragging) return;

    if (!selectedRaceId) return;
    const targetCoords = raceCoordinates[selectedRaceId];
    if (!targetCoords) return;

    const targetLon = targetCoords.lon;
    const currentOffset = globeLonOffset;

    // Calculate shortest rotation path
    let delta = targetLon - currentOffset;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    // Animate with smooth easing
    const steps = 30;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      if (step >= steps || isDragging) {
        if (!isDragging) {
          setGlobeLonOffset(targetLon);
        }
        clearInterval(interval);
        animationIntervalRef.current = null;
      } else {
        const eased = (step / steps) * (2 - step / steps); // ease-out quad
        setGlobeLonOffset(currentOffset + delta * eased);
      }
    }, 16); // ~60fps

    animationIntervalRef.current = interval;
    return () => {
      clearInterval(interval);
      animationIntervalRef.current = null;
    };
  }, [selectedRaceId, globeLonOffset, isDragging]);

  // Auto-zoom for European races (if user hasn't manually zoomed)
  useEffect(() => {
    if (!selectedRaceId || userHasZoomed) return;
    const targetCoords = raceCoordinates[selectedRaceId];
    if (!targetCoords) return;

    // Check if race is in Europe (lat ~ 35-60, lon ~ -15-40)
    const { lat, lon } = targetCoords;
    if (lat >= 35 && lat <= 60 && lon >= -15 && lon <= 40) {
      setZoom(1.6);
    }
  }, [selectedRaceId, userHasZoomed]);

  // Drag panning handlers
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return; // Only primary button

    // Clear any active animation
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }

    setIsDragging(false);
    hasStartedDragRef.current = false;
    startXRef.current = e.clientX;
    startLonOffsetRef.current = globeLonOffset;

    (e.currentTarget as any).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!e.buttons) {
      setIsDragging(false);
      hasStartedDragRef.current = false;
      return;
    }

    const dx = e.clientX - startXRef.current;

    // Only start drag after threshold
    if (!hasStartedDragRef.current && Math.abs(dx) < DRAG_THRESHOLD) {
      return;
    }

    if (!hasStartedDragRef.current) {
      hasStartedDragRef.current = true;
      setIsDragging(true);
    }

    // Convert pixels to degrees
    const degreesDelta = -dx * degreesPerPixel * DRAG_SENSITIVITY;
    let newOffset = startLonOffsetRef.current + degreesDelta;

    // Normalize/wrap offset to [-180, 180]
    while (newOffset > 180) newOffset -= 360;
    while (newOffset < -180) newOffset += 360;

    setGlobeLonOffset(newOffset);
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    (e.currentTarget as any).releasePointerCapture(e.pointerId);
    setIsDragging(false);
    hasStartedDragRef.current = false;
  };

  const handlePointerLeave = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isDragging) {
      (e.currentTarget as any).releasePointerCapture(e.pointerId);
      setIsDragging(false);
      hasStartedDragRef.current = false;
    }
  };

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault(); // Prevent page scroll while hovering the globe

    const rawDelta = e.deltaY;

    // Tiny noise filter for trackpads
    if (Math.abs(rawDelta) < 2) return;

    // Clamp delta to [-100, 100] for normalization
    const clampedDelta = Math.max(-100, Math.min(100, rawDelta));

    // Convert to small zoom step
    const zoomStep = -clampedDelta * 0.001;

    // Apply zoom with smooth easing
    setZoom((prev) => {
      const target = Math.max(minZoom, Math.min(maxZoom, prev + zoomStep));
      const smoothed = prev + (target - prev) * 0.3;
      const clamped = Math.max(minZoom, Math.min(maxZoom, smoothed));
      setUserHasZoomed(true);
      return clamped;
    });
  };

  // Raw projection (no normalization) - projects lat/lon to x/y in world space
  const projectPointRaw = (lat: number, lon: number) => {
    const x = centerX + (lon / 180) * globeRadiusX;
    const y = centerY - (lat / 90) * globeRadiusY;
    return { x, y };
  };

  // Camera pan computation
  const worldWidth = 2 * globeRadiusX;
  const cameraX = -(globeLonOffset / 180) * globeRadiusX;
  
  // World wrapping: render 3 copies to avoid seams
  const xShifts = [-worldWidth, 0, worldWidth];

  // Convert country polygons to SVG paths (raw projection, computed once)
  const countryPaths = useMemo(() => {
    return worldCountries110m.flatMap((country) => {
      return country.rings.map((ring) => {
        const pathParts: string[] = [];
        let prevLon: number | null = null;

        ring.forEach(([lon, lat], index) => {
          const { x, y } = projectPointRaw(lat, lon);

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
  }, []);

  // Compute arc paths between sequential races (raw projection, computed once)
  const arcPaths = useMemo(() => {
    const arcs: ArcPath[] = [];
    const sortedRaces = [...races].sort((a, b) => a.round - b.round);

    for (let i = 0; i < sortedRaces.length - 1; i++) {
      const race1 = sortedRaces[i];
      const race2 = sortedRaces[i + 1];
      const coords1 = raceCoordinates[race1.round];
      const coords2 = raceCoordinates[race2.round];

      if (!coords1 || !coords2) continue;

      // Project points using raw coordinates
      const point1 = projectPointRaw(coords1.lat, coords1.lon);
      const point2 = projectPointRaw(coords2.lat, coords2.lon);

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
  }, [races]);

  return (
    <div className="relative w-full" style={{ backgroundColor: "var(--background)" }}>
      {/* Zoom controls overlay */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2 rounded-lg border p-2 transition-colors duration-300" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}>
        <button
          onClick={() => setZoomClamped(zoom + 0.2)}
          className="px-3 py-1 text-sm font-medium transition-colors duration-300 hover:opacity-80"
          style={{ color: "var(--text-primary)" }}
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => setZoomClamped(zoom - 0.2)}
          className="px-3 py-1 text-sm font-medium transition-colors duration-300 hover:opacity-80"
          style={{ color: "var(--text-primary)" }}
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setUserHasZoomed(true);
          }}
          className="px-3 py-1 text-xs font-medium transition-colors duration-300 hover:opacity-80"
          style={{ color: "var(--text-secondary)" }}
          aria-label="Reset zoom"
        >
          Reset
        </button>
      </div>

      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: "block", cursor: isDragging ? "grabbing" : "grab" }}
        className="transition-colors duration-300"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        {/* Globe oval mask */}
        <defs>
          <clipPath id="globe-clip">
            <ellipse cx={centerX} cy={centerY} rx={globeRadiusX} ry={globeRadiusY} />
          </clipPath>
        </defs>

        {/* Scene group with camera pan and zoom transform */}
        <g clipPath="url(#globe-clip)">
          <g
            style={{
              transform: `translate(${centerX}px, ${centerY}px) scale(${zoom}) translate(${-centerX + cameraX}px, ${-centerY}px)`,
              transformOrigin: "0 0",
            }}
            className="transition-transform duration-500 ease-out"
          >
            {/* World country outlines (3 copies for wrapping) */}
            {xShifts.map((xShift) => (
              <g key={xShift} transform={`translate(${xShift}, 0)`}>
                {countryPaths.map((countryPath, index) => (
                  <path
                    key={`${countryPath.id}-${index}-${xShift}`}
                    d={countryPath.path}
                    fill="none"
                    stroke="var(--text-secondary)"
                    strokeOpacity={0.12}
                    strokeWidth={0.8}
                    className="transition-colors duration-300"
                  />
                ))}
              </g>
            ))}

            {/* Travel arcs between races (3 copies for wrapping) */}
            {xShifts.map((xShift) => (
              <g key={`arcs-${xShift}`} transform={`translate(${xShift}, 0)`}>
                {arcPaths.map((arc) => {
                  const isAdjacent =
                    arc.fromRound === selectedRaceId || arc.toRound === selectedRaceId;

                  return (
                    <path
                      key={`${arc.fromRound}-${arc.toRound}-${xShift}`}
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
            ))}

            {/* Race nodes (3 copies for wrapping) */}
            {xShifts.map((xShift) => (
              <g key={`nodes-${xShift}`} transform={`translate(${xShift}, 0)`}>
                {races.map((race) => {
                  const coords = raceCoordinates[race.round];
                  if (!coords) return null;

                  const { x, y } = projectPointRaw(coords.lat, coords.lon);
                  const isSelected = selectedRaceId === race.round;

                  return (
                    <circle
                      key={`${race.round}-${xShift}`}
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
                      onPointerDown={(e) => e.stopPropagation()}
                    />
                  );
                })}
              </g>
            ))}
          </g>
        </g>

        {/* Globe outline (fixed, outside scene group) */}
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
      </svg>
    </div>
  );
}
