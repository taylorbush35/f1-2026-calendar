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

  // Drag panning refs (no state for smooth updates)
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const pendingDragPxRef = useRef(0);
  const dragRafIdRef = useRef<number | null>(null);
  const hasStartedDragRef = useRef(false);
  const startLonOffsetRef = useRef(0);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Wheel panning refs and rAF
  const pendingWheelDeltaRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Cursor state (for visual feedback only)
  const [cursor, setCursor] = useState<"grab" | "grabbing">("grab");

  // Drag constants
  const DRAG_SENSITIVITY = 0.15; // degrees per pixel
  const DRAG_THRESHOLD = 4; // pixels before drag starts
  const MAX_DRAG_DELTA_PER_FRAME = 20; // pixels per frame clamp

  // Wheel panning constants
  const WHEEL_SENSITIVITY = 0.12;
  const MAX_WHEEL_DELTA = 40; // px equivalent per frame

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

  // Cleanup rAF loops on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (dragRafIdRef.current !== null) {
        cancelAnimationFrame(dragRafIdRef.current);
        dragRafIdRef.current = null;
      }
    };
  }, []);

  // Animate globe offset to selected race's longitude (shortest rotation)
  useEffect(() => {
    // Don't animate if user is dragging
    if (isDraggingRef.current) return;

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
      if (step >= steps || isDraggingRef.current) {
        if (!isDraggingRef.current) {
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
  }, [selectedRaceId, globeLonOffset]);

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

  // Helper to normalize longitude offset
  const normalizeOffset = (offset: number): number => {
    while (offset > 180) offset -= 360;
    while (offset < -180) offset += 360;
    return offset;
  };

  // Drag panning handlers
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return; // Only primary button

    // Ignore drag start if target is a button/control
    const target = e.target as HTMLElement;
    if (target.tagName === "BUTTON" || target.closest("button")) {
      return;
    }

    e.preventDefault();

    // Clear any active animation
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }

    // Reset drag state
    isDraggingRef.current = false;
    hasStartedDragRef.current = false;
    pendingDragPxRef.current = 0;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    startLonOffsetRef.current = globeLonOffset;

    (e.currentTarget as any).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!e.buttons) {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        hasStartedDragRef.current = false;
        setCursor("grab");
        if (dragRafIdRef.current !== null) {
          cancelAnimationFrame(dragRafIdRef.current);
          dragRafIdRef.current = null;
        }
      }
      return;
    }

    e.preventDefault();

    const currentX = e.clientX;
    const dxFromStart = currentX - startXRef.current;

    // Only start drag after threshold
    if (!hasStartedDragRef.current) {
      if (Math.abs(dxFromStart) < DRAG_THRESHOLD) {
        return;
      }
      hasStartedDragRef.current = true;
      isDraggingRef.current = true;
      setCursor("grabbing");
    }

    // Accumulate pixel delta (relative to last position)
    const dx = currentX - lastXRef.current;
    lastXRef.current = currentX;
    pendingDragPxRef.current += dx;

    // Start rAF loop if not already running
    if (dragRafIdRef.current === null) {
      const tick = () => {
        const deltaPx = pendingDragPxRef.current;

        if (Math.abs(deltaPx) > 0.01 && isDraggingRef.current) {
          // Clamp per-frame delta
          const clampedPx = Math.max(-MAX_DRAG_DELTA_PER_FRAME, Math.min(MAX_DRAG_DELTA_PER_FRAME, deltaPx));

          // Convert pixels to longitude delta
          const lonDelta = clampedPx * DRAG_SENSITIVITY;

          // Update globeLonOffset with functional setState
          setGlobeLonOffset((prev) => {
            return normalizeOffset(prev - lonDelta); // Negative because dragging right rotates left
          });

          // Decay the pending delta
          pendingDragPxRef.current *= 0.3;

          dragRafIdRef.current = requestAnimationFrame(tick);
        } else {
          // Reset when delta is small enough or drag ended
          pendingDragPxRef.current = 0;
          dragRafIdRef.current = null;
        }
      };
      dragRafIdRef.current = requestAnimationFrame(tick);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    (e.currentTarget as any).releasePointerCapture(e.pointerId);
    isDraggingRef.current = false;
    hasStartedDragRef.current = false;
    setCursor("grab");
    pendingDragPxRef.current = 0;
    if (dragRafIdRef.current !== null) {
      cancelAnimationFrame(dragRafIdRef.current);
      dragRafIdRef.current = null;
    }
  };

  const handlePointerLeave = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isDraggingRef.current) {
      (e.currentTarget as any).releasePointerCapture(e.pointerId);
      isDraggingRef.current = false;
      hasStartedDragRef.current = false;
      setCursor("grab");
      pendingDragPxRef.current = 0;
      if (dragRafIdRef.current !== null) {
        cancelAnimationFrame(dragRafIdRef.current);
        dragRafIdRef.current = null;
      }
    }
  };

  // Wheel handler for horizontal panning and vertical zoom
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault(); // Prevent page scroll while hovering the globe

    // Handle horizontal scrolling for panning
    const rawDeltaX = e.deltaX;
    if (Math.abs(rawDeltaX) > 0) {
      // Normalize delta based on deltaMode
      let normalizedDelta = rawDeltaX;
      if (e.deltaMode === 1) {
        // Line mode - multiply by ~16px per line
        normalizedDelta = rawDeltaX * 16;
      }

      // Clamp per-frame delta to max
      const clampedDelta = Math.max(-MAX_WHEEL_DELTA, Math.min(MAX_WHEEL_DELTA, normalizedDelta));
      
      // Reduce sensitivity for small deltas (trackpads)
      const sensitivity = Math.abs(clampedDelta) < 10 ? WHEEL_SENSITIVITY * 0.5 : WHEEL_SENSITIVITY;
      const adjustedDelta = clampedDelta * sensitivity;

      // Accumulate into pending delta
      pendingWheelDeltaRef.current += adjustedDelta;

      // Start rAF loop if not already running
      if (rafIdRef.current === null) {
        const tick = () => {
          const delta = pendingWheelDeltaRef.current;
          
          if (Math.abs(delta) > 0.01) {
            // Convert pixel delta to longitude offset
            const lonDelta = (delta / globeRadiusX) * 180;
            
            // Update globeLonOffset with functional setState to avoid stale closures
            setGlobeLonOffset((prev) => {
              let newOffset = prev - lonDelta; // Negative because scrolling right should rotate left
              while (newOffset > 180) newOffset -= 360;
              while (newOffset < -180) newOffset += 360;
              return newOffset;
            });
            
            // Decay the pending delta
            pendingWheelDeltaRef.current *= 0.7;
            
            rafIdRef.current = requestAnimationFrame(tick);
          } else {
            // Reset when delta is small enough
            pendingWheelDeltaRef.current = 0;
            rafIdRef.current = null;
          }
        };
        rafIdRef.current = requestAnimationFrame(tick);
      }
    }

    // Handle vertical scrolling for zoom (keep existing zoom behavior)
    const rawDeltaY = e.deltaY;
    if (Math.abs(rawDeltaY) > 0 && Math.abs(rawDeltaX) < Math.abs(rawDeltaY)) {
      // Tiny noise filter for trackpads
      if (Math.abs(rawDeltaY) < 2) return;

      // Clamp delta to [-100, 100] for normalization
      const clampedDelta = Math.max(-100, Math.min(100, rawDeltaY));

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
    }
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
    <div className="relative w-full" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Zoom controls overlay */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2 rounded-lg border p-2 transition-colors duration-300" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
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
        style={{
          display: "block",
          cursor,
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitUserDrag: "none",
          touchAction: "none",
        } as React.CSSProperties & { WebkitUserDrag?: string; touchAction?: string }}
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
            className={cursor === "grabbing" ? "" : "transition-transform duration-500 ease-out"}
          >
            {/* World country outlines (3 copies for wrapping) */}
            {xShifts.map((xShift) => (
              <g key={xShift} transform={`translate(${xShift}, 0)`}>
                {countryPaths.map((countryPath, index) => (
                  <path
                    key={`${countryPath.id}-${index}-${xShift}`}
                    d={countryPath.path}
                    fill="none"
                    stroke="var(--map-outline)"
                    strokeWidth={0.7}
                    strokeOpacity={0.3}
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
                      stroke={isAdjacent ? "var(--map-arc-active)" : "var(--map-arc-muted)"}
                      strokeWidth={isAdjacent ? 2 : 1.5}
                      opacity={isAdjacent ? 1 : 0.6}
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
                    <g
                      key={`${race.round}-${xShift}`}
                      onClick={() => onSelectRace?.(race.round)}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="cursor-pointer transition-all duration-300"
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 8 : 5}
                        fill={isSelected ? "var(--accent-primary)" : "var(--accent-muted)"}
                        stroke="var(--bg-primary)"
                        strokeWidth={isSelected ? 3 : 2}
                        style={{
                          filter: isSelected ? "drop-shadow(0 0 4px var(--accent-primary))" : "none",
                        }}
                      />
                      <text
                        x={x}
                        y={y}
                        fontSize={isSelected ? 7 : 6}
                        fontWeight="bold"
                        fill="white"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                          pointerEvents: "none",
                          userSelect: "none",
                        }}
                      >
                        {race.round}
                      </text>
                    </g>
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
          stroke="var(--map-outline)"
          strokeWidth={0.7}
          strokeOpacity={0.3}
          className="transition-colors duration-300"
        />
      </svg>
    </div>
  );
}
