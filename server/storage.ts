import { 
  type User, 
  type InsertUser,
  type Session,
  type SessionSignup,
  type Note,
  type Like,
  type Comment,
  type UserStats
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Session methods
  getAllSessions(): Promise<Session[]>;
  getSession(id: string): Promise<Session | undefined>;
  signUpForSession(userId: string, sessionId: string): Promise<SessionSignup>;
  getUserSessionSignups(userId: string): Promise<SessionSignup[]>;
  cancelSessionSignup(userId: string, sessionId: string): Promise<boolean>;

  // Note methods
  getAllNotes(): Promise<Note[]>;
  getNote(id: string): Promise<Note | undefined>;
  createNote(note: Omit<Note, "id" | "createdAt" | "likes" | "comments">): Promise<Note>;
  
  // Like methods
  likeNote(userId: string, noteId: string): Promise<Like>;
  unlikeNote(userId: string, noteId: string): Promise<boolean>;
  getUserLikes(userId: string): Promise<Like[]>;
  
  // Comment methods
  getNoteComments(noteId: string): Promise<Comment[]>;
  createComment(comment: Omit<Comment, "id" | "createdAt">): Promise<Comment>;

  // Stats methods
  getUserStats(userId: string): Promise<UserStats>;
  updateUserStats(userId: string, stats: Partial<UserStats>): Promise<UserStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private sessions: Map<string, Session>;
  private sessionSignups: Map<string, SessionSignup>;
  private notes: Map<string, Note>;
  private likes: Map<string, Like>;
  private comments: Map<string, Comment>;
  private userStats: Map<string, UserStats>;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.sessionSignups = new Map();
    this.notes = new Map();
    this.likes = new Map();
    this.comments = new Map();
    this.userStats = new Map();
    
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockSessions: Session[] = [
      {
        id: "t1",
        title: "Marketing Strategy Workshop",
        description: "Learn to create effective marketing campaigns and understand customer acquisition strategies.",
        date: "Monday, Nov 18",
        time: "2:00 PM - 3:30 PM",
        zoomLink: "#",
        type: "tutoring"
      },
      {
        id: "t2",
        title: "Financial Planning for Startups",
        description: "Master the basics of budgeting, forecasting, and managing startup finances.",
        date: "Tuesday, Nov 19",
        time: "4:00 PM - 5:30 PM",
        zoomLink: "#",
        type: "tutoring"
      },
      {
        id: "t3",
        title: "Pitch Deck Masterclass",
        description: "Create compelling pitch decks that attract investors and communicate your vision.",
        date: "Friday, Nov 22",
        time: "1:00 PM - 2:30 PM",
        zoomLink: "#",
        type: "tutoring"
      },
      {
        id: "t4",
        title: "Customer Discovery Workshop",
        description: "Learn interview techniques and frameworks to validate your business ideas.",
        date: "Saturday, Nov 23",
        time: "10:00 AM - 12:00 PM",
        zoomLink: "#",
        type: "tutoring"
      },
      {
        id: "g1",
        title: "Downtown Study Hub",
        description: "Group study opportunity at Central Library",
        location: "Central Library - Room 204",
        address: "123 Main Street, Downtown",
        date: "Weekdays",
        time: "3-6 PM",
        type: "group-study",
        zoomLink: ""
      },
      {
        id: "g2",
        title: "Campus Business Center",
        description: "Group study at Student Union Building",
        location: "Student Union Building",
        address: "University Campus, Building C",
        date: "Mon, Wed, Fri",
        time: "5-8 PM",
        type: "group-study",
        zoomLink: ""
      },
      {
        id: "g3",
        title: "Startup Co-working Space",
        description: "Weekend study sessions",
        location: "Innovation Hub",
        address: "456 Tech Ave, Suite 300",
        date: "Saturdays",
        time: "1-5 PM",
        type: "group-study",
        zoomLink: ""
      }
    ];

    mockSessions.forEach(session => this.sessions.set(session.id, session));

    const mockNotes: Note[] = [
      {
        id: "n1",
        title: "5 Customer Discovery Interview Mistakes to Avoid",
        content: "After conducting 50+ customer interviews, here are the biggest mistakes I made and what I learned from them. First, avoid leading questions...",
        preview: "After conducting 50+ customer interviews, here are the biggest mistakes I made and what I learned from them...",
        author: "Sarah Miller",
        authorId: "u1",
        hashtags: ["#customerdev", "#startups", "#lean"],
        likes: 42,
        comments: 2,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        helpful: true
      },
      {
        id: "n2",
        title: "Growth Hacking Tactics That Got Us to 1000 Users",
        content: "We went from 0 to 1000 users in 6 weeks using these specific growth tactics...",
        preview: "We went from 0 to 1000 users in 6 weeks using these specific growth tactics. Here's exactly what we did...",
        author: "Mike Chang",
        authorId: "u2",
        hashtags: ["#growth", "#marketing", "#saas"],
        likes: 87,
        comments: 1,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        helpful: true
      },
      {
        id: "n3",
        title: "How to Validate Your Business Idea Without Building Anything",
        content: "Validation doesn't require code. Here are 7 ways to test demand...",
        preview: "Validation doesn't require code. Here are 7 ways to test demand before you build a single feature...",
        author: "Emma Torres",
        authorId: "u3",
        hashtags: ["#validation", "#mvp", "#entrepreneurship"],
        likes: 56,
        comments: 0,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        helpful: false
      }
    ];

    mockNotes.forEach(note => this.notes.set(note.id, note));

    const mockComments: Comment[] = [
      {
        id: "c1",
        noteId: "n1",
        userId: "u10",
        author: "Alex Johnson",
        content: "Great insights! The part about leading questions really resonated.",
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      },
      {
        id: "c2",
        noteId: "n1",
        userId: "u11",
        author: "Jordan Lee",
        content: "This helped me prepare for my interviews next week. Thanks!",
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: "c3",
        noteId: "n2",
        userId: "u12",
        author: "Taylor Brooks",
        content: "Which tactic worked best for you?",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ];

    mockComments.forEach(comment => this.comments.set(comment.id, comment));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    
    this.userStats.set(id, {
      userId: id,
      sessionsAttended: 0,
      quizzesCompleted: 0,
      learningStreak: 0
    });
    
    return user;
  }

  async getAllSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values());
  }

  async getSession(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async signUpForSession(userId: string, sessionId: string): Promise<SessionSignup> {
    const id = randomUUID();
    const signup: SessionSignup = {
      id,
      userId,
      sessionId,
      signedUpAt: new Date().toISOString()
    };
    this.sessionSignups.set(id, signup);
    return signup;
  }

  async getUserSessionSignups(userId: string): Promise<SessionSignup[]> {
    return Array.from(this.sessionSignups.values()).filter(
      signup => signup.userId === userId
    );
  }

  async cancelSessionSignup(userId: string, sessionId: string): Promise<boolean> {
    const signup = Array.from(this.sessionSignups.values()).find(
      s => s.userId === userId && s.sessionId === sessionId
    );
    if (signup) {
      this.sessionSignups.delete(signup.id);
      return true;
    }
    return false;
  }

  async getAllNotes(): Promise<Note[]> {
    return Array.from(this.notes.values());
  }

  async getNote(id: string): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async createNote(noteData: Omit<Note, "id" | "createdAt" | "likes" | "comments">): Promise<Note> {
    const id = randomUUID();
    const note: Note = {
      ...noteData,
      id,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString()
    };
    this.notes.set(id, note);
    return note;
  }

  async likeNote(userId: string, noteId: string): Promise<Like> {
    const existingLike = Array.from(this.likes.values()).find(
      like => like.userId === userId && like.noteId === noteId
    );
    
    if (existingLike) {
      return existingLike;
    }

    const id = randomUUID();
    const like: Like = {
      id,
      userId,
      noteId,
      createdAt: new Date().toISOString()
    };
    this.likes.set(id, like);

    const note = this.notes.get(noteId);
    if (note) {
      note.likes += 1;
      this.notes.set(noteId, note);
    }

    return like;
  }

  async unlikeNote(userId: string, noteId: string): Promise<boolean> {
    const like = Array.from(this.likes.values()).find(
      l => l.userId === userId && l.noteId === noteId
    );
    
    if (like) {
      this.likes.delete(like.id);
      
      const note = this.notes.get(noteId);
      if (note && note.likes > 0) {
        note.likes -= 1;
        this.notes.set(noteId, note);
      }
      
      return true;
    }
    return false;
  }

  async getUserLikes(userId: string): Promise<Like[]> {
    return Array.from(this.likes.values()).filter(
      like => like.userId === userId
    );
  }

  async getNoteComments(noteId: string): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(
      comment => comment.noteId === noteId
    );
  }

  async createComment(commentData: Omit<Comment, "id" | "createdAt">): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = {
      ...commentData,
      id,
      createdAt: new Date().toISOString()
    };
    this.comments.set(id, comment);

    const note = this.notes.get(commentData.noteId);
    if (note) {
      note.comments += 1;
      this.notes.set(commentData.noteId, note);
    }

    return comment;
  }

  async getUserStats(userId: string): Promise<UserStats> {
    return this.userStats.get(userId) || {
      userId,
      sessionsAttended: 0,
      quizzesCompleted: 0,
      learningStreak: 0
    };
  }

  async updateUserStats(userId: string, statsUpdate: Partial<UserStats>): Promise<UserStats> {
    const currentStats = await this.getUserStats(userId);
    const updatedStats = { ...currentStats, ...statsUpdate };
    this.userStats.set(userId, updatedStats);
    return updatedStats;
  }
}

export const storage = new MemStorage();
