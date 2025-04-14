import WebSocket from 'ws';
import { log } from './vite';
import { IStorage } from './storage';
import { v4 as uuidv4 } from 'uuid';

interface WebRTCMessage {
  type: string;
  sessionId?: string;
  displayName?: string;
  from?: string;
  to?: string;
  data?: any;
}

export class WebRTCSignalingServer {
  private wss: WebSocket.Server;
  private clients: Map<string, WebSocket> = new Map();
  private storage: IStorage;

  constructor(wss: WebSocket.Server, storage: IStorage) {
    this.wss = wss;
    this.storage = storage;
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws: WebSocket) => {
      const clientId = uuidv4();
      this.clients.set(clientId, ws);
      
      log(`Client connected: ${clientId}`, 'webrtc');

      // Send the client ID to the client
      this.sendToClient(ws, {
        type: 'client-id',
        data: clientId
      });

      ws.on('message', async (message: string) => {
        try {
          const parsedMessage: WebRTCMessage = JSON.parse(message.toString());
          log(`Received message: ${JSON.stringify(parsedMessage)}`, 'webrtc');
          
          switch (parsedMessage.type) {
            case 'create-session':
              await this.handleCreateSession(clientId, parsedMessage);
              break;
            case 'join-session':
              await this.handleJoinSession(clientId, ws, parsedMessage);
              break;
            case 'offer':
            case 'answer':
            case 'ice-candidate':
              this.handleSignalingMessage(parsedMessage);
              break;
            case 'leave-session':
              await this.handleLeaveSession(clientId, parsedMessage);
              break;
            case 'end-session':
              await this.handleEndSession(clientId, parsedMessage);
              break;
            default:
              log(`Unknown message type: ${parsedMessage.type}`, 'webrtc');
          }
        } catch (error) {
          log(`Error processing message: ${error}`, 'webrtc');
        }
      });

      ws.on('close', async () => {
        log(`Client disconnected: ${clientId}`, 'webrtc');
        
        // Remove client from all sessions
        await this.storage.removeViewer(clientId);
        
        // Check if client was hosting any sessions and deactivate them
        const allSessions = await this.storage.getAllActiveSessions();
        for (const session of allSessions) {
          if (session.hostSocketId === clientId) {
            await this.storage.deactivateSession(session.sessionId);
            
            // Notify all viewers that the session has ended
            const viewers = await this.storage.getViewersBySessionId(session.sessionId);
            for (const viewer of viewers) {
              const viewerWs = this.clients.get(viewer.socketId);
              if (viewerWs && viewerWs.readyState === WebSocket.OPEN) {
                this.sendToClient(viewerWs, {
                  type: 'session-ended',
                  sessionId: session.sessionId
                });
              }
            }
          }
        }
        
        this.clients.delete(clientId);
      });
    });
  }

  private async handleCreateSession(clientId: string, message: WebRTCMessage) {
    const sessionId = this.generateSessionId();
    
    await this.storage.createSession({
      sessionId,
      hostSocketId: clientId
    });

    const clientWs = this.clients.get(clientId);
    if (clientWs && clientWs.readyState === WebSocket.OPEN) {
      this.sendToClient(clientWs, {
        type: 'session-created',
        sessionId
      });
    }
  }

  private async handleJoinSession(clientId: string, ws: WebSocket, message: WebRTCMessage) {
    if (!message.sessionId) {
      this.sendToClient(ws, {
        type: 'error',
        data: 'Session ID is required'
      });
      return;
    }

    const session = await this.storage.getActiveSessionById(message.sessionId);
    if (!session) {
      this.sendToClient(ws, {
        type: 'error',
        data: 'Session not found or inactive'
      });
      return;
    }

    // Add viewer to the session
    await this.storage.addViewer({
      sessionId: message.sessionId,
      socketId: clientId,
      displayName: message.displayName || 'Anonymous'
    });

    // Notify the host that a viewer has joined
    const hostWs = this.clients.get(session.hostSocketId);
    if (hostWs && hostWs.readyState === WebSocket.OPEN) {
      this.sendToClient(hostWs, {
        type: 'viewer-joined',
        from: clientId,
        data: {
          displayName: message.displayName || 'Anonymous'
        }
      });
    }

    // Confirm to the viewer that they've joined successfully
    this.sendToClient(ws, {
      type: 'session-joined',
      sessionId: message.sessionId,
      to: session.hostSocketId
    });
  }

  private async handleLeaveSession(clientId: string, message: WebRTCMessage) {
    if (!message.sessionId) return;

    await this.storage.removeViewer(clientId);

    const session = await this.storage.getSessionById(message.sessionId);
    if (session) {
      const hostWs = this.clients.get(session.hostSocketId);
      if (hostWs && hostWs.readyState === WebSocket.OPEN) {
        this.sendToClient(hostWs, {
          type: 'viewer-left',
          from: clientId
        });
      }
    }
  }

  private async handleEndSession(clientId: string, message: WebRTCMessage) {
    if (!message.sessionId) return;

    const session = await this.storage.getSessionById(message.sessionId);
    if (session && session.hostSocketId === clientId) {
      await this.storage.deactivateSession(message.sessionId);

      // Notify all viewers
      const viewers = await this.storage.getViewersBySessionId(message.sessionId);
      for (const viewer of viewers) {
        const viewerWs = this.clients.get(viewer.socketId);
        if (viewerWs && viewerWs.readyState === WebSocket.OPEN) {
          this.sendToClient(viewerWs, {
            type: 'session-ended',
            sessionId: message.sessionId
          });
        }
      }
    }
  }

  private handleSignalingMessage(message: WebRTCMessage) {
    if (!message.to) return;

    const targetWs = this.clients.get(message.to);
    if (targetWs && targetWs.readyState === WebSocket.OPEN) {
      this.sendToClient(targetWs, message);
    }
  }

  private sendToClient(ws: WebSocket, message: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private generateSessionId(): string {
    // Generate a readable, 12-character session ID
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    
    // Generate 3 groups of 4 characters separated by hyphens
    for (let g = 0; g < 3; g++) {
      for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      if (g < 2) result += '-';
    }
    
    return result;
  }
}
