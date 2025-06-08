import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Route } from '../utils/gpxParser';

export interface FirebaseRoute extends Omit<Route, 'date'> {
  userId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Timestamp;
  isPublic: boolean;
}

export interface UserStats {
  totalRoutes: number;
  totalDistance: number;
  totalDuration: number;
  storageUsed: number;
}

class FirebaseService {
  // Route management
  async uploadRoute(userId: string, route: Route, gpxFile: File): Promise<string> {
    try {
      // Upload GPX file to Firebase Storage
      const fileRef = ref(storage, `routes/${userId}/${route.id}.gpx`);
      const snapshot = await uploadBytes(fileRef, gpxFile);
      const fileUrl = await getDownloadURL(snapshot.ref);

      // Save route metadata to Firestore
      const routeData: Omit<FirebaseRoute, 'id'> = {
        ...route,
        userId,
        fileUrl,
        fileName: gpxFile.name,
        fileSize: gpxFile.size,
        uploadedAt: Timestamp.now(),
        isPublic: false
      };

      const docRef = await addDoc(collection(db, 'routes'), routeData);
      
      // Update user storage usage
      await this.updateUserStorageUsage(userId, gpxFile.size);
      
      return docRef.id;
    } catch (error) {
      console.error('Error uploading route:', error);
      throw error;
    }
  }

  async getUserRoutes(userId: string): Promise<FirebaseRoute[]> {
    try {
      const q = query(
        collection(db, 'routes'),
        where('userId', '==', userId),
        orderBy('uploadedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseRoute[];
    } catch (error) {
      console.error('Error fetching user routes:', error);
      throw error;
    }
  }

  async deleteRoute(routeId: string, userId: string): Promise<void> {
    try {
      const routeDoc = await getDoc(doc(db, 'routes', routeId));
      if (!routeDoc.exists()) {
        throw new Error('Route not found');
      }

      const routeData = routeDoc.data() as FirebaseRoute;
      
      // Verify ownership
      if (routeData.userId !== userId) {
        throw new Error('Unauthorized');
      }

      // Delete file from storage
      const fileRef = ref(storage, `routes/${userId}/${routeData.id}.gpx`);
      await deleteObject(fileRef);

      // Delete route document
      await deleteDoc(doc(db, 'routes', routeId));

      // Update user storage usage
      await this.updateUserStorageUsage(userId, -routeData.fileSize);
    } catch (error) {
      console.error('Error deleting route:', error);
      throw error;
    }
  }

  async updateUserStorageUsage(userId: string, sizeChange: number): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const currentUsage = userDoc.data().storageUsed || 0;
        await updateDoc(userRef, {
          storageUsed: Math.max(0, currentUsage + sizeChange)
        });
      }
    } catch (error) {
      console.error('Error updating storage usage:', error);
      throw error;
    }
  }

  async getUserStats(userId: string): Promise<UserStats> {
    try {
      const routes = await this.getUserRoutes(userId);
      
      const stats = routes.reduce((acc, route) => {
        acc.totalDistance += route.totalDistance;
        acc.totalDuration += route.totalDuration;
        acc.storageUsed += route.fileSize;
        return acc;
      }, {
        totalRoutes: routes.length,
        totalDistance: 0,
        totalDuration: 0,
        storageUsed: 0
      });

      return stats;
    } catch (error) {
      console.error('Error calculating user stats:', error);
      throw error;
    }
  }

  // Public routes for discovery
  async getPublicRoutes(limitCount: number = 20): Promise<FirebaseRoute[]> {
    try {
      const q = query(
        collection(db, 'routes'),
        where('isPublic', '==', true),
        orderBy('uploadedAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseRoute[];
    } catch (error) {
      console.error('Error fetching public routes:', error);
      throw error;
    }
  }

  async toggleRouteVisibility(routeId: string, userId: string, isPublic: boolean): Promise<void> {
    try {
      const routeRef = doc(db, 'routes', routeId);
      const routeDoc = await getDoc(routeRef);
      
      if (!routeDoc.exists()) {
        throw new Error('Route not found');
      }

      const routeData = routeDoc.data() as FirebaseRoute;
      
      // Verify ownership
      if (routeData.userId !== userId) {
        throw new Error('Unauthorized');
      }

      await updateDoc(routeRef, { isPublic });
    } catch (error) {
      console.error('Error updating route visibility:', error);
      throw error;
    }
  }
}

export const firebaseService = new FirebaseService();