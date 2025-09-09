import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Home, Heart, FileText, Settings, LogOut, User } from 'lucide-react';

interface ProfileWidgetProps {
  theme?: 'modern' | 'classic' | 'minimal';
  position?: 'left' | 'right';
  showLabels?: boolean;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}

export function ProfileWidget({ 
  theme = 'modern', 
  position = 'right',
  showLabels = true 
}: ProfileWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock authentication check - in real implementation, this would connect to your auth system
  useEffect(() => {
    // Check if user is logged in (from localStorage, cookies, etc.)
    const userData = localStorage.getItem('jobsearch_user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jobsearch_user');
    setUser(null);
    setIsAuthenticated(false);
    setIsOpen(false);
    // Trigger custom event for parent page to handle logout
    window.dispatchEvent(new CustomEvent('jobsearch:logout'));
  };

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    // Trigger custom event for parent page to handle navigation
    window.dispatchEvent(new CustomEvent('jobsearch:navigate', { detail: { path } }));
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'classic':
        return {
          container: 'bg-gray-50 border border-gray-300 rounded-md',
          button: 'hover:bg-gray-100 text-gray-800',
          dropdown: 'bg-white border border-gray-300 rounded-md shadow-md',
          menuItem: 'text-gray-700 hover:bg-gray-100',
          logoutButton: 'text-red-700 hover:bg-red-50'
        };
      case 'minimal':
        return {
          container: 'bg-transparent',
          button: 'hover:bg-gray-50 text-gray-600',
          dropdown: 'bg-white border border-gray-200 rounded-lg shadow-sm',
          menuItem: 'text-gray-600 hover:bg-gray-50',
          logoutButton: 'text-red-500 hover:bg-red-25'
        };
      default: // modern
        return {
          container: 'bg-white shadow-sm border border-gray-200 rounded-lg',
          button: 'hover:bg-blue-50 text-gray-700',
          dropdown: 'bg-white border border-gray-200 rounded-lg shadow-lg',
          menuItem: 'text-gray-700 hover:bg-gray-50',
          logoutButton: 'text-red-600 hover:bg-red-50'
        };
    }
  };

  const themeClasses = getThemeClasses();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/saved-jobs', label: 'Saved Jobs', icon: Heart },
    { path: '/applications', label: 'My Applications', icon: FileText },
    { path: '/profile', label: 'Profile Settings', icon: Settings },
  ];

  if (!isAuthenticated || !user) {
    return (
      <div className={`inline-flex items-center ${themeClasses.container} px-3 py-2`}>
        <button
          onClick={() => handleNavigation('/login')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${themeClasses.button}`}
        >
          <User className="w-4 h-4" />
          {showLabels && <span className="text-sm font-medium">Sign In</span>}
        </button>
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${themeClasses.container}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${themeClasses.button}`}
      >
        <img
          src={user.avatar}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-8 h-8 rounded-full object-cover"
        />
        {showLabels && (
          <span className="text-sm font-medium">{user.firstName}</span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute ${position === 'left' ? 'left-0' : 'right-0'} mt-2 w-64 ${themeClasses.dropdown} py-2 z-50`}>
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map(({ path, label, icon: Icon }) => (
              <button
                key={path}
                onClick={() => handleNavigation(path)}
                className={`flex items-center gap-3 w-full px-4 py-2 transition-colors ${themeClasses.menuItem}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 pt-2">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full px-4 py-2 transition-colors ${themeClasses.logoutButton}`}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}