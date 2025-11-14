import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  increment,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase';
import type { 
  User, 
  Session, 
  Note, 
  Comment, 
  Like, 
  SessionSignup, 
  UserStats 
} from '@shared/schema';

export class FirebaseStorage {
  // User methods
  async getUserByEmail(email: string): Promise<User | undefined> {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return undefined;
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }

  async getUser(id: string): Promise<User | undefined> {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return undefined;
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const usersRef = collection(db, 'users');
    const docRef = await addDoc(usersRef, userData);
    
    // Initialize user stats
    await addDoc(collection(db, 'userStats'), {
      userId: docRef.id,
      sessionsAttended: 0,
      quizzesCompleted: 0,
      learningStreak: 0
    });
    
    return { id: docRef.id, ...userData };
  }

  async createUserWithId(id: string, userData: Omit<User, 'id'>): Promise<User> {
    const userRef = doc(db, 'users', id);
    await setDoc(userRef, userData);
    
    // Initialize user stats
    await addDoc(collection(db, 'userStats'), {
      userId: id,
      sessionsAttended: 0,
      quizzesCompleted: 0,
      learningStreak: 0
    });
    
    return { id, ...userData };
  }

  // Session methods
  async getAllSessions(): Promise<Session[]> {
    const sessionsRef = collection(db, 'sessions');
    const querySnapshot = await getDocs(sessionsRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Session[];
  }

  async getSession(id: string): Promise<Session | undefined> {
    const docRef = doc(db, 'sessions', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Session;
    }
    return undefined;
  }

  async signUpForSession(userId: string, sessionId: string): Promise<SessionSignup> {
    const signupData = {
      userId,
      sessionId,
      signedUpAt: serverTimestamp()
    };
    
    const signupsRef = collection(db, 'sessionSignups');
    const docRef = await addDoc(signupsRef, signupData);
    
    return {
      id: docRef.id,
      userId,
      sessionId,
      signedUpAt: new Date().toISOString()
    };
  }

  async getUserSessionSignups(userId: string): Promise<SessionSignup[]> {
    const signupsRef = collection(db, 'sessionSignups');
    const q = query(signupsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SessionSignup[];
  }

  async cancelSessionSignup(userId: string, sessionId: string): Promise<boolean> {
    const signupsRef = collection(db, 'sessionSignups');
    const q = query(
      signupsRef, 
      where('userId', '==', userId),
      where('sessionId', '==', sessionId)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docToDelete = querySnapshot.docs[0];
      await deleteDoc(docToDelete.ref);
      return true;
    }
    return false;
  }

  // Note methods
  async getAllNotes(): Promise<Note[]> {
    const notesRef = collection(db, 'notes');
    const q = query(notesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Note[];
  }

  async getNote(id: string): Promise<Note | undefined> {
    const docRef = doc(db, 'notes', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Note;
    }
    return undefined;
  }

  async createNote(noteData: Omit<Note, 'id' | 'createdAt' | 'likes' | 'comments'>): Promise<Note> {
    const noteWithDefaults = {
      ...noteData,
      likes: 0,
      comments: 0,
      createdAt: serverTimestamp()
    };
    
    const notesRef = collection(db, 'notes');
    const docRef = await addDoc(notesRef, noteWithDefaults);
    
    return {
      id: docRef.id,
      ...noteData,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString()
    };
  }

  // Like methods
  async likeNote(userId: string, noteId: string): Promise<Like> {
    // Check if already liked
    const likesRef = collection(db, 'likes');
    const q = query(
      likesRef,
      where('userId', '==', userId),
      where('noteId', '==', noteId)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const existingLike = querySnapshot.docs[0];
      return { id: existingLike.id, ...existingLike.data() } as Like;
    }

    // Create new like
    const likeData = {
      userId,
      noteId,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(likesRef, likeData);
    
    // Increment note likes count
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      likes: increment(1)
    });
    
    return {
      id: docRef.id,
      userId,
      noteId,
      createdAt: new Date().toISOString()
    };
  }

  async unlikeNote(userId: string, noteId: string): Promise<boolean> {
    const likesRef = collection(db, 'likes');
    const q = query(
      likesRef,
      where('userId', '==', userId),
      where('noteId', '==', noteId)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const likeDoc = querySnapshot.docs[0];
      await deleteDoc(likeDoc.ref);
      
      // Decrement note likes count
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, {
        likes: increment(-1)
      });
      
      return true;
    }
    return false;
  }

  async getUserLikes(userId: string): Promise<Like[]> {
    const likesRef = collection(db, 'likes');
    const q = query(likesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Like[];
  }

  // Comment methods
  async getNoteComments(noteId: string): Promise<Comment[]> {
    const commentsRef = collection(db, 'comments');
    const q = query(
      commentsRef,
      where('noteId', '==', noteId),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Comment[];
  }

  async createComment(commentData: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    const commentWithTimestamp = {
      ...commentData,
      createdAt: serverTimestamp()
    };
    
    const commentsRef = collection(db, 'comments');
    const docRef = await addDoc(commentsRef, commentWithTimestamp);
    
    // Increment note comments count
    const noteRef = doc(db, 'notes', commentData.noteId);
    await updateDoc(noteRef, {
      comments: increment(1)
    });
    
    return {
      id: docRef.id,
      ...commentData,
      createdAt: new Date().toISOString()
    };
  }

  // User stats methods
  async getUserStats(userId: string): Promise<UserStats> {
    const statsRef = collection(db, 'userStats');
    const q = query(statsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { ...doc.data() } as UserStats;
    }
    
    // Return default stats if none found
    return {
      userId,
      sessionsAttended: 0,
      quizzesCompleted: 0,
      learningStreak: 0
    };
  }

  async updateUserStats(userId: string, statsUpdate: Partial<UserStats>): Promise<UserStats> {
    const statsRef = collection(db, 'userStats');
    const q = query(statsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docToUpdate = querySnapshot.docs[0];
      await updateDoc(docToUpdate.ref, statsUpdate);
      
      const updatedDoc = await getDoc(docToUpdate.ref);
      return { ...updatedDoc.data() } as UserStats;
    }
    
    // Create new stats if none found
    const newStats = {
      userId,
      sessionsAttended: 0,
      quizzesCompleted: 0,
      learningStreak: 0,
      ...statsUpdate
    };
    
    await addDoc(statsRef, newStats);
    return newStats;
  }
}

export const firebaseStorage = new FirebaseStorage();