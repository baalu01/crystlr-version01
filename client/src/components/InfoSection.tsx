import { Plus, Share2, PlayCircle, ArrowRight } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

export default function InfoSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="mt-24 mb-16">
      <div className="text-center mb-14">
        <h2 className="mb-4">How <span className="gradient-text">Crystlr</span> Works</h2>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          Share your screen in three simple steps with no downloads or accounts required.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connecting line in the background (visible on md screens and up) */}
        <div 
          className={`hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r ${
            isDark ? 'from-blue-950 via-primary to-blue-950' : 'from-blue-100 via-primary to-blue-100'
          }`} 
          style={{ width: '70%', margin: '0 auto' }}
        ></div>
        
        <div className="premium-card p-8 rounded-xl shadow-sm relative z-10">
          <div className={`w-16 h-16 ${isDark ? 'bg-blue-950' : 'bg-blue-50'} rounded-xl flex items-center justify-center mb-6 mx-auto`}>
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium text-foreground mb-3 text-center">Create a Session</h3>
          <p className="text-foreground/70 text-center">Generate a unique session with your preferred sharing options.</p>
          <div className="flex justify-center mt-6">
            <span className={`${isDark ? 'bg-blue-950' : 'bg-blue-50'} text-primary text-xs font-medium px-3 py-1 rounded-full`}>Step 1</span>
          </div>
        </div>
        
        <div className="premium-card p-8 rounded-xl shadow-sm relative z-10 md:mt-12">
          <div className={`w-16 h-16 ${isDark ? 'bg-blue-950' : 'bg-blue-50'} rounded-xl flex items-center justify-center mb-6 mx-auto`}>
            <Share2 className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium text-foreground mb-3 text-center">Share the Link</h3>
          <p className="text-foreground/70 text-center">Send the generated code or link to your viewers through any platform.</p>
          <div className="flex justify-center mt-6">
            <span className={`${isDark ? 'bg-blue-950' : 'bg-blue-50'} text-primary text-xs font-medium px-3 py-1 rounded-full`}>Step 2</span>
          </div>
          <div className="hidden md:block absolute -left-4 top-1/2 transform -translate-y-1/2 text-primary">
            <ArrowRight className="h-8 w-8" />
          </div>
        </div>
        
        <div className="premium-card p-8 rounded-xl shadow-sm relative z-10">
          <div className={`w-16 h-16 ${isDark ? 'bg-blue-950' : 'bg-blue-50'} rounded-xl flex items-center justify-center mb-6 mx-auto`}>
            <PlayCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium text-foreground mb-3 text-center">Start Streaming</h3>
          <p className="text-foreground/70 text-center">Experience crystal clear screen sharing with HD quality and minimal latency.</p>
          <div className="flex justify-center mt-6">
            <span className={`${isDark ? 'bg-blue-950' : 'bg-blue-50'} text-primary text-xs font-medium px-3 py-1 rounded-full`}>Step 3</span>
          </div>
          <div className="hidden md:block absolute -left-4 top-1/2 transform -translate-y-1/2 text-primary">
            <ArrowRight className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
