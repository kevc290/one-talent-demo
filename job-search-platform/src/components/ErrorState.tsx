import { AlertCircle, RefreshCw, Wifi, Server, Search } from 'lucide-react';

interface ErrorStateProps {
  type?: 'network' | 'server' | 'not-found' | 'generic';
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorState({
  type = 'generic',
  title,
  message,
  onRetry,
  showRetry = true
}: ErrorStateProps) {
  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          icon: <Wifi className="w-12 h-12 text-red-500" />,
          defaultTitle: 'Connection Error',
          defaultMessage: 'Unable to connect to the server. Please check your internet connection.',
          bgColor: 'bg-red-50',
          iconBg: 'bg-red-100'
        };
      case 'server':
        return {
          icon: <Server className="w-12 h-12 text-orange-500" />,
          defaultTitle: 'Server Error',
          defaultMessage: 'Something went wrong on our end. Our team has been notified.',
          bgColor: 'bg-orange-50',
          iconBg: 'bg-orange-100'
        };
      case 'not-found':
        return {
          icon: <Search className="w-12 h-12 text-blue-500" />,
          defaultTitle: 'No Results Found',
          defaultMessage: 'We couldn\'t find any results matching your search criteria.',
          bgColor: 'bg-blue-50',
          iconBg: 'bg-blue-100'
        };
      default:
        return {
          icon: <AlertCircle className="w-12 h-12 text-gray-500" />,
          defaultTitle: 'Something went wrong',
          defaultMessage: 'An unexpected error occurred. Please try again.',
          bgColor: 'bg-gray-50',
          iconBg: 'bg-gray-100'
        };
    }
  };

  const config = getErrorConfig();
  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;

  return (
    <div className={`rounded-xl p-8 ${config.bgColor} text-center animate-fadeIn`}>
      <div className={`w-20 h-20 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
        {config.icon}
      </div>
      
      <div className="space-y-4 max-w-md mx-auto">
        <h3 className="text-xl font-bold text-gray-900">{displayTitle}</h3>
        <p className="text-gray-600 leading-relaxed">{displayMessage}</p>
        
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 group"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
}