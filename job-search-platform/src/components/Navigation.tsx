import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Briefcase, Home, Users, Building2, User, Settings, LogOut, Heart, FileText, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { BrandSwitcher } from './BrandSwitcher';

export function Navigation() {
  // All hooks MUST be called before any conditional returns
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { currentBrand } = useTheme();
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Close user menu when clicking outside - MUST be before conditional return
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Hide navigation on HubSpot demo page - check this AFTER all hooks
  if (location.pathname === '/hubspot-demo') {
    return null;
  }

  const getNavLinks = () => {
    const baseLinks = [
      { to: '/', label: 'Home', icon: Home },
      { to: '/jobs', label: 'Find Jobs', icon: Briefcase },
      { to: '/companies', label: 'Companies', icon: Building2 },
      { to: '/about', label: 'About', icon: Users },
      { to: '/hubspot-demo', label: 'HubSpot Demo', icon: Building2 },
    ];
    
    if (isAuthenticated) {
      const authenticatedLinks = [
        ...baseLinks.slice(0, 2), // Home and Find Jobs
        { to: '/dashboard', label: 'Dashboard', icon: User },
        ...baseLinks.slice(2), // Companies and About
      ];
      
      // Add admin link for demo purposes (john.doe has admin access)
      if (user?.email === 'john.doe@example.com') {
        authenticatedLinks.splice(-1, 0, { to: '/admin', label: 'Admin', icon: Shield });
      }
      
      return authenticatedLinks;
    }
    
    return baseLinks;
  };

  const navLinks = getNavLinks();

  const userMenuLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/saved-jobs', label: 'Saved Jobs', icon: Heart },
    { to: '/applications', label: 'My Applications', icon: FileText },
    { to: '/profile', label: 'Profile Settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">{currentBrand.logo}</span>
            <span className={`text-xl font-bold ${currentBrand.colors.primary === 'blue' ? 'text-blue-600' : currentBrand.colors.primary === 'purple' ? 'text-purple-600' : 'text-emerald-600'}`}>
              {currentBrand.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <BrandSwitcher />
            
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`font-medium transition-colors ${
                  isActive(to)
                    ? currentBrand.colors.primary === 'blue' 
                      ? 'text-blue-600' 
                      : currentBrand.colors.primary === 'purple'
                      ? 'text-purple-600'
                      : 'text-emerald-600'
                    : currentBrand.colors.primary === 'blue'
                    ? `text-gray-600 ${
                        currentBrand.colors.primary === 'blue' ? 'hover:text-blue-600' : 
                        currentBrand.colors.primary === 'purple' ? 'hover:text-purple-600' : 'hover:text-emerald-600'
                      }`
                    : currentBrand.colors.primary === 'purple'
                    ? 'text-gray-600 hover:text-purple-600'
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Auth Section */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-gray-700 font-medium">{user.firstName}</span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    
                    <div className="py-2">
                      {userMenuLinks.map(({ to, label, icon: Icon }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Icon className="w-4 h-4" />
                          {label}
                        </Link>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-200 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className={`text-white px-4 py-2 rounded-lg transition-colors font-medium ${
                    currentBrand.colors.primary === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 
                    currentBrand.colors.primary === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(to)
                    ? currentBrand.colors.primary === 'blue' ? 'bg-blue-50 text-blue-600' : 
                      currentBrand.colors.primary === 'purple' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'
                    : `text-gray-600 hover:bg-gray-50 ${
                        currentBrand.colors.primary === 'blue' ? 'hover:text-blue-600' : 
                        currentBrand.colors.primary === 'purple' ? 'hover:text-purple-600' : 'hover:text-emerald-600'
                      }`
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}

            {/* Mobile Auth Section */}
            {isAuthenticated && user ? (
              <>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <img
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  
                  {userMenuLinks.map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{label}</span>
                    </Link>
                  ))}
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Sign In</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Get Started</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}