import { firebaseStorage } from './firebase-storage';
import { authService } from './auth';
import type { 
  Note, 
  Session, 
  Comment, 
  Like, 
  SessionSignup, 
  UserStats 
} from '@shared/schema';

// API service that replaces Express routes with direct Firebase calls
export class ApiService {
  // User registration (handled by auth service)
  async register(userData: {
    name: string;
    email: string;
    password: string;
    school?: string;
    interests?: string;
  }) {
    return await authService.register(userData);
  }

  // Session methods
  async getAllSessions(): Promise<Session[]> {
    return await firebaseStorage.getAllSessions();
  }

  async signUpForSession(sessionId: string): Promise<SessionSignup> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    return await firebaseStorage.signUpForSession(currentUser.id, sessionId);
  }

  async cancelSessionSignup(sessionId: string): Promise<boolean> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    return await firebaseStorage.cancelSessionSignup(currentUser.id, sessionId);
  }

  async getUserSessionSignups(): Promise<SessionSignup[]> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    return await firebaseStorage.getUserSessionSignups(currentUser.id);
  }

  // Note methods
  async getAllNotes(): Promise<Note[]> {
    return await firebaseStorage.getAllNotes();
  }

  async createNote(noteData: {
    title: string;
    content: string;
    preview?: string;
    hashtags?: string[];
  }): Promise<Note> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    return await firebaseStorage.createNote({
      ...noteData,
      preview: noteData.preview || noteData.content.substring(0, 150) + '...',
      author: currentUser.name,
      authorId: currentUser.id,
      hashtags: noteData.hashtags || [],
      helpful: false
    });
  }

  async likeNote(noteId: string): Promise<{ like: Like; note: Note }> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const like = await firebaseStorage.likeNote(currentUser.id, noteId);
    const note = await firebaseStorage.getNote(noteId);
    
    if (!note) {
      throw new Error('Note not found');
    }

    return { like, note };
  }

  async unlikeNote(noteId: string): Promise<{ note: Note }> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const success = await firebaseStorage.unlikeNote(currentUser.id, noteId);
    if (!success) {
      throw new Error('Like not found');
    }

    const note = await firebaseStorage.getNote(noteId);
    if (!note) {
      throw new Error('Note not found');
    }

    return { note };
  }

  async getUserLikes(): Promise<Like[]> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    return await firebaseStorage.getUserLikes(currentUser.id);
  }

  // Comment methods
  async getNoteComments(noteId: string): Promise<Comment[]> {
    return await firebaseStorage.getNoteComments(noteId);
  }

  async createComment(noteId: string, content: string): Promise<Comment> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    return await firebaseStorage.createComment({
      noteId,
      userId: currentUser.id,
      author: currentUser.name,
      content
    });
  }

  // User stats methods
  async getUserStats(): Promise<UserStats> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    return await firebaseStorage.getUserStats(currentUser.id);
  }

  async updateUserStats(statsUpdate: Partial<UserStats>): Promise<UserStats> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    return await firebaseStorage.updateUserStats(currentUser.id, statsUpdate);
  }
}

export const apiService = new ApiService();