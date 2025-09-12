import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Briefcase, Home, Users, Building2, User, Settings, LogOut, Heart, FileText, Shield, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { BrandSwitcher } from './BrandSwitcher';
import { HeaderSearch } from './embeds/SearchWidget';

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

  const getNavLinks = () => {
    const baseLinks = [
      { to: '/', label: 'Home', icon: Home },
      { to: '/jobs', label: 'Find Jobs', icon: Briefcase },
      // { to: '/companies', label: 'Companies', icon: Building2 },
      { to: '/about', label: 'About', icon: Users },
    ];
    
    if (isAuthenticated) {
      const authenticatedLinks = [
        ...baseLinks.slice(0, 2), // Home and Find Jobs
        { to: '/dashboard', label: 'Dashboard', icon: User },
        ...baseLinks.slice(2), // Companies and About
      ];
      
      // Add admin link for demo purposes (demo user has admin access)
      if (user?.email === 'demo@jobsearchpro.com' || user?.email === 'john.doe@example.com') {
        authenticatedLinks.splice(-1, 0, { to: '/admin', label: 'Admin', icon: Shield });
      }
      
      return authenticatedLinks;
    }
    
    return baseLinks;
  };

  const navLinks = getNavLinks();

  const getUserMenuLinks = () => {
    const baseLinks = [
      { to: '/dashboard', label: 'Dashboard', icon: Home },
      { to: '/saved-jobs', label: 'Saved Jobs', icon: Heart },
      { to: '/applications', label: 'My Applications', icon: FileText },
      { to: '/profile', label: 'Profile Settings', icon: Settings },
    ];

    // Add content admin link for demo purposes (demo user has admin access)
    if (user?.email === 'demo@jobsearchpro.com' || user?.email === 'john.doe@example.com') {
      baseLinks.splice(-1, 0, { to: '/admin/content', label: 'Content Admin', icon: Edit });
    }

    return baseLinks;
  };

  const userMenuLinks = getUserMenuLinks();

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
            {currentBrand.id === 'kelly' ? (
              <img
                src={import.meta.env.PROD ? "/one-talent-demo/images/kelly_logo.png" : "/images/kelly_logo.png"}
                alt="Kelly Services"
                className="h-8 w-auto object-contain"
              />
            ) : (
              <>
                <span className="text-2xl">{currentBrand.logo}</span>
                <span className="text-xl font-bold" style={{ color: currentBrand.cssVars['--color-primary'] }}>
                  {currentBrand.name}
                </span>
              </>
            )}
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center gap-6">
              <BrandSwitcher />
              
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="font-medium transition-colors text-gray-600"
                  style={isActive(to) ? 
                    { color: currentBrand.cssVars['--color-accent'] } : 
                    { '--hover-color': currentBrand.cssVars['--color-accent'] } as React.CSSProperties
                  }
                  onMouseEnter={(e) => {
                    if (!isActive(to)) {
                      e.currentTarget.style.color = currentBrand.cssVars['--color-accent'];
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(to)) {
                      e.currentTarget.style.color = '#4b5563';
                    }
                  }}
                >
                  {label}
                </Link>
              ))}

              {/* Auth Section - Centered */}
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
                    className="text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    style={{
                      backgroundColor: currentBrand.cssVars['--color-primary'],
                      '--hover-bg': currentBrand.cssVars['--color-primary-hover']
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = currentBrand.cssVars['--color-primary-hover'];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = currentBrand.cssVars['--color-primary'];
                    }}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar - Right Side */}
          <div className="hidden md:block">
            <HeaderSearch />
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
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50"
                style={isActive(to) ? {
                  backgroundColor: currentBrand.cssVars['--color-accent'] + '10',
                  color: currentBrand.cssVars['--color-accent']
                } : {
                  '--hover-color': currentBrand.cssVars['--color-accent']
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  if (!isActive(to)) {
                    e.currentTarget.style.color = currentBrand.cssVars['--color-accent'];
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(to)) {
                    e.currentTarget.style.color = '#4b5563';
                  }
                }}
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
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                      style={{
                        '--hover-color': currentBrand.cssVars['--color-accent']
                      } as React.CSSProperties}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = currentBrand.cssVars['--color-accent'];
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#4b5563';
                      }}
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
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  style={{
                    '--hover-color': currentBrand.cssVars['--color-accent']
                  } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = currentBrand.cssVars['--color-accent'];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#4b5563';
                  }}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Sign In</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-white transition-colors"
                  style={{
                    backgroundColor: currentBrand.cssVars['--color-primary'],
                    '--hover-bg': currentBrand.cssVars['--color-primary-hover']
                  } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentBrand.cssVars['--color-primary-hover'];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = currentBrand.cssVars['--color-primary'];
                  }}
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