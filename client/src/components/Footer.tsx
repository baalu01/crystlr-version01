import { MonitorSmartphone, Lock, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center">
            <MonitorSmartphone className="h-6 w-6 text-primary mr-2" />
            <span className="font-light text-xl text-gray-800">
              <span className="gradient-text font-medium">Crystlr</span>
            </span>
          </div>
          <div className="mt-6 md:mt-0">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Crystlr. All rights reserved.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-12">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">End-to-End Encryption</h3>
              <p className="mt-1 text-sm text-gray-500">All connections use WebRTC with state-of-the-art encryption.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Private by Design</h3>
              <p className="mt-1 text-sm text-gray-500">Direct peer-to-peer connections mean no data passes through our servers.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <MonitorSmartphone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Cross-Device Support</h3>
              <p className="mt-1 text-sm text-gray-500">Works seamlessly across browsers on desktop and mobile devices.</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
          <div className="text-sm text-gray-500">
            Built with WebRTC for secure, high-quality peer-to-peer connections.
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-6">
            <a href="#" className="text-gray-500 hover:text-primary transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors text-sm">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
