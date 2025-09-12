import { Briefcase, Heart, FileText, User, Search, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';

interface QuickLink {
  label: string;
  href: string;
  icon: string;
}

interface QuickLinksWidgetProps {
  title?: string;
  links?: QuickLink[];
  isEditing?: boolean;
  width?: number;
  height?: number;
}

const iconMap = {
  briefcase: Briefcase,
  heart: Heart,
  file: FileText,
  user: User,
  search: Search,
  settings: Settings,
};

const allAvailableLinks: QuickLink[] = [
  { label: 'Browse Jobs', href: '/jobs', icon: 'briefcase' },
  { label: 'Saved Jobs', href: '/saved-jobs', icon: 'heart' },
  { label: 'Applications', href: '/applications', icon: 'file' },
  { label: 'Profile', href: '/profile', icon: 'user' },
  { label: 'Job Search', href: '/jobs?search=', icon: 'search' },
  { label: 'Settings', href: '/profile', icon: 'settings' },
  { label: 'Companies', href: '/companies', icon: 'briefcase' },
  { label: 'About', href: '/about', icon: 'user' },
  { label: 'Help', href: '/help', icon: 'settings' },
  { label: 'Contact', href: '/contact', icon: 'user' },
];

export function QuickLinksWidget({ 
  title = 'Quick Links', 
  links,
  isEditing = false,
  width = 12,
  height = 8
}: QuickLinksWidgetProps) {
  const { currentBrand } = useTheme();
  // Calculate how many links to show based on widget height
  // Each link takes about 48px (3rem = py-2 + content), title takes ~60px, padding takes ~48px
  const availableHeight = height * 20; // Convert grid units to pixels
  const headerHeight = 60;
  const paddingHeight = 48;
  const linkHeight = 48;
  const availableContentHeight = availableHeight - headerHeight - paddingHeight;
  const maxLinks = Math.max(2, Math.floor(availableContentHeight / linkHeight));
  
  // Use provided links or fall back to showing appropriate number of default links
  const displayLinks = links || allAvailableLinks.slice(0, maxLinks);
  
  // Determine layout based on widget size
  const isCompact = width < 12;
  const isVeryNarrow = width < 9; // Below 180px (9 * 20px)
  const isTall = height >= 12;
  const isWide = width >= 16;
  const showText = !isVeryNarrow; // Show text unless very narrow

  return (
    <div className="bg-white rounded-lg shadow-sm h-full flex flex-col relative overflow-hidden">
      <div className={`${isCompact ? 'p-4' : 'p-6'} flex-shrink-0`}>
        <h3 className={`${isCompact ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-4`}>
          {title}
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className={`${isCompact ? 'px-4 pb-4' : 'px-6 pb-6'} space-y-${isCompact ? '2' : '3'}`}>
          {displayLinks.map((link, index) => {
            const IconComponent = iconMap[link.icon as keyof typeof iconMap] || Briefcase;
            
            // Determine icon size - larger when text is hidden
            const iconSize = isVeryNarrow ? 'w-5 h-5' : isCompact ? 'w-4 h-4' : 'w-4 h-4';
            
            if (isEditing) {
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 text-gray-700 ${
                    isCompact ? 'py-1.5 px-2' : 'py-2 px-3'
                  } rounded hover:bg-gray-50 ${showText ? 'justify-start' : 'justify-center'}`}
                >
                  <IconComponent className={iconSize} />
                  {showText && (
                    <span className={`${isCompact ? 'text-sm' : ''}`}>{link.label}</span>
                  )}
                </div>
              );
            }
            
            return (
              <Link
                key={index}
                to={link.href}
                className={`flex items-center gap-3 text-gray-700 transition-colors ${
                  isCompact ? 'py-1.5 px-2' : 'py-2 px-3'
                } rounded hover:bg-gray-50 ${showText ? 'justify-start' : 'justify-center'} ${
                  currentBrand.colors.primary === 'blue' ? 'hover:text-blue-600' : 
                  currentBrand.colors.primary === 'purple' ? 'hover:text-purple-600' : 
                  currentBrand.colors.primary === 'emerald' ? 'hover:text-emerald-600' :
                  'hover:text-gray-600'
                }`}
                title={!showText ? link.label : undefined}
              >
                <IconComponent className={iconSize} />
                {showText && (
                  <span className={`${isCompact ? 'text-sm' : ''}`}>{link.label}</span>
                )}
              </Link>
            );
          })}
          
          {/* Show indicator if there are more links available */}
          {isTall && displayLinks.length < allAvailableLinks.length && (
            <div className={`flex items-center gap-3 text-gray-400 ${
              isCompact ? 'py-1.5 px-2' : 'py-2 px-3'
            } rounded text-center justify-center`}>
              <span className={`${isCompact ? 'text-xs' : 'text-sm'}`}>
                +{allAvailableLinks.length - displayLinks.length} more available
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Widget dimensions indicator */}
      {isEditing && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {width}×{height} ({displayLinks.length} links)
        </div>
      )}
    </div>
  );
}