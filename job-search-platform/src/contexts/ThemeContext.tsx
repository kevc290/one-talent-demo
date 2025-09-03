import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Brand {
  id: string;
  name: string;
  logo: string;
  colors: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    secondary: string;
    accent: string;
  };
  cssVars: Record<string, string>;
}

export const brands: Brand[] = [
  {
    id: 'jobsearch',
    name: 'JobSearch Pro',
    logo: '💼',
    colors: {
      primary: 'blue',
      primaryHover: 'blue-700',
      primaryLight: 'blue-50',
      secondary: 'gray',
      accent: 'green',
    },
    cssVars: {
      '--color-primary': '#3B82F6',
      '--color-primary-hover': '#1D4ED8',
      '--color-primary-light': '#EFF6FF',
      '--color-secondary': '#6B7280',
      '--color-accent': '#10B981',
    }
  },
  {
    id: 'careerhub',
    name: 'Career Hub',
    logo: '🚀',
    colors: {
      primary: 'purple',
      primaryHover: 'purple-700',
      primaryLight: 'purple-50',
      secondary: 'gray',
      accent: 'pink',
    },
    cssVars: {
      '--color-primary': '#8B5CF6',
      '--color-primary-hover': '#7C3AED',
      '--color-primary-light': '#F5F3FF',
      '--color-secondary': '#6B7280',
      '--color-accent': '#EC4899',
    }
  },
  {
    id: 'talentfinder',
    name: 'Talent Finder',
    logo: '⭐',
    colors: {
      primary: 'emerald',
      primaryHover: 'emerald-700',
      primaryLight: 'emerald-50',
      secondary: 'gray',
      accent: 'orange',
    },
    cssVars: {
      '--color-primary': '#10B981',
      '--color-primary-hover': '#047857',
      '--color-primary-light': '#ECFDF5',
      '--color-secondary': '#6B7280',
      '--color-accent': '#F97316',
    }
  }
];

interface ThemeContextType {
  currentBrand: Brand;
  switchBrand: (brandId: string) => void;
  availableBrands: Brand[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentBrand, setCurrentBrand] = useState<Brand>(brands[0]);

  useEffect(() => {
    // Load saved brand from localStorage
    const savedBrandId = localStorage.getItem('selectedBrand');
    if (savedBrandId) {
      const savedBrand = brands.find(brand => brand.id === savedBrandId);
      if (savedBrand) {
        setCurrentBrand(savedBrand);
      }
    }
  }, []);

  useEffect(() => {
    // Apply CSS variables to the document root
    const root = document.documentElement;
    Object.entries(currentBrand.cssVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [currentBrand]);

  const switchBrand = (brandId: string) => {
    const brand = brands.find(b => b.id === brandId);
    if (brand) {
      setCurrentBrand(brand);
      localStorage.setItem('selectedBrand', brandId);
    }
  };

  const value: ThemeContextType = {
    currentBrand,
    switchBrand,
    availableBrands: brands,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}