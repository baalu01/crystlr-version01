import { useEffect, useState, useRef, useCallback } from 'react';
import { peerConfig, connectToSignalingServer, getScreenShareStream, WebRTCMessage, ScreenShareOptions, defaultScreenShareOptions } from '@/utils/webrtc';
import { useToast } from '@/hooks/use-toast';

interface UseWebRTCProps {
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
  onRemoteStreamReceived?: (stream: MediaStream) => void;
  onError?: (error: Error) => void;
}

interface UseWebRTCReturn {
  socket: WebSocket | null;
  clientId: string | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  connectionState: RTCPeerConnectionState | null;
  createSession: () => Promise<string>;
  joinSession: (sessionId: string, displayName?: string) => Promise<void>;
  startScreenShare: (options?: Partial<ScreenShareOptions>) => Promise<void>;
  stopScreenShare: () => void;
  endSession: (sessionId: string) => void;
  leaveSession: (sessionId: string) => void;
  isInitiator: boolean;
  isConnected: boolean;
  isScreenSharing: boolean;
  error: Error | null;
}

export function useWebRTC({
  onConnectionStateChange,
  onRemoteStreamReceived,
  onError,
}: UseWebRTCProps = {}): UseWebRTCReturn {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isInitiator, setIsInitiator] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const remotePeerId = useRef<string | null>(null);
  const { toast } = useToast();

  // Set up WebSocket connection
  useEffect(() => {
    const ws = connectToSignalingServer();
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      cleanup();
      setError(new Error('WebSocket connection closed'));
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError(new Error('WebSocket connection error'));
      if (onError) onError(new Error('WebSocket connection error'));
    };

    return () => {
      ws.close();
      cleanup();
    };
  }, []);

  // Handle WebSocket messages
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = async (event) => {
      try {
        const message: WebRTCMessage = JSON.parse(event.data);
        console.log('WebSocket message received:', message);

        switch (message.type) {
          case 'client-id':
            setClientId(message.data);
            break;

          case 'session-created':
            setCurrentSessionId(message.sessionId!);
            setIsInitiator(true);
            break;

          case 'session-joined':
            setCurrentSessionId(message.sessionId!);
            remotePeerId.current = message.to!;
            break;

          case 'viewer-joined':
            // Host receives notification when viewer joins
            remotePeerId.current = message.from!;
            if (localStream && peerConnection.current) {
              createOffer();
            }
            break;

          case 'offer':
            handleOffer(message);
            break;

          case 'answer':
            handleAnswer(message);
            break;

          case 'ice-candidate':
            handleIceCandidate(message);
            break;

          case 'session-ended':
            // Handle session ended by host
            stopScreenShare();
            toast({
              title: "Session Ended",
              description: "The host has ended the screen sharing session.",
            });
            break;

          case 'error':
            const errorMsg = message.data || 'Unknown error';
            setError(new Error(errorMsg));
            if (onError) onError(new Error(errorMsg));
            toast({
              title: "Error",
              description: errorMsg,
              variant: "destructive",
            });
            break;
        }
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };
  }, [socket, localStream]);

  // Initialize peer connection
  const initPeerConnection = useCallback(() => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    peerConnection.current = new RTCPeerConnection(peerConfig);

    // Add local stream tracks to peer connection
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.current!.addTrack(track, localStream);
      });
    }

    // Handle remote stream
    peerConnection.current.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
        if (onRemoteStreamReceived) onRemoteStreamReceived(event.streams[0]);
      }
    };

    // Handle ICE candidates
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate && socket && socket.readyState === WebSocket.OPEN && remotePeerId.current) {
        socket.send(JSON.stringify({
          type: 'ice-candidate',
          from: clientId,
          to: remotePeerId.current,
          data: event.candidate,
        }));
      }
    };

    // Handle connection state changes
    peerConnection.current.onconnectionstatechange = () => {
      if (peerConnection.current) {
        const state = peerConnection.current.connectionState;
        setConnectionState(state);
        setIsConnected(state === 'connected');
        if (onConnectionStateChange) onConnectionStateChange(state);
        
        if (state === 'disconnected' || state === 'failed' || state === 'closed') {
          setIsConnected(false);
        }
      }
    };

    return peerConnection.current;
  }, [clientId, localStream, socket, onConnectionStateChange, onRemoteStreamReceived]);

  // Create an offer when host initiates connection
  const createOffer = useCallback(async () => {
    if (!peerConnection.current || !socket || !clientId || !remotePeerId.current) return;

    try {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'offer',
          from: clientId,
          to: remotePeerId.current,
          data: offer,
          sessionId: currentSessionId,
        }));
      }
    } catch (err) {
      console.error('Error creating offer:', err);
      setError(err instanceof Error ? err : new Error('Failed to create offer'));
      if (onError) onError(err instanceof Error ? err : new Error('Failed to create offer'));
    }
  }, [clientId, socket, currentSessionId]);

  // Handle incoming offer from peer
  const handleOffer = useCallback(async (message: WebRTCMessage) => {
    if (!socket || !clientId || socket.readyState !== WebSocket.OPEN) return;

    try {
      initPeerConnection();
      remotePeerId.current = message.from!;

      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(message.data));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        socket.send(JSON.stringify({
          type: 'answer',
          from: clientId,
          to: message.from,
          data: answer,
          sessionId: currentSessionId,
        }));
      }
    } catch (err) {
      console.error('Error handling offer:', err);
      setError(err instanceof Error ? err : new Error('Failed to handle offer'));
      if (onError) onError(err instanceof Error ? err : new Error('Failed to handle offer'));
    }
  }, [clientId, socket, currentSessionId, initPeerConnection]);

  // Handle incoming answer from peer
  const handleAnswer = useCallback(async (message: WebRTCMessage) => {
    if (!peerConnection.current) return;

    try {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(message.data));
    } catch (err) {
      console.error('Error handling answer:', err);
      setError(err instanceof Error ? err : new Error('Failed to handle answer'));
      if (onError) onError(err instanceof Error ? err : new Error('Failed to handle answer'));
    }
  }, []);

  // Handle incoming ICE candidate from peer
  const handleIceCandidate = useCallback(async (message: WebRTCMessage) => {
    if (!peerConnection.current) return;

    try {
      await peerConnection.current.addIceCandidate(new RTCIceCandidate(message.data));
    } catch (err) {
      console.error('Error handling ICE candidate:', err);
      // Don't treat this as a critical error, as some ICE candidates might fail normally
    }
  }, []);

  // Create a new session as host
  const createSession = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!socket || !clientId || socket.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      // Set up event handler for session creation response
      const handleMessage = (event: MessageEvent) => {
        try {
          const message: WebRTCMessage = JSON.parse(event.data);
          if (message.type === 'session-created' && message.sessionId) {
            socket.removeEventListener('message', handleMessage);
            resolve(message.sessionId);
          }
        } catch (err) {
          // Ignore other messages
        }
      };

      // Listen for session created response
      socket.addEventListener('message', handleMessage);

      // Send create session request
      socket.send(JSON.stringify({
        type: 'create-session',
        from: clientId,
      }));

      // Clean up event listener after 5 seconds
      setTimeout(() => {
        socket.removeEventListener('message', handleMessage);
        reject(new Error('Session creation timed out'));
      }, 5000);
    });
  }, [socket, clientId]);

  // Join an existing session as viewer
  const joinSession = useCallback(async (sessionId: string, displayName?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!socket || !clientId || socket.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      // Initialize a new peer connection
      initPeerConnection();

      // Set up event handler for session join response
      const handleMessage = (event: MessageEvent) => {
        try {
          const message: WebRTCMessage = JSON.parse(event.data);
          if (message.type === 'session-joined' && message.sessionId === sessionId) {
            socket.removeEventListener('message', handleMessage);
            resolve();
          } else if (message.type === 'error') {
            socket.removeEventListener('message', handleMessage);
            reject(new Error(message.data || 'Failed to join session'));
          }
        } catch (err) {
          // Ignore other messages
        }
      };

      // Listen for session joined response
      socket.addEventListener('message', handleMessage);

      // Send join session request
      socket.send(JSON.stringify({
        type: 'join-session',
        from: clientId,
        sessionId,
        displayName: displayName || 'Anonymous',
      }));

      // Clean up event listener after 5 seconds
      setTimeout(() => {
        socket.removeEventListener('message', handleMessage);
        reject(new Error('Join session timed out'));
      }, 5000);
    });
  }, [socket, clientId, initPeerConnection]);

  // Start screen sharing
  const startScreenShare = useCallback(async (options?: Partial<ScreenShareOptions>): Promise<void> => {
    if (!socket || !clientId) {
      throw new Error('WebSocket not connected');
    }

    try {
      // Combine default options with provided options
      const screenShareOptions = { ...defaultScreenShareOptions, ...options };
      
      // Get screen sharing stream
      const stream = await getScreenShareStream(screenShareOptions);
      
      // Handle the user canceling the screen share dialog
      if (!stream) {
        throw new Error('Screen sharing was cancelled');
      }

      // Stop any existing stream
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }

      // Set the new local stream
      setLocalStream(stream);
      setIsScreenSharing(true);

      // Handle stream ending (e.g., when user clicks "Stop sharing" in browser UI)
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

      // Re-initialize peer connection with new stream
      const pc = initPeerConnection();

      // If we already have a remote peer, send them an offer with the new stream
      if (remotePeerId.current && pc) {
        createOffer();
      }

      return;
    } catch (err) {
      console.error('Error starting screen share:', err);
      setError(err instanceof Error ? err : new Error('Failed to start screen sharing'));
      if (onError) onError(err instanceof Error ? err : new Error('Failed to start screen sharing'));
      throw err;
    }
  }, [socket, clientId, localStream, initPeerConnection, createOffer]);

  // Stop screen sharing
  const stopScreenShare = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setIsScreenSharing(false);
  }, [localStream]);

  // End a session (host only)
  const endSession = useCallback((sessionId: string) => {
    if (!socket || !clientId || socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify({
      type: 'end-session',
      from: clientId,
      sessionId,
    }));

    stopScreenShare();
    setCurrentSessionId(null);
    setIsInitiator(false);
  }, [socket, clientId, stopScreenShare]);

  // Leave a session (viewer only)
  const leaveSession = useCallback((sessionId: string) => {
    if (!socket || !clientId || socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify({
      type: 'leave-session',
      from: clientId,
      sessionId,
    }));

    setRemoteStream(null);
    setCurrentSessionId(null);
    
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
  }, [socket, clientId]);

  // Clean up resources
  const cleanup = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    
    setRemoteStream(null);
    setIsScreenSharing(false);
    setIsInitiator(false);
    setIsConnected(false);
    setCurrentSessionId(null);
  }, [localStream]);

  return {
    socket,
    clientId,
    localStream,
    remoteStream,
    connectionState,
    createSession,
    joinSession,
    startScreenShare,
    stopScreenShare,
    endSession,
    leaveSession,
    isInitiator,
    isConnected,
    isScreenSharing,
    error,
  };
}
