import { useState, useEffect, useRef } from 'react';
import { PlayIcon, Copy, Plus, Mail, Link as LinkIcon, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import PermissionsModal from '@/components/PermissionsModal';
import StreamControls from '@/components/StreamControls';
import { useWebRTC } from '@/hooks/useWebRTC';
import { formatSessionId } from '@/utils/webrtc';
import { useSession } from '@/hooks/useSession';
import { useTheme } from '@/lib/ThemeContext';

export default function HostSession() {
  const [isSessionCreated, setIsSessionCreated] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [shareOption, setShareOption] = useState('entireScreen');
  const [shareAudio, setShareAudio] = useState(false);
  const [optimizeVideo, setOptimizeVideo] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [duration, setDuration] = useState('00:00:00');
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const durationRef = useRef<NodeJS.Timeout | null>(null);
  const streamStartTimeRef = useRef<number | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const { getViewerCount } = useSession();
  
  const {
    createSession,
    startScreenShare,
    stopScreenShare,
    endSession,
    localStream,
    isScreenSharing,
    error
  } = useWebRTC({
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  });

  // Update the video element when local stream changes
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Update viewer count periodically
  useEffect(() => {
    if (isStreaming && sessionId) {
      const interval = setInterval(async () => {
        const count = await getViewerCount(sessionId);
        setViewerCount(count);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isStreaming, sessionId, getViewerCount]);

  // Update duration timer
  useEffect(() => {
    if (isStreaming && !durationRef.current) {
      streamStartTimeRef.current = Date.now();
      durationRef.current = setInterval(() => {
        if (streamStartTimeRef.current) {
          const elapsed = Date.now() - streamStartTimeRef.current;
          const hours = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
          const minutes = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
          const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
          setDuration(`${hours}:${minutes}:${seconds}`);
        }
      }, 1000);
    } else if (!isStreaming && durationRef.current) {
      clearInterval(durationRef.current);
      durationRef.current = null;
      streamStartTimeRef.current = null;
    }

    return () => {
      if (durationRef.current) {
        clearInterval(durationRef.current);
      }
    };
  }, [isStreaming]);

  // Handle session creation
  const handleCreateSession = async () => {
    try {
      const id = await createSession();
      setSessionId(id);
      setIsSessionCreated(true);
      toast({
        title: "Session Created",
        description: `Your session code is ${formatSessionId(id)}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create session",
        variant: "destructive",
      });
    }
  };

  // Handle start streaming
  const handleStartStreaming = () => {
    setShowPermissionsModal(true);
  };

  // Handle permissions confirmation
  const handlePermissionsConfirm = async () => {
    setShowPermissionsModal(false);
    
    try {
      // Map UI options to screen share options
      const displaySurface = 
        shareOption === 'entireScreen' ? 'monitor' : 
        shareOption === 'applicationWindow' ? 'window' : 'browser';
      
      await startScreenShare({
        audio: shareAudio,
        displaySurface: displaySurface as 'monitor' | 'window' | 'browser',
        optimizeFor: optimizeVideo ? 'quality' : 'performance'
      });
      
      setIsStreaming(true);
    } catch (err) {
      toast({
        title: "Screen Sharing Error",
        description: err instanceof Error ? err.message : "Failed to start screen sharing",
        variant: "destructive",
      });
    }
  };

  // Handle end stream
  const handleEndStream = () => {
    stopScreenShare();
    setIsStreaming(false);
    
    toast({
      title: "Stream Ended",
      description: "Your screen sharing session has ended.",
    });
  };

  // Handle end session
  const handleEndSession = () => {
    if (sessionId) {
      endSession(sessionId);
      setSessionId(null);
      setIsSessionCreated(false);
      setIsStreaming(false);
      
      toast({
        title: "Session Ended",
        description: "Your session has been terminated.",
      });
    }
  };

  // Copy session code to clipboard
  const handleCopyCode = () => {
    if (sessionId) {
      navigator.clipboard.writeText(formatSessionId(sessionId));
      toast({
        title: "Copied!",
        description: "Session code copied to clipboard",
      });
    }
  };

  // Copy invite link to clipboard
  const handleCopyInviteLink = () => {
    if (sessionId) {
      const inviteLink = `${window.location.origin}?join=${formatSessionId(sessionId)}`;
      navigator.clipboard.writeText(inviteLink);
      toast({
        title: "Copied!",
        description: "Invite link copied to clipboard",
      });
    }
  };

  // Send invite via email
  const handleShareEmail = () => {
    if (sessionId) {
      const inviteLink = `${window.location.origin}?join=${formatSessionId(sessionId)}`;
      const subject = "Join my screen sharing session";
      const body = `I'd like to share my screen with you. Please join using this link: ${inviteLink}`;
      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
  };

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-8">
      {/* Session Creation Card */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-medium text-foreground mb-4">Create a Screen Sharing Session</h2>
          <p className="text-foreground/70 mb-6">Share your screen with anyone by creating a session and sharing the unique code.</p>
          
          {!isSessionCreated ? (
            <div id="preSessionControls" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button onClick={handleCreateSession} className="flex items-center justify-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Session
                </Button>
                <div className="text-sm text-foreground/60 flex items-center">
                  <span className="inline-block mr-1">ⓘ</span>
                  Your screen will not be shared until you start streaming
                </div>
              </div>
              
              {/* Stream Options */}
              <div className={`${isDark ? 'bg-card' : 'bg-gray-50'} p-4 rounded-md border border-border`}>
                <h3 className="font-medium text-foreground mb-3">Sharing Options</h3>
                <RadioGroup defaultValue="entireScreen" onValueChange={setShareOption} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="entireScreen" id="entireScreen" />
                    <Label htmlFor="entireScreen" className="text-foreground">Entire Screen</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="applicationWindow" id="applicationWindow" />
                    <Label htmlFor="applicationWindow" className="text-foreground">Application Window</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="browserTab" id="browserTab" />
                    <Label htmlFor="browserTab" className="text-foreground">Browser Tab</Label>
                  </div>
                </RadioGroup>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="shareAudio" 
                      checked={shareAudio} 
                      onCheckedChange={(checked) => setShareAudio(checked === true)}
                    />
                    <Label htmlFor="shareAudio" className="text-foreground">Share system audio</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="optimizeVideo" 
                      checked={optimizeVideo} 
                      onCheckedChange={(checked) => setOptimizeVideo(checked === true)}
                    />
                    <Label htmlFor="optimizeVideo" className="text-foreground">Optimize for video quality</Label>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div id="sessionCreatedControls" className="space-y-6">
              <div className={`${isDark ? 'bg-card' : 'bg-gray-50'} p-4 rounded-md border border-border`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-foreground">Session Code</h3>
                  <Badge variant="outline" className={`${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'} hover:bg-green-100`}>
                    Active
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="sessionCode" 
                    value={sessionId ? formatSessionId(sessionId) : ''} 
                    readOnly 
                    className="font-mono"
                  />
                  <Button variant="outline" size="icon" onClick={handleCopyCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-xs text-foreground/60">Share this code with anyone you want to view your screen</p>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <Button variant="link" className="flex items-center p-0 h-auto" onClick={handleCopyInviteLink}>
                  <LinkIcon className="h-4 w-4 mr-1" />
                  Copy invite link
                </Button>
                <Button variant="link" className="flex items-center p-0 h-auto" onClick={handleShareEmail}>
                  <Mail className="h-4 w-4 mr-1" />
                  Send via email
                </Button>
              </div>
              
              <div className="border-t border-border pt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <Button 
                  variant="default" 
                  className="bg-accent hover:bg-green-600 text-white flex items-center justify-center"
                  onClick={handleStartStreaming}
                  disabled={isStreaming}
                >
                  <PlayIcon className="h-4 w-4 mr-2" />
                  {isStreaming ? 'Streaming...' : 'Start Streaming'}
                </Button>
                <Button 
                  variant="link" 
                  className="text-red-600 hover:text-red-800" 
                  onClick={handleEndSession}
                >
                  End Session
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Active Streaming Card - only shown when streaming */}
      {isStreaming && (
        <Card className="overflow-hidden">
          <div className="bg-gray-800 relative" style={{ height: '480px' }}>
            {/* Stream Preview */}
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-contain"
            />
            
            {!localStream && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-center">
                <div>
                  <Monitor className="h-16 w-16 mb-4 opacity-40 mx-auto" />
                  <p className="text-gray-400">Waiting for screen sharing to start...</p>
                </div>
              </div>
            )}
            
            {/* Top overlay - Stream info */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-white text-sm font-medium">Your Screen</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-red-500/20 text-white border-red-500/40 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                    Live
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Stream Controls */}
            <StreamControls 
              isHost={true}
              onToggleMic={() => setIsMicEnabled(!isMicEnabled)}
              onToggleScreen={handleEndStream}
              onEndStream={handleEndStream}
              isMicEnabled={isMicEnabled}
              isScreenEnabled={true}
              viewerCount={viewerCount}
              duration={duration}
            />
          </div>
        </Card>
      )}
      
      {/* Permissions Modal */}
      <PermissionsModal 
        open={showPermissionsModal} 
        onOpenChange={setShowPermissionsModal}
        onConfirm={handlePermissionsConfirm}
        onCancel={() => setShowPermissionsModal(false)}
      />
    </div>
  );
}
