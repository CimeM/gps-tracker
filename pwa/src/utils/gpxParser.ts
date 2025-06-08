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

        // Process tracks and create route segments
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

          // Calculate segment metrics
          let distance = 0;
          let elevationGain = 0;
          let elevationLoss = 0;
          let maxSpeed = 0;
          let totalSpeed = 0;

          for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            
            // Add segment distance
            if (curr.speed) {
              totalSpeed += curr.speed;
              maxSpeed = Math.max(maxSpeed, curr.speed);
            }
            
            // Calculate elevation change
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
            duration: duration / 1000, // convert to seconds
            elevationGain,
            elevationLoss,
            maxSpeed,
            avgSpeed: totalSpeed / points.length
          };
        });

        // Calculate total route metrics
        const totalDistance = segments.reduce((sum, seg) => sum + seg.distance, 0);
        const totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0);
        const totalElevationGain = segments.reduce((sum, seg) => sum + seg.elevationGain, 0);
        const totalElevationLoss = segments.reduce((sum, seg) => sum + seg.elevationLoss, 0);
        
        // Find start and end points
        const firstSegment = segments[0];
        const lastSegment = segments[segments.length - 1];
        const startPoint = firstSegment.points[0].position;
        const endPoint = lastSegment.points[lastSegment.points.length - 1].position;
        
        // Calculate bounds
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

        // Create the route object
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
          }
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

// Helper functions for route data
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
  // Convert to km/h
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