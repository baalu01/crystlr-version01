// Configuration for RTCPeerConnection
export const peerConfig: RTCConfiguration = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

// Types for WebRTC messages
export interface WebRTCMessage {
  type: string;
  sessionId?: string;
  displayName?: string;
  from?: string;
  to?: string;
  data?: any;
}

// Screen sharing options
export interface ScreenShareOptions {
  audio: boolean;
  video: boolean;
  displaySurface: 'monitor' | 'window' | 'browser';
  optimizeFor: 'quality' | 'performance';
}

// Default screen sharing options
export const defaultScreenShareOptions: ScreenShareOptions = {
  audio: false,
  video: true,
  displaySurface: 'monitor',
  optimizeFor: 'quality',
};

// Get media stream for screen sharing based on options
export async function getScreenShareStream(options: ScreenShareOptions): Promise<MediaStream> {
  const mediaOptions: MediaStreamConstraints = {
    audio: options.audio,
    video: {
      // @ts-ignore - TypeScript doesn't know about these experimental properties
      displaySurface: options.displaySurface,
      logicalSurface: true,
      cursor: 'always',
      // Frame rate and resolution for quality
      frameRate: options.optimizeFor === 'quality' ? { ideal: 30, max: 60 } : { ideal: 15, max: 30 },
      width: options.optimizeFor === 'quality' ? { ideal: 1920, max: 3840 } : { ideal: 1280, max: 1920 },
      height: options.optimizeFor === 'quality' ? { ideal: 1080, max: 2160 } : { ideal: 720, max: 1080 },
    },
  };

  // @ts-ignore - TypeScript doesn't know about getDisplayMedia
  return navigator.mediaDevices.getDisplayMedia(mediaOptions);
}

// Connect to WebSocket server
export function connectToSignalingServer(): WebSocket {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}/ws`;
  return new WebSocket(wsUrl);
}

// Format session ID for display (XXXX-XXXX-XXXX)
export function formatSessionId(sessionId: string): string {
  if (!sessionId) return '';
  
  // If already formatted, return as is
  if (sessionId.includes('-')) return sessionId;
  
  // Format into XXXX-XXXX-XXXX pattern
  const parts = [];
  for (let i = 0; i < sessionId.length; i += 4) {
    parts.push(sessionId.slice(i, i + 4));
  }
  return parts.join('-');
}

// Parse session ID from formatted display (remove hyphens)
export function parseSessionId(formattedId: string): string {
  return formattedId.replace(/-/g, '');
}
