import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HostSession from '@/components/HostSession';
import JoinSession from '@/components/JoinSession';
import InfoSection from '@/components/InfoSection';
import FeatureSection from '@/components/FeatureSection';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'host' | 'join'>('host');

  return (
    <div className="bg-gray-50 font-sans min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex space-x-8">
            <button 
              onClick={() => setActiveTab('host')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'host' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Host a Session
            </button>
            <button 
              onClick={() => setActiveTab('join')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'join' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Join a Session
            </button>
          </div>
        </div>
        
        {/* Session Content */}
        {activeTab === 'host' ? <HostSession /> : <JoinSession />}
        
        {/* Informational Sections */}
        <InfoSection />
        <FeatureSection />
      </main>
      
      <Footer />
    </div>
  );
}
