import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useSession } from '@/hooks/useSession';
import { formatSessionId, parseSessionId } from '@/utils/webrtc';
import StreamControls from '@/components/StreamControls';
import ErrorModal from '@/components/ErrorModal';

// Form validation schema
const joinSessionSchema = z.object({
  sessionCode: z.string().min(8, "Enter a valid session code"),
  displayName: z.string().optional(),
});

type FormValues = z.infer<typeof joinSessionSchema>;

export default function JoinSession() {
  const [location, setLocation] = useLocation();
  const [isJoined, setIsJoined] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hostName, setHostName] = useState('Host');
  const [isConnecting, setIsConnecting] = useState(false);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const { checkSessionExists } = useSession();
  
  const {
    joinSession,
    leaveSession,
    remoteStream,
    error: webRTCError,
    isConnected
  } = useWebRTC({
    onRemoteStreamReceived: (stream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    },
    onError: (err) => {
      setErrorMessage(err.message);
      setShowErrorModal(true);
      setIsConnecting(false);
    }
  });

  // Set up the form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(joinSessionSchema),
    defaultValues: {
      sessionCode: '',
      displayName: '',
    },
  });

  // Check for session code in URL query params on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinParam = params.get('join');
    
    if (joinParam) {
      // Format: Remove any spaces, keep hyphens for display
      const formattedCode = joinParam.trim().toUpperCase();
      form.setValue('sessionCode', formattedCode);
      
      // Clean URL without refreshing the page
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [form]);

  // Watch for WebRTC errors
  useEffect(() => {
    if (webRTCError) {
      setErrorMessage(webRTCError.message);
      setShowErrorModal(true);
      setIsConnecting(false);
    }
  }, [webRTCError]);

  // Update video element when remote stream changes
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      setIsConnecting(false);
    }
  }, [remoteStream]);

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      // Clean up the session code (remove hyphens, spaces, etc.)
      const cleanSessionId = parseSessionId(data.sessionCode);
      
      setIsConnecting(true);
      
      // Check if session exists first
      const sessionExists = await checkSessionExists(cleanSessionId);
      if (!sessionExists) {
        toast({
          title: "Session Not Found",
          description: "The session code you entered does not exist or is inactive.",
          variant: "destructive",
        });
        setIsConnecting(false);
        return;
      }
      
      // Join the WebRTC session
      await joinSession(cleanSessionId, data.displayName || 'Anonymous');
      
      setSessionId(cleanSessionId);
      setIsJoined(true);
      
      toast({
        title: "Connected",
        description: "You have joined the screen sharing session.",
      });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to join session");
      setShowErrorModal(true);
      setIsConnecting(false);
    }
  };

  // Handle leaving the stream
  const handleLeaveStream = () => {
    if (sessionId) {
      leaveSession(sessionId);
      setSessionId(null);
      setIsJoined(false);
      
      toast({
        title: "Disconnected",
        description: "You have left the screen sharing session.",
      });
    }
  };

  // Handle fullscreen
  const handleFullscreen = () => {
    if (remoteVideoRef.current) {
      if (!document.fullscreenElement) {
        remoteVideoRef.current.requestFullscreen().catch(err => {
          toast({
            title: "Fullscreen Error",
            description: `Error attempting to enable fullscreen: ${err.message}`,
            variant: "destructive",
          });
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="space-y-8">
      {!isJoined ? (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Join a Screen Sharing Session</h2>
            <p className="text-gray-600 mb-6">Enter the session code provided by the host to join their screen sharing session.</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="sessionCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Session Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="XXXX-XXXX-XXXX" 
                          {...field} 
                          className="font-mono"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the code exactly as it was shared with you
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Display Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormDescription>
                        This name will be visible to the host
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isConnecting}>
                  {isConnecting ? 'Connecting...' : 'Join Session'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="bg-gray-800 relative" style={{ height: '540px' }}>
            {/* Remote Stream */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-contain"
            />
            
            {!remoteStream && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center animate-pulse">
                  <div className="inline-block border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full w-12 h-12 animate-spin mb-4"></div>
                  <p className="text-gray-400">Connecting to host's screen...</p>
                </div>
              </div>
            )}
            
            {/* Top overlay - Stream info */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-white text-sm">{hostName}'s Screen</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-green-500/20 text-white border-green-500/40 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    Live
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Stream Controls */}
            <StreamControls 
              isHost={false}
              onFullscreen={handleFullscreen}
              onLeaveStream={handleLeaveStream}
            />
          </div>
        </Card>
      )}
      
      {/* Error Modal */}
      <ErrorModal 
        open={showErrorModal} 
        onOpenChange={setShowErrorModal}
        onTryAgain={() => {
          setShowErrorModal(false);
          form.handleSubmit(onSubmit)();
        }}
        onClose={() => setShowErrorModal(false)}
        errorMessage={errorMessage}
      />
    </div>
  );
}
