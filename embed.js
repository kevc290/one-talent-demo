(function() {
  'use strict';

  // Prevent multiple loads
  if (window.JobSearchWidgets) {
    return;
  }

  // Widget configuration
  const WIDGET_BASE_URL = window.location.origin.includes('github.io') 
    ? 'https://kevc290.github.io/one-talent-demo'
    : window.location.origin;

  // CSS injection
  function injectStyles() {
    if (document.getElementById('jobsearch-widget-styles')) {
      return;
    }

    const link = document.createElement('link');
    link.id = 'jobsearch-widget-styles';
    link.rel = 'stylesheet';
    link.href = `${WIDGET_BASE_URL}/assets/index-BaCCchk1.css`;
    document.head.appendChild(link);
  }

  // Create iframe widget
  function createWidget(element, widgetType, options = {}) {
    const iframe = document.createElement('iframe');
    const widgetId = 'widget-' + Math.random().toString(36).substr(2, 9);
    
    // Widget URLs
    const widgetUrls = {
      'search': `${WIDGET_BASE_URL}/widget/search`,
      'listings': `${WIDGET_BASE_URL}/widget/listings`, 
      'login': `${WIDGET_BASE_URL}/widget/login`
    };

    // Configure iframe
    iframe.src = widgetUrls[widgetType] || widgetUrls['search'];
    iframe.id = widgetId;
    iframe.style.cssText = `
      width: 100%;
      border: none;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      background: white;
      min-height: ${widgetType === 'search' ? '600px' : widgetType === 'listings' ? '400px' : '300px'};
    `;
    
    // Handle responsive sizing
    iframe.onload = function() {
      // Send theme options to widget
      if (options.theme) {
        iframe.contentWindow.postMessage({
          type: 'THEME_UPDATE',
          theme: options.theme
        }, '*');
      }
    };

    element.appendChild(iframe);
    
    // Store reference
    element.setAttribute('data-widget-id', widgetId);
  }

  // Initialize widgets
  function initializeWidgets() {
    const widgets = document.querySelectorAll('[data-jobsearch-widget]');
    
    widgets.forEach(element => {
      const widgetType = element.getAttribute('data-jobsearch-widget');
      const currentWidgetId = element.getAttribute('data-widget-id');
      
      // If widget type changed or no widget exists, recreate it
      if (!currentWidgetId || element.getAttribute('data-widget-type') !== widgetType) {
        // Remove existing iframe if present
        const existingIframe = element.querySelector('iframe');
        if (existingIframe) {
          existingIframe.remove();
        }
        
        const theme = element.getAttribute('data-theme') || 'modern';
        const options = { theme };

        createWidget(element, widgetType, options);
        element.setAttribute('data-widget-type', widgetType);
      }
    });
  }

  // Public API
  window.JobSearchWidgets = {
    init: initializeWidgets,
    version: '1.0.0'
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWidgets);
  } else {
    initializeWidgets();
  }

  // Re-scan for new widgets periodically (for dynamic content)
  setInterval(initializeWidgets, 2000);

  // Inject styles
  injectStyles();

  // Handle widget communication
  window.addEventListener('message', function(event) {
    if (event.origin !== WIDGET_BASE_URL) {
      return;
    }

    if (event.data.type === 'WIDGET_RESIZE') {
      const iframe = document.getElementById(event.data.widgetId);
      if (iframe) {
        iframe.style.height = event.data.height + 'px';
      }
    }
  });

})();