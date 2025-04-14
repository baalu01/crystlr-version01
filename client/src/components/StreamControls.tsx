import { useState } from 'react';
import { Maximize, Mic, MicOff, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StreamControlsProps {
  isHost?: boolean;
  onToggleMic?: () => void;
  onToggleScreen?: () => void;
  onFullscreen?: () => void;
  onEndStream?: () => void;
  onLeaveStream?: () => void;
  isMicEnabled?: boolean;
  isScreenEnabled?: boolean;
  viewerCount?: number;
  duration?: string;
}

export default function StreamControls({
  isHost = false,
  onToggleMic,
  onToggleScreen,
  onFullscreen,
  onEndStream,
  onLeaveStream,
  isMicEnabled = false,
  isScreenEnabled = true,
  viewerCount = 0,
  duration = '00:00:00'
}: StreamControlsProps) {
  // Make the stream container fullscreen
  const handleFullscreen = () => {
    if (onFullscreen) {
      onFullscreen();
    } else {
      // Default fullscreen behavior
      const elem = document.documentElement;
      if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <>
      {/* Stream overlay - bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            {isHost ? (
              <>
                <Button 
                  onClick={onToggleMic} 
                  variant="ghost" 
                  size="icon" 
                  className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
                >
                  {isMicEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
                <Button 
                  onClick={onToggleScreen} 
                  variant="ghost" 
                  size="icon" 
                  className={`w-10 h-10 rounded-full ${isScreenEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                >
                  <Monitor className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleFullscreen} 
                variant="ghost" 
                size="icon" 
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
              >
                <Maximize className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          {isHost ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
                <span className="text-sm text-gray-700">{viewerCount} viewer{viewerCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
          ) : (
            <Button 
              onClick={onLeaveStream} 
              variant="destructive" 
              size="sm" 
              className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 rounded-md text-sm"
            >
              Leave Stream
            </Button>
          )}
        </div>
      </div>

      {/* If host, show session info and end stream button at the bottom */}
      {isHost && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h3 className="font-medium text-gray-800">Active Session</h3>
              <p className="text-sm text-gray-500">Duration: {duration}</p>
            </div>
            <Button 
              onClick={onEndStream} 
              variant="destructive" 
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              End Stream
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
