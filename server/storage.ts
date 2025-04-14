import { users, type User, type InsertUser, sessions, type Session, type InsertSession, viewers, type Viewer, type InsertViewer } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Session methods
  createSession(session: InsertSession): Promise<Session>;
  getSessionById(sessionId: string): Promise<Session | undefined>;
  getActiveSessionById(sessionId: string): Promise<Session | undefined>;
  deactivateSession(sessionId: string): Promise<boolean>;
  getAllActiveSessions(): Promise<Session[]>;
  
  // Viewer methods
  addViewer(viewer: InsertViewer): Promise<Viewer>;
  getViewersBySessionId(sessionId: string): Promise<Viewer[]>;
  removeViewer(socketId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sessions: Map<string, Session>;
  private viewers: Viewer[];
  private userIdCounter: number;
  private sessionIdCounter: number;
  private viewerIdCounter: number;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.viewers = [];
    this.userIdCounter = 1;
    this.sessionIdCounter = 1;
    this.viewerIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Session methods
  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.sessionIdCounter++;
    const createdAt = new Date();
    const session: Session = { 
      ...insertSession, 
      id, 
      active: true, 
      createdAt 
    };
    this.sessions.set(insertSession.sessionId, session);
    return session;
  }

  async getSessionById(sessionId: string): Promise<Session | undefined> {
    return this.sessions.get(sessionId);
  }

  async getActiveSessionById(sessionId: string): Promise<Session | undefined> {
    const session = this.sessions.get(sessionId);
    if (session && session.active) {
      return session;
    }
    return undefined;
  }

  async deactivateSession(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.active = false;
      this.sessions.set(sessionId, session);
      return true;
    }
    return false;
  }

  async getAllActiveSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(session => session.active);
  }

  // Viewer methods
  async addViewer(insertViewer: InsertViewer): Promise<Viewer> {
    const id = this.viewerIdCounter++;
    const createdAt = new Date();
    const viewer: Viewer = { ...insertViewer, id, createdAt };
    this.viewers.push(viewer);
    return viewer;
  }

  async getViewersBySessionId(sessionId: string): Promise<Viewer[]> {
    return this.viewers.filter(viewer => viewer.sessionId === sessionId);
  }

  async removeViewer(socketId: string): Promise<boolean> {
    const index = this.viewers.findIndex(viewer => viewer.socketId === socketId);
    if (index !== -1) {
      this.viewers.splice(index, 1);
      return true;
    }
    return false;
  }
}

export const storage = new MemStorage();
