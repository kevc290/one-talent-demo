import { useTheme } from '../contexts/ThemeContext';

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function FilterButton({ label, isActive, onClick }: FilterButtonProps) {
  const { currentBrand } = useTheme();
  
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 sm:px-4 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
        isActive
          ? 'text-white shadow-md animate-scaleIn'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
      }`}
      style={isActive ? {
        backgroundColor: currentBrand.cssVars['--color-accent']
      } : {}}
    >
      {label}
    </button>
  );
}