import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDCzrCN7SEHUqfDHWh9Jiwz2qhZV4jvYGY",
  authDomain: "bizbudz-e80a0.firebaseapp.com",
  projectId: "bizbudz-e80a0",
  storageBucket: "bizbudz-e80a0.firebasestorage.app",
  messagingSenderId: "244723166702",
  appId: "1:244723166702:web:1b677b02ef83fb36d772ff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;