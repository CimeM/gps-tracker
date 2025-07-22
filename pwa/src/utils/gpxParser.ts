import GpxParser from 'gpxparser';

export interface Coordinate {
  lat: number;
  lon: number;
  ele: number;
  time: Date;
}

export interface RoutePoint {
  position: Coordinate;
  speed?: number;
  heartRate?: number;
  cadence?: number;
}

export interface RouteSegment {
  points: RoutePoint[];
  distance: number;
  duration: number;
  elevationGain: number;
  elevationLoss: number;
  maxSpeed: number;
  avgSpeed: number;
}

export interface Waypoint {
  lat: number;
  lon: number;
  ele?: number;
  time?: Date;
  name?: string;
  description?: string;
  comment?: string;
  extensions?: any; // Sensor data etc.
}

export interface Route {
  id: string;
  name: string;
  description: string;
  date: Date;
  segments: RouteSegment[];
  totalDistance: number;
  totalDuration: number;
  totalElevationGain: number;
  totalElevationLoss: number;
  startPoint: Coordinate;
  endPoint: Coordinate;
  bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  };
  waypoints: Waypoint[];
}

// best effort : parse the comment to find relevant data points
function parseWaypointComment(comment?: string): Record<string, any> {
  if (!comment) return {};
  const result: Record<string, any> = {};

  // Flatten lines and split by comma
  const lines = comment.replace(/\n/g, ',').split(',');

  lines.forEach(line => {
    // Try to match "Label(unit): value"
    const match = line.match(/([\w\s]+)\(([^)]+)\):\s*([-\d.]+)/);
    if (match) {
      const label = match[1].trim().replace(/\s+/g, '_').toLowerCase(); // e.g. temp, pressure
      const unit = match[2].trim();
      const value = parseFloat(match[3]);
      result[label] = value;
      result[`${label}_unit`] = unit;
      return;
    }
    // Try to match "Label: value"
    const match2 = line.match(/([\w\s]+):\s*([-\d.]+)/);
    if (match2) {
      const label = match2[1].trim().replace(/\s+/g, '_').toLowerCase();
      const value = parseFloat(match2[2]);
      result[label] = value;
      return;
    }
  });

  return result;
}


export const parseGpxFile = (file: File): Promise<Route> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const gpx = new GpxParser();
        gpx.parse(e.target?.result as string);

        if (gpx.tracks.length === 0) {
          throw new Error('No tracks found in GPX file');
        }

        // Parse route segments
        const segments: RouteSegment[] = gpx.tracks.map(track => {
          const points = track.points.map(point => ({
            position: {
              lat: point.lat,
              lon: point.lon,
              ele: point.ele || 0,
              time: new Date(point.time)
            },
            speed: point.speed,
            heartRate: point.extensions?.hr,
            cadence: point.extensions?.cad
          }));

          let elevationGain = 0;
          let elevationLoss = 0;
          let maxSpeed = 0;
          let totalSpeed = 0;

          for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];

            if (curr.speed) {
              totalSpeed += curr.speed;
              maxSpeed = Math.max(maxSpeed, curr.speed);
            }

            const eleDiff = curr.position.ele - prev.position.ele;
            if (eleDiff > 0) {
              elevationGain += eleDiff;
            } else {
              elevationLoss += Math.abs(eleDiff);
            }
          }

          const startTime = points[0].position.time;
          const endTime = points[points.length - 1].position.time;
          const duration = endTime.getTime() - startTime.getTime(); // in ms

          return {
            points,
            distance: track.distance.total,
            duration: duration / 1000,
            elevationGain,
            elevationLoss,
            maxSpeed,
            avgSpeed: totalSpeed / points.length
          };
        });

        // Calculate overall metrics
        const totalDistance = segments.reduce((sum, seg) => sum + seg.distance, 0);
        const totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0);
        const totalElevationGain = segments.reduce((sum, seg) => sum + seg.elevationGain, 0);
        const totalElevationLoss = segments.reduce((sum, seg) => sum + seg.elevationLoss, 0);

        // Start/end points
        const firstSegment = segments[0];
        const lastSegment = segments[segments.length - 1];
        const startPoint = firstSegment.points[0].position;
        const endPoint = lastSegment.points[lastSegment.points.length - 1].position;

        // Bounds
        let minLat = Number.MAX_VALUE;
        let maxLat = Number.MIN_VALUE;
        let minLon = Number.MAX_VALUE;
        let maxLon = Number.MIN_VALUE;

        segments.forEach(segment => {
          segment.points.forEach(point => {
            const { lat, lon } = point.position;
            minLat = Math.min(minLat, lat);
            maxLat = Math.max(maxLat, lat);
            minLon = Math.min(minLon, lon);
            maxLon = Math.max(maxLon, lon);
          });
        });

        // Parse waypoints
        const waypoints: Waypoint[] = Array.isArray(gpx.waypoints)
          ? gpx.waypoints.map(wpt => {
              const commentData = parseWaypointComment(wpt.cmt);
              // Merge extensions and commentData
              const extensions = { ...(wpt.extensions || {}), ...commentData };
              return {
                lat: wpt.lat,
                lon: wpt.lon,
                ele: wpt.ele,
                time: wpt.time ? new Date(wpt.time) : undefined,
                name: wpt.name,
                description: wpt.desc,
                comment: wpt.cmt,
                extensions,
              };
            })
          : [];

        // --- Route object ---
        const route: Route = {
          id: `route_${Date.now()}`,
          name: file.name.replace('.gpx', '') || 'Unnamed Route',
          description: gpx.metadata?.desc || '',
          date: new Date(gpx.metadata?.time || Date.now()),
          segments,
          totalDistance,
          totalDuration,
          totalElevationGain,
          totalElevationLoss,
          startPoint,
          endPoint,
          bounds: {
            minLat,
            maxLat,
            minLon,
            maxLon
          },
          waypoints // always present
        };

        resolve(route);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading GPX file'));
    };

    reader.readAsText(file);
  });
};

// Helper functions for route data (unchanged)
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters.toFixed(0)}m`;
  }
  return `${(meters / 1000).toFixed(2)}km`;
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

export const formatElevation = (meters: number): string => {
  return `${meters.toFixed(0)}m`;
};

export const formatSpeed = (metersPerSecond: number): string => {
  const kmh = metersPerSecond * 3.6;
  return `${kmh.toFixed(1)} km/h`;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};