
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, ChevronDown } from 'lucide-react';
import { Switch } from './ui/switch';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';

import Logo_Light from '../assets/img/logo_w.png';
import Logo_Dark from '../assets/img/logo_b.png';

interface HeaderProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, onThemeToggle }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="w-full h-[80px] relative border-b border-border-primary">
      <div className="w-full max-w-[1200px] h-full flex items-center justify-between mx-auto px-4 md:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={isDarkMode ? Logo_Light : Logo_Dark}
            alt="Logo"
            className="w-16 h-16 md:w-20 md:h-20"
          />
        </Link>
        
        <div className="flex items-center gap-2 md:gap-4">
          <nav className="hidden sm:flex gap-4 md:gap-8 items-center">
            <Link
              to="/"
              className={`text-text-primary text-sm font-medium cursor-pointer hover:text-blue-400 transition-colors ${
                isActive('/') ? 'border-b-2 border-blue-400 pb-1' : ''
              }`}
            >
              Home
            </Link>
            
            {/* <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-text-primary text-sm font-medium cursor-pointer hover:text-blue-400 transition-colors bg-transparent">
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-bg-secondary border border-border-primary rounded-md shadow-lg p-2 min-w-[200px]">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/decentralized"
                        className={`block px-4 py-2 text-text-primary hover:bg-bg-primary rounded transition-colors ${
                          isActive('/decentralized') ? 'bg-bg-primary border-l-2 border-blue-400' : ''
                        }`}
                      >
                        Decentralized
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/knightsbridge"
                        className={`block px-4 py-2 text-text-primary hover:bg-bg-primary rounded transition-colors ${
                          isActive('/knightsbridge') ? 'bg-bg-primary border-l-2 border-blue-400' : ''
                        }`}
                      >
                        Knightsbridge
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu> */}
            
            <Link
              to="/faq"
              className={`text-text-primary text-sm font-medium cursor-pointer hover:text-blue-400 transition-colors ${
                isActive('/faq') ? 'border-b-2 border-blue-400 pb-1' : ''
              }`}
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              className={`text-text-primary text-sm font-medium cursor-pointer hover:text-blue-400 transition-colors ${
                isActive('/contact') ? 'border-b-2 border-blue-400 pb-1' : ''
              }`}
            >
              Contact Us
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-yellow-500" />
            <Switch
              checked={isDarkMode}
              onCheckedChange={onThemeToggle}
              className="data-[state=checked]:bg-gray-600 data-[state=unchecked]:bg-gray-300"
            />
            <Moon className="w-4 h-4 text-blue-500" />
          </div>
        </div>
      </div>
    </header>
  );
};
