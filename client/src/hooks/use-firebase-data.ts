import { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';
import type { Note, Session, SessionSignup, UserStats, Comment, Like } from '@shared/schema';

// Custom hook to replace react-query with direct Firebase calls
export function useNotes() {
  const [data, setData] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const notes = await apiService.getAllNotes();
        setData(notes);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch notes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return { data, isLoading, error, refetch: () => fetchNotes() };
}

export function useSessions() {
  const [data, setData] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const sessions = await apiService.getAllSessions();
      setData(sessions);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sessions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return { data, isLoading, error, refetch: fetchSessions };
}

export function useUserStats() {
  const [data, setData] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const stats = await apiService.getUserStats();
      setData(stats);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user stats');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { data, isLoading, error, refetch: fetchStats };
}

export function useUserLikes() {
  const [data, setData] = useState<Like[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLikes = async () => {
    try {
      setIsLoading(true);
      const likes = await apiService.getUserLikes();
      setData(likes);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user likes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, []);

  return { data, isLoading, error, refetch: fetchLikes };
}

export function useUserSignups() {
  const [data, setData] = useState<SessionSignup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSignups = async () => {
    try {
      setIsLoading(true);
      const signups = await apiService.getUserSessionSignups();
      setData(signups);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user signups');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSignups();
  }, []);

  return { data, isLoading, error, refetch: fetchSignups };
}

export function useNoteComments(noteId: string) {
  const [data, setData] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const comments = await apiService.getNoteComments(noteId);
      setData(comments);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch comments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (noteId) {
      fetchComments();
    }
  }, [noteId]);

  return { data, isLoading, error, refetch: fetchComments };
}