import { UserProfile } from "firebase/auth";
import { FirebaseRoute } from "./firebaseService";

// API Service for synchronizing data with backend
const API_BASE_URL = 'https://api.tracker.rivieraapps.com';

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
  /**
   * Fetches all routes for a specific user.
   */
  // Get all routes for the logged-in user
  async getUserRoutes(): Promise<FirebaseRoute[]> {
    const response = await this.request<{ routes: FirebaseRoute[] }>(API_BASE_URL + `/routes/user`);
    if (!response.success || !response.data) throw new Error(response.error || "Failed");
    return response.data.routes;
  }
  /**
   * Deletes a route by its ID, after verifying ownership.
   */
  async deleteRoute(routeId: string, userId: string): Promise<void> {
    const routeResponse = await this.getRouteById(routeId);
    if (!routeResponse.success || !routeResponse.data) {
      throw new Error('Route not found');
    }
    const routeData = routeResponse.data;
    if (routeData.userId !== userId) {
      throw new Error('Unauthorized');
    }
    const deleteResponse = await this.rmRoute(routeId, userId);
    if (!deleteResponse.success) {
      throw new Error(deleteResponse.error || 'Failed to delete route');
    }
    await this.updateUserStorageUsage(userId, -routeData.fileSize);
  }

  // Get a single route
  async getRouteById(routeId: string): Promise<FirebaseRoute> {
    const response = await this.request<{ data: FirebaseRoute }>(`/routes/${routeId}`);
    if (!response.success || !response.data) throw new Error(response.error || "Failed");
    return response.data.data;
  }

  // Delete a route
  // async deleteRoute(routeId: string): Promise<void> {
  //   const response = await this.request(`/routes/${routeId}`, { method: 'DELETE' });
  //   if (!response.success) throw new Error(response.error || "Failed");
  // }

  // Upload a route (with GPX file)
  async uploadRoute(formData: FormData): Promise<FirebaseRoute> {
    const response = await this.request<{ data: FirebaseRoute }>(`/routes/upload`, {
      method: 'POST',
      body: formData // Must be FormData, not JSON
    });
    if (!response.success || !response.data) throw new Error(response.error || "Failed");
    return response.data.data;
  }

  // Get public routes
  async getPublicRoutes(limit = 20, page = 1): Promise<FirebaseRoute[]> {
    const response = await this.request<{ routes: FirebaseRoute[] }>(`/routes/public?limit=${limit}&page=${page}`);
    if (!response.success || !response.data) throw new Error(response.error || "Failed");
    return response.data.routes;
  }

  // Toggle visibility
  async toggleRouteVisibility(routeId: string, isPublic: boolean): Promise<void> {
    const response = await this.request(`/routes/${routeId}`, {
      method: 'PUT',
      body: JSON.stringify({ isPublic }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.success) throw new Error(response.error || "Failed");
  }


  // create user profile
  async putUserProfile(userProfile: UserProfile): Promise<void> {
    const response = await this.request(`/routes/profile`, {
      method: 'PUT',
      body: JSON.stringify({ userProfile }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.success) throw new Error(response.error || "Failed");
  }

  async getUserProfile(id: string): Promise<UserProfile> {
    const response = await this.request<{ data: UserProfile }>(`/routes/profile/${id}`);
    if (!response.success || !response.data) throw new Error(response.error || "Failed");
    return response.data.data;
  }


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




  async getRoutes(userId: string): Promise<ApiResponse<FirebaseRoute[]>> {
    return this.request<FirebaseRoute[]>(`/routes/${userId}`);
  }
  // async getRouteById(routeId: string): Promise<ApiResponse<FirebaseRoute>> {
  //   return this.request<FirebaseRoute>(`/route/${routeId}`);
  // }
  async rmRoute(routeId: string, userId: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/route/${userId}/${routeId}`, {
      method: 'DELETE'
    });
  }
  // async uploadRoute(route: FirebaseRoute): Promise<ApiResponse<{ id: string }>> {
  //   return this.request<{ id: string }>(`/routes`, {
  //     method: 'POST',
  //     body: JSON.stringify(route)
  //   });
  // }
  async syncRoutes(routes: FirebaseRoute[]): Promise<ApiResponse<any>> {
    return this.request('/routes/sync', {
      method: 'POST',
      body: JSON.stringify({ routes })
    });
  }

  async updateUserStorageUsage(userId: string, sizeChange: number): Promise<ApiResponse<any>> {
    return this.request(`/users/${userId}/storage`, {
      method: 'PATCH',
      body: JSON.stringify({ sizeChange })
    });
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