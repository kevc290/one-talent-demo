import { Heart, FileText, User, Briefcase, TrendingUp, Clock } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface StatCardWidgetProps {
  title?: string;
  value?: number | string;
  icon?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  isEditing?: boolean;
  width?: number;
  height?: number;
}

const iconMap = {
  heart: Heart,
  file: FileText,
  user: User,
  briefcase: Briefcase,
  trending: TrendingUp,
  clock: Clock,
};

const colorMap = {
  blue: 'border-blue-500 text-blue-500',
  green: 'border-green-500 text-green-500',
  purple: 'border-purple-500 text-purple-500',
  orange: 'border-orange-500 text-orange-500',
  red: 'border-red-500 text-red-500',
};

export function StatCardWidget({ 
  title = 'Stat Card', 
  value = '0',
  icon = 'trending',
  color = 'blue',
  isEditing = false,
  width = 12,
  height = 4
}: StatCardWidgetProps) {
  const { currentBrand } = useTheme();
  const IconComponent = iconMap[icon as keyof typeof iconMap] || TrendingUp;
  
  // Use theme-aware colors or fall back to prop color
  const getThemeColor = () => {
    if (currentBrand.id === 'kelly') {
      return 'border-green-500 text-green-500';
    }
    switch (currentBrand.colors.primary) {
      case 'blue':
        return 'border-blue-500 text-blue-500';
      case 'purple':
        return 'border-purple-500 text-purple-500';
      case 'emerald':
        return 'border-emerald-500 text-emerald-500';
      case 'gray':
        return 'border-gray-500 text-gray-500';
      default:
        return colorMap[color];
    }
  };
  
  const colorClass = getThemeColor();

  // Determine layout based on widget size
  const isCompact = width < 10;
  const isVeryCompact = width < 8;
  const isTall = height >= 6;
  const isVeryTall = height >= 8;

  // Calculate responsive sizes
  const valueSize = isVeryCompact ? 'text-lg' : isCompact ? 'text-xl' : isTall ? 'text-4xl' : 'text-2xl';
  const titleSize = isVeryCompact ? 'text-xs' : isCompact ? 'text-sm' : 'text-sm';
  const iconSize = isVeryCompact ? 'w-4 h-4' : isCompact ? 'w-6 h-6' : isTall ? 'w-12 h-12' : 'w-8 h-8';
  const padding = isVeryCompact ? 'p-3' : isCompact ? 'p-4' : 'p-6';

  return (
    <div className={`bg-white ${padding} rounded-lg shadow-sm border-l-4 ${colorClass} relative h-full flex items-center justify-center`}>
      <div className={`flex ${isTall ? 'flex-col text-center' : 'items-center justify-between'} w-full h-full`}>
        <div className={`${isTall ? 'mb-4' : ''}`}>
          <p className={`${titleSize} text-gray-600 mb-1`}>{title}</p>
          <p className={`${valueSize} font-bold text-gray-900 ${isVeryTall ? 'mb-2' : ''}`}>{value}</p>
          
          {/* Additional info for tall widgets */}
          {isVeryTall && (
            <div className="mt-4 space-y-1">
              <p className="text-xs text-gray-500">Current Period</p>
              <p className="text-sm text-gray-700">Updated: Just now</p>
            </div>
          )}
        </div>
        
        <div className={`${isTall ? 'mt-auto' : ''}`}>
          <IconComponent className={`${iconSize} ${colorClass.split(' ')[1]} ${isTall ? 'mx-auto' : ''}`} />
        </div>
      </div>
      
      {isEditing && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {width}×{height}
        </div>
      )}
    </div>
  );
}