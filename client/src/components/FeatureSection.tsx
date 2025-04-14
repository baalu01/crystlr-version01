import { Zap, Lock, Monitor, Globe, Laugh, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/ThemeContext';

export default function FeatureSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="my-24">
      <div className={`rounded-2xl ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
          : 'bg-gradient-to-br from-gray-50 to-blue-50'
        } border border-border overflow-hidden`}>
        <div className="p-12 md:p-16">
          <div className="text-center mb-16">
            <h2 className="mb-4">Why Choose <span className="gradient-text">Crystlr</span></h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Designed for simplicity and performance, Crystlr offers a premium screen sharing experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="premium-card p-6 rounded-xl shadow-sm">
              <div className={`w-12 h-12 ${isDark ? 'bg-blue-950' : 'bg-blue-50'} rounded-lg flex items-center justify-center mb-4`}>
                <Zap className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Ultra Low Latency</h3>
              <p className="text-foreground/70">Experience real-time screen sharing with minimal delay, perfect for demonstrations and collaborative work.</p>
            </div>
            
            <div className="premium-card p-6 rounded-xl shadow-sm">
              <div className={`w-12 h-12 ${isDark ? 'bg-blue-950' : 'bg-blue-50'} rounded-lg flex items-center justify-center mb-4`}>
                <Lock className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Enterprise-Grade Security</h3>
              <p className="text-foreground/70">All connections are encrypted end-to-end, ensuring your content remains completely private and secure.</p>
            </div>
            
            <div className="premium-card p-6 rounded-xl shadow-sm">
              <div className={`w-12 h-12 ${isDark ? 'bg-blue-950' : 'bg-blue-50'} rounded-lg flex items-center justify-center mb-4`}>
                <Monitor className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Crystal Clear Quality</h3>
              <p className="text-foreground/70">Share your screen in high definition with optimized quality settings for both text and video content.</p>
            </div>
            
            <div className="premium-card p-6 rounded-xl shadow-sm">
              <div className={`w-12 h-12 ${isDark ? 'bg-blue-950' : 'bg-blue-50'} rounded-lg flex items-center justify-center mb-4`}>
                <Globe className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Cross-Platform Compatibility</h3>
              <p className="text-foreground/70">Works seamlessly across all modern browsers and devices, with no downloads or installations required.</p>
            </div>
            
            <div className="premium-card p-6 rounded-xl shadow-sm">
              <div className={`w-12 h-12 ${isDark ? 'bg-blue-950' : 'bg-blue-50'} rounded-lg flex items-center justify-center mb-4`}>
                <Laugh className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Effortless Experience</h3>
              <p className="text-foreground/70">Designed with simplicity in mind, allowing anyone to start or join a screen sharing session in seconds.</p>
            </div>
            
            <div className="premium-card p-6 rounded-xl shadow-sm">
              <div className={`w-12 h-12 ${isDark ? 'bg-blue-950' : 'bg-blue-50'} rounded-lg flex items-center justify-center mb-4`}>
                <Cpu className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Resource Efficient</h3>
              <p className="text-foreground/70">Optimized to use minimal system resources, ensuring smooth performance even on lower-end devices.</p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-lg">
              Start Sharing Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
