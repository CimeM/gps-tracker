import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // These would be your actual Firebase config values
  apiKey: "AIzaSyCXVdMm5iaiEz0jWzi6xy9gKM6P2P-O1Bo",

  authDomain: "tracker-a61ae.firebaseapp.com",

  projectId: "tracker-a61ae",

  storageBucket: "tracker-a61ae.firebasestorage.app",

  messagingSenderId: "912276878221",

  appId: "1:912276878221:web:6503c8ccb340e5278c83c4",

  measurementId: "G-DDDQCZRGQH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
// export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;