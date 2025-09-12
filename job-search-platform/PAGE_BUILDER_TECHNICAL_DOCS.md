# Page Builder Technical Documentation

## Overview

The Page Builder is a comprehensive drag-and-drop dashboard customization system that allows users to create, modify, and manage dashboard layouts with live editing capabilities. It supports widget resizing, positioning, HubSpot content integration, and responsive design.

## Architecture

### Core Components

```
src/
├── components/pageBuilder/
│   ├── LiveEditingEngine.tsx      # Main live editing interface
│   ├── ResizableWidget.tsx        # Gecko Board-style widget with resize handles
│   ├── WidgetRegistry.tsx         # Widget definitions and implementations
│   └── widgets/
│       ├── StatCardWidget.tsx     # Statistics display widgets
│       ├── QuickLinksWidget.tsx   # Navigation shortcuts
│       ├── HubSpotBannerWidget.tsx # HubSpot banner content
│       └── HubSpotCardWidget.tsx  # HubSpot content cards
├── services/
│   ├── layoutService.ts           # Layout persistence and management
│   └── mockHubSpotService.ts      # Mock HubSpot content provider
├── types/
│   └── pageBuilder.ts             # TypeScript type definitions
└── pages/
    └── EnhancedDashboard.tsx      # Main dashboard page
```

## Type System

### Core Types

```typescript
// Widget Configuration
interface WidgetConfig {
  id: string;
  type: string;
  title?: string;
  x: number;        // X position in pixels (canvas mode)
  y: number;        // Y position in pixels (canvas mode)
  w: number;        // Width in grid units (1 unit = 20px)
  h: number;        // Height in grid units (1 unit = 20px)
  config: Record<string, any>;
}

// Layout Definition
interface PageLayout {
  id: string;
  name: string;
  lastUpdated: string;
  widgets: WidgetConfig[];
}

// Widget Definition (Registry)
interface WidgetDefinition {
  type: string;
  name: string;
  description: string;
  icon: React.ComponentType;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  maxSize: { w: number; h: number };
  component: React.ComponentType<any>;
}
```

## Grid System

The page builder uses a **48-column grid system** with pixel positioning:

- **Grid Units**: 1 unit = 20px
- **Total Width**: 48 columns = 960px
- **Responsive Breakdowns**:
  - Full width: 48 columns
  - Two-thirds: 32 columns
  - Half: 24 columns
  - One-third: 16 columns
  - Quarter: 12 columns

### Coordinate System

```typescript
// Widget positioning uses absolute pixel coordinates
{
  x: 40,    // 40px from left edge
  y: 80,    // 80px from top edge
  w: 12,    // 240px wide (12 * 20px)
  h: 8      // 160px tall (8 * 20px)
}
```

## Live Editing Engine

### Core Features

1. **Canvas Mode**: Absolute positioning with pixel-perfect control
2. **Resize Handles**: 8-point resize system (corners + edges)
3. **Live Content**: Real widget content visible during editing
4. **Auto-save**: Changes persist automatically
5. **Grid Snapping**: Optional grid overlay for alignment

### Implementation

```typescript
// LiveEditingEngine.tsx
export function LiveEditingEngine({
  widgets,
  onUpdateLayout,
  onRemoveWidget,
  onConfigureWidget,
  showGrid = true,
  isEditMode,
  onToggleEdit
}: LiveEditingEngineProps) {
  // Widget manipulation handlers
  const handleWidgetMove = useCallback((id: string, position: { x: number; y: number }) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === id ? { ...widget, x: position.x, y: position.y } : widget
    );
    onUpdateLayout(updatedWidgets);
  }, [widgets, onUpdateLayout]);

  const handleWidgetResize = useCallback((id: string, bounds: Rectangle) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === id ? { 
        ...widget, 
        x: bounds.x, 
        y: bounds.y, 
        w: bounds.width, 
        h: bounds.height 
      } : widget
    );
    onUpdateLayout(updatedWidgets);
  }, [widgets, onUpdateLayout]);
}
```

## Widget System

### Widget Lifecycle

1. **Registration**: Widget types registered in `WidgetRegistry.tsx`
2. **Instantiation**: Widgets created with default configuration
3. **Rendering**: Components receive props and render content
4. **Interaction**: Users can resize, move, configure widgets
5. **Persistence**: Changes saved to localStorage/backend

### Creating New Widget Types

#### Step 1: Create Widget Component

```typescript
// src/components/pageBuilder/widgets/MyCustomWidget.tsx
import { useTheme } from '../../../contexts/ThemeContext';

interface MyCustomWidgetProps {
  title?: string;
  isEditing?: boolean;
  width?: number;  // Grid units
  height?: number; // Grid units
  config?: {
    customSetting?: string;
  };
}

export function MyCustomWidget({
  title = 'Custom Widget',
  isEditing = false,
  width = 12,
  height = 8,
  config = {}
}: MyCustomWidgetProps) {
  const { currentBrand } = useTheme();

  // Responsive behavior based on size
  const isCompact = width < 12;
  const isTall = height >= 10;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="flex-1">
        {/* Widget content here */}
        <p className="text-gray-600">
          Custom widget content (Size: {width}x{height})
        </p>
      </div>
      
      {/* Edit overlay for editing mode */}
      {isEditing && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-lg">
          <span className="bg-white text-gray-800 px-3 py-1 rounded text-sm font-medium">
            {title}
          </span>
        </div>
      )}
    </div>
  );
}
```

#### Step 2: Register Widget in Registry

```typescript
// src/components/pageBuilder/WidgetRegistry.tsx
import { MyCustomWidget } from './widgets/MyCustomWidget';
import { Puzzle } from 'lucide-react'; // Icon for widget

export const widgetRegistry: Record<string, WidgetDefinition> = {
  // ... existing widgets
  'my-custom-widget': {
    type: 'my-custom-widget',
    name: 'My Custom Widget',
    description: 'A custom widget for specific functionality',
    icon: Puzzle,
    defaultSize: { w: 12, h: 8 },
    minSize: { w: 8, h: 6 },
    maxSize: { w: 24, h: 16 },
    component: MyCustomWidget,
  },
};
```

#### Step 3: Add to Default Layouts (Optional)

```typescript
// src/services/layoutService.ts - Add to createCompatibleLayout()
{
  id: 'my-custom-widget-1',
  type: 'my-custom-widget',
  title: 'My Custom Widget',
  x: 0,
  y: 36,
  w: 24,
  h: 8,
  config: {
    customSetting: 'default value'
  }
}
```

## Responsive Design

### Widget Responsiveness

Widgets should adapt their content based on their dimensions:

```typescript
export function ResponsiveWidget({ width, height }: WidgetProps) {
  // Size classifications
  const isCompact = width < 12;
  const isVeryCompact = width < 8;
  const isTall = height >= 10;
  const isWide = width >= 16;

  // Content adaptation
  const showDetails = !isCompact;
  const maxItems = isTall ? 8 : isCompact ? 3 : 5;
  const fontSize = isVeryCompact ? 'text-sm' : 'text-base';

  return (
    <div className={`${fontSize} ...`}>
      {showDetails && <DetailView />}
      <ItemList maxItems={maxItems} />
    </div>
  );
}
```

### Breakpoint System

- **Very Compact**: width < 8 units (160px)
- **Compact**: width < 12 units (240px)
- **Standard**: width 12-15 units (240-300px)
- **Wide**: width >= 16 units (320px+)
- **Tall**: height >= 10 units (200px+)
- **Very Tall**: height >= 12 units (240px+)

## Data Integration

### HubSpot Integration

The system includes mock HubSpot service with realistic content:

```typescript
// src/services/mockHubSpotService.ts
export interface HubSpotContent {
  id: string;
  type: 'banner' | 'card' | 'blog-post' | 'case-study';
  title: string;
  content?: string;
  htmlContent?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  author?: string;
  publishedDate?: string;
  tags?: string[];
}

class MockHubSpotService {
  async getBannerContent(id: string): Promise<HubSpotContent | null> {
    // Returns banner content with CTA
  }

  async getCardContent(id: string): Promise<HubSpotContent | null> {
    // Returns card content with metadata
  }

  async searchContent(query: string, type?: string): Promise<HubSpotContent[]> {
    // Search functionality for content discovery
  }
}
```

### Real Data Integration

For production, replace mock services with real API calls:

```typescript
// Widget with real data
export function DataDrivenWidget() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await apiService.getData();
        setData(response);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <LoadingState />;
  return <DataDisplay data={data} />;
}
```

## Layout Persistence

### Storage System

```typescript
// src/services/layoutService.ts
class LayoutService {
  private storageKey = 'dashboard-layouts';

  // Save layout to localStorage (production: API call)
  async saveLayout(layout: PageLayout): Promise<void> {
    const layouts = this.getStoredLayouts();
    layouts[layout.id] = {
      ...layout,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(this.storageKey, JSON.stringify(layouts));
  }

  // Load layout with fallback
  async getLayout(layoutId: string): Promise<PageLayout | null> {
    const layouts = this.getStoredLayouts();
    return layouts[layoutId] || this.defaultLayout;
  }
}
```

### User Preferences

```typescript
// User's preferred layout
getUserPreferredLayout(): string {
  return localStorage.getItem('preferred-dashboard-layout') || 'default-dashboard';
}

setUserPreferredLayout(layoutId: string): void {
  localStorage.setItem('preferred-dashboard-layout', layoutId);
}
```

## Theming Integration

### Theme-Aware Widgets

```typescript
import { useTheme } from '../../../contexts/ThemeContext';

export function ThemedWidget() {
  const { currentBrand } = useTheme();

  const getThemeColors = () => {
    switch (currentBrand.colors.primary) {
      case 'blue':
        return 'text-blue-600 hover:text-blue-700 bg-blue-50';
      case 'purple':
        return 'text-purple-600 hover:text-purple-700 bg-purple-50';
      case 'emerald':
        return 'text-emerald-600 hover:text-emerald-700 bg-emerald-50';
      default:
        return 'text-gray-600 hover:text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className={getThemeColors()}>
      Themed content
    </div>
  );
}
```

## Performance Optimization

### Best Practices

1. **Memoization**: Use `React.memo()` for widget components
2. **Callback Optimization**: Use `useCallback()` for event handlers
3. **Lazy Loading**: Load widget content on demand
4. **Debounced Saves**: Debounce layout saves during editing
5. **Virtual Scrolling**: For large numbers of widgets

```typescript
// Optimized widget
const OptimizedWidget = React.memo(({ data, onUpdate }: WidgetProps) => {
  const handleUpdate = useCallback((newData) => {
    onUpdate(newData);
  }, [onUpdate]);

  return <WidgetContent data={data} onUpdate={handleUpdate} />;
});
```

## Testing Strategy

### Unit Tests

```typescript
// Widget component tests
describe('CustomWidget', () => {
  it('renders with default props', () => {
    render(<CustomWidget />);
    expect(screen.getByText('Custom Widget')).toBeInTheDocument();
  });

  it('adapts to compact size', () => {
    render(<CustomWidget width={8} height={6} />);
    expect(screen.getByTestId('compact-view')).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
// Layout service tests
describe('LayoutService', () => {
  it('saves and loads layouts', async () => {
    const layout = createTestLayout();
    await layoutService.saveLayout(layout);
    
    const loaded = await layoutService.getLayout(layout.id);
    expect(loaded).toEqual(layout);
  });
});
```

## Security Considerations

### Input Validation

```typescript
// Validate widget configuration
const validateWidgetConfig = (config: WidgetConfig): boolean => {
  // Validate required fields
  if (!config.id || !config.type) return false;
  
  // Validate positions and sizes
  if (config.x < 0 || config.y < 0) return false;
  if (config.w < 1 || config.h < 1) return false;
  
  // Validate against widget definition constraints
  const definition = widgetRegistry[config.type];
  if (!definition) return false;
  
  const { minSize, maxSize } = definition;
  if (config.w < minSize.w || config.h < minSize.h) return false;
  if (config.w > maxSize.w || config.h > maxSize.h) return false;
  
  return true;
};
```

### XSS Prevention

```typescript
// Sanitize HTML content
import DOMPurify from 'dompurify';

export function SafeHtmlWidget({ htmlContent }: { htmlContent: string }) {
  const sanitizedHtml = DOMPurify.sanitize(htmlContent);
  
  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
  );
}
```

## Deployment Considerations

### Environment Configuration

```typescript
// Production vs Development
const config = {
  apiEndpoint: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  enableMockData: process.env.NODE_ENV === 'development',
  hubspotApiKey: process.env.REACT_APP_HUBSPOT_API_KEY,
  maxWidgetsPerLayout: parseInt(process.env.REACT_APP_MAX_WIDGETS || '50'),
};
```

### Build Optimization

```typescript
// Lazy load widgets for better performance
const LazyStatCard = lazy(() => import('./widgets/StatCardWidget'));
const LazyQuickLinks = lazy(() => import('./widgets/QuickLinksWidget'));

export const widgetRegistry = {
  'stat-card': {
    component: LazyStatCard,
    // ... other properties
  },
  'quick-links': {
    component: LazyQuickLinks,
    // ... other properties  
  },
};
```

## Troubleshooting

### Common Issues

1. **Widgets not saving**: Check localStorage permissions and size limits
2. **Layout corruption**: Implement validation and fallback mechanisms
3. **Performance issues**: Profile with React DevTools, optimize renders
4. **Theme not applying**: Ensure ThemeProvider wraps the application
5. **Widget positioning issues**: Verify coordinate calculations and container sizing

### Debug Tools

```typescript
// Debug helper for layout inspection
window.debugPageBuilder = {
  getCurrentLayout: () => layoutService.getCurrentLayout(),
  validateLayout: (layout) => validateLayout(layout),
  clearStorage: () => layoutService.clearAll(),
  exportLayout: (layoutId) => layoutService.exportLayout(layoutId),
};
```

This documentation provides a comprehensive guide to understanding, extending, and maintaining the page builder system.