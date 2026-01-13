const fs = require('fs');
const path = require('path');
const { feature } = require('topojson-client');
const world = require('world-atlas/countries-110m.json');

// Convert TopoJSON to GeoJSON
const countries = feature(world, world.objects.countries);

// Round coordinates to 6 decimal places
function roundCoord(coord) {
  return [Math.round(coord[0] * 1000000) / 1000000, Math.round(coord[1] * 1000000) / 1000000];
}

// Convert GeoJSON geometry to rings format
function geometryToRings(geometry) {
  if (geometry.type === 'Polygon') {
    return geometry.coordinates.map(ring => ring.map(roundCoord));
  } else if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.flat().map(ring => ring.map(roundCoord));
  }
  return [];
}

// Process countries
const countryData = countries.features.map((feature, index) => {
  const id = feature.id?.toString() || `country-${index}`;
  const name = feature.properties?.name || id;
  const rings = geometryToRings(feature.geometry);
  
  return {
    id,
    name: name.toString(),
    rings
  };
});

// Generate TypeScript file content
const fileContent = `// Natural Earth 110m countries dataset
// Generated from world-atlas package
// Format: Array of country polygons with id, name, and rings (multi-polygon support)
// Each ring is an array of [longitude, latitude] coordinate pairs

export type Country = {
  id: string;
  name: string;
  rings: Array<Array<[number, number]>>; // [longitude, latitude]
};

export const worldCountries110m: Country[] = ${JSON.stringify(countryData, null, 2)} as const;
`;

// Write to file
const outputPath = path.join(__dirname, '../src/data/world-countries-110m.ts');
fs.writeFileSync(outputPath, fileContent, 'utf8');

console.log(`Generated ${countryData.length} countries`);
console.log(`File written to: ${outputPath}`);

// Calculate file size
const stats = fs.statSync(outputPath);
const fileSizeKB = (stats.size / 1024).toFixed(2);
const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
console.log(`File size: ${fileSizeKB} KB (${fileSizeMB} MB)`);
