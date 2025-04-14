import { Zap, Lock, Monitor, Globe } from 'lucide-react';

export default function FeatureSection() {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Zap className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-800">Low Latency</h3>
            <p className="mt-1 text-sm text-gray-500">Real-time interaction with minimal delay</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Lock className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-800">Secure Sharing</h3>
            <p className="mt-1 text-sm text-gray-500">End-to-end encrypted connections</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Monitor className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-800">High Resolution</h3>
            <p className="mt-1 text-sm text-gray-500">Crystal clear screen sharing</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Globe className="h-5 w-5 text-green-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-800">No Installation</h3>
            <p className="mt-1 text-sm text-gray-500">Works directly in modern browsers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
