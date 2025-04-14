import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { MonitorSmartphone } from 'lucide-react';
import { Github } from 'lucide-react';
import { Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    // This is just a UI state toggle for now
    // In a full implementation, this would update the theme
    setIsDarkMode(!isDarkMode);
  };

  return (
    <nav className="bg-white backdrop-blur-sm bg-opacity-90 sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <MonitorSmartphone className="h-8 w-8 text-primary mr-2" />
              <Link href="/">
                <span className="font-light text-2xl cursor-pointer">
                  <span className="gradient-text font-medium">Crystlr</span>
                </span>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Github className="h-6 w-6" />
            </a>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white transition-colors"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
