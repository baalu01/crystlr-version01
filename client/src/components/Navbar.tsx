import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { MonitorSmartphone, Github, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <nav className="bg-background/90 backdrop-blur-sm sticky top-0 z-50 border-b border-border">
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
              onClick={toggleTheme}
              className="text-foreground/60 hover:text-foreground focus:outline-none transition-colors"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
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
              className="text-foreground/60 hover:text-foreground transition-colors"
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
