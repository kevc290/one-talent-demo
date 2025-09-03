import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function BrandSwitcher() {
  const { currentBrand, switchBrand, availableBrands } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
          currentBrand.colors.primary === 'blue'
            ? 'border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100'
            : currentBrand.colors.primary === 'purple'
            ? 'border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100'
            : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
        }`}
      >
        <span className="text-lg">{currentBrand.logo}</span>
        <span className="hidden sm:inline">{currentBrand.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 min-w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {availableBrands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => {
                  switchBrand(brand.id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg">{brand.logo}</span>
                <span className="flex-1">{brand.name}</span>
                {currentBrand.id === brand.id && (
                  <Check className="w-4 h-4 text-green-600" />
                )}
              </button>
            ))}
          </div>
          <div className="border-t border-gray-100 px-3 py-2">
            <p className="text-xs text-gray-500">
              Switch brands to see different themes
            </p>
          </div>
        </div>
      )}
    </div>
  );
}