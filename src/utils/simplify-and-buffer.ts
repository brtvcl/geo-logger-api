import * as turf from '@turf/turf';
import { Feature, Polygon } from 'geojson';

interface SimplifyAndBufferParams {
  polygon: Feature<Polygon>; // Polygon to simplify and buffer
  tolerance: number; // Tolerance for simplification
  units: turf.Units; // Units for buffer (e.g., 'meters', 'kilometers')
  maxDepth?: number; // Maximum recursion depth (optional)
  currentDepth?: number; // Current recursion depth (optional)
}

// Recursively simplify and buffer a polygon until the buffered polygon contains the original polygon
function simplifyAndBuffer({
  polygon,
  tolerance,
  units,
  maxDepth = 10,
  currentDepth = 0,
}: SimplifyAndBufferParams): Feature<Polygon> {
  if (currentDepth >= maxDepth) {
    throw new Error('Maximum recursion depth reached. Simplification failed.');
  }
  console.log({
    currentDepth: currentDepth,
    verties: polygon.geometry.coordinates[0].length,
  });

  const simplified = turf.simplify(polygon, { tolerance, highQuality: false });
  const buffered: Feature<Polygon> = turf.buffer(simplified, currentDepth, {
    units,
  }) as Feature<Polygon>;

  if (turf.booleanContains(buffered, polygon)) {
    return buffered;
  }

  return simplifyAndBuffer({
    polygon: buffered,
    tolerance,
    units,
    maxDepth,
    currentDepth: currentDepth + 1,
  });
}

export default simplifyAndBuffer;
