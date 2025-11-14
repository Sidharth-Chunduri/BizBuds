import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  school: text("school"),
  interests: text("interests"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Learning Path
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalModules: number;
}

// Session
export interface Session {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  zoomLink: string;
  type: 'tutoring' | 'group-study';
  location?: string;
  address?: string;
}

// Session Sign-up
export interface SessionSignup {
  id: string;
  userId: string;
  sessionId: string;
  signedUpAt: string;
}

// Course
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  modules: number;
  thumbnailUrl?: string;
}

// Quiz
export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  questions: number;
  completed: boolean;
}

// Video
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  uploader: string;
  uploaderId: string;
  views: number;
  createdAt: string;
}

// Lesson/Article
export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  approved: boolean;
  author: string;
  createdAt: string;
}

// Downloadable Material
export interface Material {
  id: string;
  title: string;
  description: string;
  fileType: string;
  downloadUrl: string;
  downloads: number;
}

// Note (for Explore page)
export interface Note {
  id: string;
  title: string;
  content: string;
  preview: string;
  author: string;
  authorId: string;
  avatarUrl?: string;
  hashtags: string[];
  likes: number;
  comments: number;
  createdAt: string;
  helpful: boolean;
}

// Like
export interface Like {
  id: string;
  userId: string;
  noteId: string;
  createdAt: string;
}

// Comment
export interface Comment {
  id: string;
  noteId: string;
  userId: string;
  author: string;
  content: string;
  createdAt: string;
}

// Achievement
export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

// Activity
export interface Activity {
  id: string;
  userId: string;
  type: 'quiz' | 'session' | 'course' | 'note';
  description: string;
  timestamp: string;
  icon: string;
}

// User Stats
export interface UserStats {
  userId: string;
  sessionsAttended: number;
  quizzesCompleted: number;
  learningStreak: number;
}

// Success Story
export interface SuccessStory {
  id: string;
  studentName: string;
  story: string;
  achievement: string;
  imageUrl?: string;
}

// Business of the Month
export interface BusinessOfMonth {
  id: string;
  businessName: string;
  description: string;
  tags: string[];
  featured: boolean;
}

// Top Contributor
export interface TopContributor {
  id: string;
  name: string;
  badge: string;
  notesCount: number;
  helpfulVotes: number;
  avatarUrl?: string;
}
