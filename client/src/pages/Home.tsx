import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, MonitorSmartphone, Share2, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HostSession from '@/components/HostSession';
import JoinSession from '@/components/JoinSession';
import InfoSection from '@/components/InfoSection';
import FeatureSection from '@/components/FeatureSection';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'host' | 'join'>('host');

  return (
    <div className="bg-white font-sans min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mb-6">
              <span className="gradient-text">Crystal Clear</span> Screen Sharing
            </h1>
            <p className="text-xl md:text-2xl font-light text-gray-600 mb-8">
              Share your screen instantly with anyone, anywhere. No downloads, no hassle.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={() => setActiveTab('host')}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8"
              >
                Start Sharing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                onClick={() => setActiveTab('join')}
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-700"
              >
                Join a Session
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MonitorSmartphone className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Instant Sharing</h3>
            <p className="text-gray-600">Start a session and share your screen in seconds. No software installation required.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Simple Invites</h3>
            <p className="text-gray-600">Generate a unique code or link that you can share via any messaging platform.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">HD Quality</h3>
            <p className="text-gray-600">Experience high-definition, low-latency screen sharing directly in your browser.</p>
          </div>
        </div>
        
        {/* Tabs Section - Classic Tab Style */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6 pt-6">
              <button 
                onClick={() => setActiveTab('host')}
                className={`py-3 px-1 border-b-2 font-medium text-base transition-colors ${
                  activeTab === 'host' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Host a Session
              </button>
              <button 
                onClick={() => setActiveTab('join')}
                className={`py-3 px-1 border-b-2 font-medium text-base transition-colors ${
                  activeTab === 'join' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Join a Session
              </button>
            </div>
          </div>
          <div className="p-6">
            {activeTab === 'host' ? <HostSession /> : <JoinSession />}
          </div>
        </div>
        
        {/* Additional Information */}
        <div className="mt-24">
          <InfoSection />
          <FeatureSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
