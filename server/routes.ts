import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import WebSocket from "ws";
import { storage } from "./storage";
import { WebRTCSignalingServer } from "./webrtc";
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Set up WebSocket server on a different path than Vite's HMR
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws' 
  });

  // Initialize WebRTC signaling server
  const webRTCServer = new WebRTCSignalingServer(wss, storage);

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Check if a session exists and is active
  app.get('/api/sessions/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
    try {
      const session = await storage.getActiveSessionById(sessionId);
      if (session) {
        res.json({ 
          exists: true,
          active: session.active
        });
      } else {
        res.json({ 
          exists: false,
          active: false
        });
      }
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to check session',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get viewer count for a session
  app.get('/api/sessions/:sessionId/viewers', async (req, res) => {
    const { sessionId } = req.params;
    try {
      const viewers = await storage.getViewersBySessionId(sessionId);
      res.json({ count: viewers.length });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to get viewer count',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return httpServer;
}
