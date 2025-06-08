// API Service for synchronizing data with backend
const API_BASE_URL = 'https://api.gps-tracker.example.com/v1';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface SyncStatus {
  lastSync: Date;
  pending: number;
  failed: number;
}

class ApiService {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.authToken = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      // Simulate API responses for demo purposes
      const response = await this.simulateApiResponse<T>(endpoint, options);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        timestamp: new Date().toISOString()
      };
    }
  }

  private async simulateApiResponse<T>(endpoint: string, options: RequestInit): Promise<ApiResponse<T>> {
    // Simulate different responses based on endpoint
    const method = options.method || 'GET';
    
    // Simulate 90% success rate
    const isSuccess = Math.random() > 0.1;
    
    if (!isSuccess) {
      throw new Error('Simulated network error');
    }

    const timestamp = new Date().toISOString();

    switch (true) {
      case endpoint === '/auth/login':
        return {
          success: true,
          data: { token: 'fake-jwt-token-' + Date.now(), user: { id: '1', email: 'user@example.com' } } as T,
          timestamp
        };

      case endpoint === '/routes' && method === 'GET':
        return {
          success: true,
          data: [] as T, // Routes will be managed locally for demo
          timestamp
        };

      case endpoint === '/routes' && method === 'POST':
        return {
          success: true,
          data: { id: 'route_' + Date.now(), synced: true } as T,
          timestamp
        };

      case endpoint === '/trackers' && method === 'GET':
        return {
          success: true,
          data: [] as T,
          timestamp
        };

      case endpoint === '/trackers' && method === 'POST':
        return {
          success: true,
          data: { id: 'tracker_' + Date.now(), synced: true } as T,
          timestamp
        };

      case endpoint.startsWith('/trackers/') && method === 'PUT':
        return {
          success: true,
          data: { synced: true } as T,
          timestamp
        };

      default:
        return {
          success: true,
          data: {} as T,
          timestamp
        };
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (response.success && response.data) {
      this.authToken = response.data.token;
      localStorage.setItem('authToken', this.authToken);
    }

    return response;
  }

  async logout(): Promise<void> {
    this.authToken = null;
    localStorage.removeItem('authToken');
  }

  // Routes API
  async syncRoutes(routes: any[]): Promise<ApiResponse<any>> {
    return this.request('/routes/sync', {
      method: 'POST',
      body: JSON.stringify({ routes })
    });
  }

  async uploadRoute(route: any): Promise<ApiResponse<any>> {
    return this.request('/routes', {
      method: 'POST',
      body: JSON.stringify(route)
    });
  }

  async getRoutes(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/routes');
  }

  // Trackers API
  async syncTrackers(trackers: any[]): Promise<ApiResponse<any>> {
    return this.request('/trackers/sync', {
      method: 'POST',
      body: JSON.stringify({ trackers })
    });
  }

  async addTracker(tracker: any): Promise<ApiResponse<any>> {
    return this.request('/trackers', {
      method: 'POST',
      body: JSON.stringify(tracker)
    });
  }

  async updateTracker(trackerId: string, settings: any): Promise<ApiResponse<any>> {
    return this.request(`/trackers/${trackerId}`, {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  async getTrackers(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/trackers');
  }

  // Sync status
  async getSyncStatus(): Promise<SyncStatus> {
    const lastSync = localStorage.getItem('lastSyncTime');
    return {
      lastSync: lastSync ? new Date(lastSync) : new Date(0),
      pending: 0,
      failed: 0
    };
  }

  async performFullSync(): Promise<boolean> {
    try {
      // Sync routes
      const routes = JSON.parse(localStorage.getItem('gpxRoutes') || '[]');
      await this.syncRoutes(routes);

      // Sync trackers
      const trackers = JSON.parse(localStorage.getItem('trackers') || '[]');
      await this.syncTrackers(trackers);

      // Update last sync time
      localStorage.setItem('lastSyncTime', new Date().toISOString());
      
      return true;
    } catch (error) {
      console.error('Sync failed:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();