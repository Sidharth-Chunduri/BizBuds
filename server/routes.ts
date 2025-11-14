import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User registration
  app.post("/api/users/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const user = await storage.createUser(validatedData);
      
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Get all sessions
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  // Sign up for a session
  app.post("/api/sessions/:sessionId/signup", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const session = await storage.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      const signup = await storage.signUpForSession(userId, sessionId);
      res.status(201).json(signup);
    } catch (error) {
      res.status(500).json({ error: "Failed to sign up for session" });
    }
  });

  // Cancel session signup
  app.delete("/api/sessions/:sessionId/signup", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const success = await storage.cancelSessionSignup(userId, sessionId);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Signup not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to cancel signup" });
    }
  });

  // Get user's session signups
  app.get("/api/users/:userId/signups", async (req, res) => {
    try {
      const { userId } = req.params;
      const signups = await storage.getUserSessionSignups(userId);
      res.json(signups);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch signups" });
    }
  });

  // Get all notes
  app.get("/api/notes", async (req, res) => {
    try {
      const notes = await storage.getAllNotes();
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  // Create a note
  app.post("/api/notes", async (req, res) => {
    try {
      const { title, content, preview, author, authorId, hashtags } = req.body;

      if (!title || !content || !author || !authorId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const note = await storage.createNote({
        title,
        content,
        preview: preview || content.substring(0, 150) + "...",
        author,
        authorId,
        hashtags: hashtags || [],
        helpful: false
      });

      res.status(201).json(note);
    } catch (error) {
      res.status(500).json({ error: "Failed to create note" });
    }
  });

  // Like a note
  app.post("/api/notes/:noteId/like", async (req, res) => {
    try {
      const { noteId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const like = await storage.likeNote(userId, noteId);
      const note = await storage.getNote(noteId);
      res.status(201).json({ like, note });
    } catch (error) {
      res.status(500).json({ error: "Failed to like note" });
    }
  });

  // Unlike a note
  app.delete("/api/notes/:noteId/like", async (req, res) => {
    try {
      const { noteId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const success = await storage.unlikeNote(userId, noteId);
      if (success) {
        const note = await storage.getNote(noteId);
        res.json({ note });
      } else {
        res.status(404).json({ error: "Like not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to unlike note" });
    }
  });

  // Get user's likes
  app.get("/api/users/:userId/likes", async (req, res) => {
    try {
      const { userId } = req.params;
      const likes = await storage.getUserLikes(userId);
      res.json(likes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch likes" });
    }
  });

  // Get comments for a note
  app.get("/api/notes/:noteId/comments", async (req, res) => {
    try {
      const { noteId } = req.params;
      const comments = await storage.getNoteComments(noteId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  // Create a comment
  app.post("/api/notes/:noteId/comments", async (req, res) => {
    try {
      const { noteId } = req.params;
      const { userId, author, content } = req.body;

      if (!userId || !author || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const comment = await storage.createComment({
        noteId,
        userId,
        author,
        content
      });

      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  // Get user stats
  app.get("/api/users/:userId/stats", async (req, res) => {
    try {
      const { userId } = req.params;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
