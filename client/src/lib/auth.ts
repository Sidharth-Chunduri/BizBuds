import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebase';
import { firebaseStorage } from './firebase-storage';
import type { User } from '@shared/schema';

export interface AuthUser extends User {
  firebaseUid: string;
}

class AuthService {
  private currentUser: AuthUser | null = null;
  private authStateListeners: ((user: AuthUser | null) => void)[] = [];

  constructor() {
    // Listen to Firebase auth state changes
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userData = await firebaseStorage.getUser(firebaseUser.uid);
        if (userData) {
          this.currentUser = {
            ...userData,
            firebaseUid: firebaseUser.uid
          };
        }
      } else {
        this.currentUser = null;
      }
      
      // Notify all listeners
      this.authStateListeners.forEach(listener => listener(this.currentUser));
    });
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    school?: string;
    interests?: string;
  }): Promise<AuthUser> {
    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      
      const firebaseUser = userCredential.user;
      
      // Create user document in Firestore (using Firebase UID as document ID)
      const { password, ...userDataWithoutPassword } = userData;
      
      const newUser = await firebaseStorage.createUserWithId(firebaseUser.uid, userDataWithoutPassword);
      
      const authUser: AuthUser = {
        ...newUser,
        firebaseUid: firebaseUser.uid
      };
      
      this.currentUser = authUser;
      return authUser;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  async login(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user data from Firestore
      const userData = await firebaseStorage.getUser(firebaseUser.uid);
      
      if (!userData) {
        throw new Error('User data not found in Firestore');
      }
      
      const authUser: AuthUser = {
        ...userData,
        firebaseUid: firebaseUser.uid
      };
      
      this.currentUser = authUser;
      return authUser;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
      this.currentUser = null;
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    this.authStateListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

export const authService = new AuthService();