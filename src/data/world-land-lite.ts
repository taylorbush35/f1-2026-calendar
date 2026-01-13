// Simplified world land outlines - very low resolution continental polygons
// Each array is [lon, lat] coordinates in equirectangular projection
// Format: Array of continent polygons, where each polygon is an array of [lon, lat] points

export type LandPolygon = Array<[number, number]>; // [longitude, latitude]

export const worldLandLite: LandPolygon[] = [
  // North America (simplified - ~8 points)
  [
    [-170, 60],   // Alaska
    [-140, 65],
    [-130, 60],
    [-120, 50],
    [-100, 50],
    [-80, 30],    // Gulf of Mexico
    [-70, 25],
    [-80, 15],
    [-110, 20],
    [-130, 30],
    [-140, 45],
    [-150, 55],
    [-170, 60],
  ],
  
  // South America (simplified - ~7 points)
  [
    [-80, 15],
    [-75, -5],
    [-70, -20],
    [-65, -35],
    [-70, -50],
    [-75, -55],
    [-70, -55],
    [-65, -50],
    [-60, -40],
    [-55, -25],
    [-50, -10],
    [-55, 5],
    [-70, 10],
    [-80, 15],
  ],
  
  // Africa (simplified - ~7 points)
  [
    [-20, 35],    // North Africa
    [30, 32],
    [35, 5],      // East Africa
    [40, -5],
    [35, -25],
    [30, -35],
    [15, -35],
    [-20, -35],
    [-20, -5],
    [-15, 15],
    [-20, 35],
  ],
  
  // Europe+Asia (simplified combined - ~10 points)
  [
    [-10, 70],    // Western Europe
    [0, 55],
    [10, 50],
    [25, 50],
    [40, 45],
    [50, 45],
    [60, 50],
    [70, 55],
    [80, 50],
    [100, 55],
    [120, 60],
    [140, 65],
    [150, 50],
    [130, 40],
    [120, 30],
    [100, 20],
    [80, 25],
    [60, 30],
    [40, 30],
    [20, 35],
    [0, 50],
    [-10, 60],
    [-10, 70],
  ],
  
  // Australia (simplified - ~5 points)
  [
    [110, -10],
    [115, -15],
    [155, -25],
    [155, -40],
    [115, -35],
    [110, -25],
    [110, -10],
  ],
  
  // Antarctica (simplified - minimal)
  [
    [-180, -60],
    [180, -60],
    [180, -70],
    [-180, -70],
    [-180, -60],
  ],
];
