import { Plus, Share2, Monitor } from 'lucide-react';

export default function InfoSection() {
  return (
    <div className="mt-12 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-gray-800 mb-2">Create a Session</h3>
          <p className="text-gray-600 text-sm">Generate a unique session code and choose your screen sharing options.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <Share2 className="h-6 w-6 text-secondary" />
          </div>
          <h3 className="font-medium text-gray-800 mb-2">Share the Code</h3>
          <p className="text-gray-600 text-sm">Send the session code or link to the person you want to share your screen with.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Monitor className="h-6 w-6 text-accent" />
          </div>
          <h3 className="font-medium text-gray-800 mb-2">Start Streaming</h3>
          <p className="text-gray-600 text-sm">Begin your screen share with high-quality, low-latency streaming directly in the browser.</p>
        </div>
      </div>
    </div>
  );
}
