import { Monitor } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center">
            <Monitor className="h-5 w-5 text-primary mr-2" />
            <span className="font-semibold text-gray-800">ShareScreen</span>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500">© 2023 ShareScreen. All rights reserved.</p>
          </div>
        </div>
        <div className="mt-4 md:mt-8 border-t border-gray-200 pt-4 md:flex md:items-center md:justify-between">
          <div className="text-xs text-gray-500">
            Built with WebRTC for peer-to-peer connections. No data is stored on our servers.
          </div>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
