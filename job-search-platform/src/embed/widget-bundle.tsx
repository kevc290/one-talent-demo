import React from 'react';
import ReactDOM from 'react-dom/client';
import { JobSearchWidget } from '../components/embeds/JobSearchWidget';
import { MiniJobListings } from '../components/embeds/MiniJobListings';
import { LoginWidget } from '../components/embeds/LoginWidget';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';

// Widget components map
const WIDGET_COMPONENTS = {
  'search': JobSearchWidget,
  'listings': MiniJobListings,
  'login': LoginWidget
};

// Widget wrapper with providers
function WidgetWrapper({ type, theme = 'modern', ...props }: { 
  type: keyof typeof WIDGET_COMPONENTS; 
  theme?: string;
  [key: string]: any;
}) {
  const Component = WIDGET_COMPONENTS[type];
  
  if (!Component) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#dc2626' }}>
        <p><strong>Widget Error</strong></p>
        <p style={{ fontSize: '0.875rem' }}>Unknown widget type: {type}</p>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="jobsearch-widget-container" data-theme={theme}>
          <Component {...props} />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Public API for embedding widgets
export function renderWidget(element: HTMLElement, type: string, options: any = {}) {
  try {
    const root = ReactDOM.createRoot(element);
    root.render(
      <WidgetWrapper 
        type={type as keyof typeof WIDGET_COMPONENTS} 
        theme={options.theme}
        {...options}
      />
    );
    return true;
  } catch (error) {
    console.error('Failed to render widget:', error);
    element.innerHTML = `
      <div style="padding: 2rem; text-align: center; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; color: #dc2626;">
        <p><strong>Widget Error</strong></p>
        <p style="font-size: 0.875rem;">Failed to render ${type} widget. Please check console for details.</p>
      </div>
    `;
    return false;
  }
}

// Export for global access
declare global {
  interface Window {
    JobSearchWidgetBundle: {
      renderWidget: typeof renderWidget;
    };
  }
}

window.JobSearchWidgetBundle = {
  renderWidget
};