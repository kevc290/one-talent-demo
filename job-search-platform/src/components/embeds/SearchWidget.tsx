import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderSearchProps {
  onSearch?: (query: string) => void;
  className?: string;
}

export function HeaderSearch({ onSearch, className = '' }: HeaderSearchProps) {
  const { currentBrand } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      // If no search term, just go to jobs page
      const targetUrl = import.meta.env.PROD ? '/one-talent-demo/jobs' : '/jobs';
      window.location.href = targetUrl;
      return;
    }
    
    onSearch?.(searchQuery);
    // Default behavior: redirect to jobs page with search params
    const params = new URLSearchParams();
    params.set('search', searchQuery.trim());
    
    const targetUrl = import.meta.env.PROD 
      ? `/one-talent-demo/jobs?${params.toString()}`
      : `/jobs?${params.toString()}`;
    window.location.href = targetUrl;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setSearchQuery('');
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Focus input when expanding
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      // Clear search when collapsing
      setSearchQuery('');
    }
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        const searchContainer = inputRef.current.closest('.header-search');
        if (searchContainer && !searchContainer.contains(event.target as Node)) {
          setIsExpanded(false);
          setSearchQuery('');
        }
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <div className={`header-search flex items-center ${className}`}>
      {/* Search Icon - Always Visible */}
      <button
        onClick={toggleExpanded}
        className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        aria-label={isExpanded ? 'Close search' : 'Open search'}
      >
        {isExpanded ? (
          <X className="w-5 h-5" />
        ) : (
          <Search className="w-5 h-5" />
        )}
      </button>

      {/* Expandable Search Input */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-w-md opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0'
      }`}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            style={{ minWidth: '250px' }}
          />
          {searchQuery && (
            <button 
              onClick={handleSearch}
              className={`absolute right-1 top-1 p-1.5 rounded-md text-white transition-colors text-xs ${
                currentBrand.colors.primary === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 
                currentBrand.colors.primary === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <Search className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}