import { Plus, Share2, PlayCircle, ArrowRight } from 'lucide-react';

export default function InfoSection() {
  return (
    <div className="mt-24 mb-16">
      <div className="text-center mb-14">
        <h2 className="mb-4">How <span className="gradient-text">Crystlr</span> Works</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Share your screen in three simple steps with no downloads or accounts required.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connecting line in the background (visible on md screens and up) */}
        <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-100 via-primary to-blue-100" style={{ width: '70%', margin: '0 auto' }}></div>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative z-10 premium-card">
          <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-6 mx-auto">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-3 text-center">Create a Session</h3>
          <p className="text-gray-600 text-center">Generate a unique session with your preferred sharing options.</p>
          <div className="flex justify-center mt-6">
            <span className="bg-blue-50 text-primary text-xs font-medium px-3 py-1 rounded-full">Step 1</span>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative z-10 premium-card md:mt-12">
          <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-6 mx-auto">
            <Share2 className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-3 text-center">Share the Link</h3>
          <p className="text-gray-600 text-center">Send the generated code or link to your viewers through any platform.</p>
          <div className="flex justify-center mt-6">
            <span className="bg-blue-50 text-primary text-xs font-medium px-3 py-1 rounded-full">Step 2</span>
          </div>
          <div className="hidden md:block absolute -left-4 top-1/2 transform -translate-y-1/2 text-primary">
            <ArrowRight className="h-8 w-8" />
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative z-10 premium-card">
          <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-6 mx-auto">
            <PlayCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-3 text-center">Start Streaming</h3>
          <p className="text-gray-600 text-center">Experience crystal clear screen sharing with HD quality and minimal latency.</p>
          <div className="flex justify-center mt-6">
            <span className="bg-blue-50 text-primary text-xs font-medium px-3 py-1 rounded-full">Step 3</span>
          </div>
          <div className="hidden md:block absolute -left-4 top-1/2 transform -translate-y-1/2 text-primary">
            <ArrowRight className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
