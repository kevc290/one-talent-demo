# Page Builder Implementation Prompt

Use this comprehensive prompt to rebuild the page builder system from scratch in any React-based project.

## Project Requirements

I need you to implement a comprehensive dashboard page builder system with the following capabilities:

### Core Features Required

1. **Live Editing Mode**
   - Toggle between view and edit modes
   - Real widget content visible during editing (not placeholder content)
   - Auto-save functionality when exiting edit mode
   - Visual edit mode indicator

2. **Widget Management**
   - Drag and drop positioning with pixel-perfect control
   - 8-point resize handles (corners + edges) like Gecko Board/Photoshop
   - Widget content that grows/adapts when resized (not just whitespace)
   - Add new widgets via dropdown menu in edit mode
   - Remove widgets with delete functionality

3. **Layout System**
   - 48-column grid system (1 unit = 20px, total width = 960px)
   - Canvas-based absolute positioning 
   - Layout persistence in localStorage (or API)
   - Multiple layout templates support
   - User preference for default layout

4. **Responsive Widget Behavior**
   - Widgets adapt content based on size (width < 8 = very compact, etc.)
   - Dynamic content loading (more items in taller widgets)
   - Text size adaptation for smaller widgets
   - Hide/show elements based on available space

### Widget Types to Implement

1. **Statistics Cards**
   - Display metrics with icons and values
   - Color theming support
   - Compact/tall layout variations
   - Support for different stat types (saved jobs, applications, profile views)

2. **Quick Links Widget**
   - Navigation shortcuts with icons and labels
   - Show text until width < 180px, then icon-only with larger icons
   - Dynamic number of links based on widget height
   - Hover states with theme colors

3. **Recent Applications Widget**
   - Load real data from applications API
   - Show application status badges with colors
   - "View All" link with theme colors
   - Empty state with call-to-action button
   - Responsive content (more applications in taller widgets)

4. **Saved Jobs Widget**
   - Load real data from jobs API
   - Show job cards with company, location, salary
   - "View All" link with theme colors
   - Empty state with call-to-action button
   - Company initial avatars

5. **Profile Overview Widget**
   - Show authenticated user information
   - User avatar or placeholder
   - Member since date formatting
   - "Edit Profile" button

6. **HubSpot Integration Widgets**
   - Banner widget with full-width promotional content
   - Content card widget with images, text, CTA buttons
   - Mock service for HubSpot content with realistic data
   - Support for different content types (banners, blog posts, case studies)

### Technical Architecture

1. **Type System**
```typescript
interface WidgetConfig {
  id: string;
  type: string;
  title?: string;
  x: number;        // Pixel position
  y: number;        // Pixel position  
  w: number;        // Grid units (width)
  h: number;        // Grid units (height)
  config: Record<string, any>;
}

interface PageLayout {
  id: string;
  name: string;
  lastUpdated: string;
  widgets: WidgetConfig[];
}

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

2. **Component Structure**
   - `LiveEditingEngine`: Main editing interface
   - `ResizableWidget`: Wrapper with resize handles
   - `WidgetRegistry`: Widget type definitions and components
   - `LayoutService`: Persistence and layout management
   - Individual widget components in `/widgets` folder

3. **Services Required**
   - Layout service for save/load operations
   - Mock HubSpot service for content
   - Integration with existing API services (jobs, applications)

### User Experience Requirements

1. **Edit Mode Experience**
   - Clear visual indication of edit mode (orange indicator)
   - Grid overlay for alignment assistance
   - Transform handles appear on hover/selection
   - "Add Widget" button with dropdown selector
   - One-click exit from edit mode with auto-save

2. **Widget Interaction**
   - Smooth drag and resize operations
   - Visual feedback during interactions
   - Prevent accidental navigation during editing
   - Tooltip hints for very compact widgets

3. **Layout Management**
   - Layout selector dropdown in dashboard header
   - Create new layout with name prompt
   - Automatic layout switching and preference saving
   - Reset/clear layout functionality

### Integration Requirements

1. **Theme Integration**
   - Support for brand switching (Kelly Services, JobSearch Pro, Talent Finder)
   - Dynamic color adaptation for buttons, links, icons
   - Theme-aware hover states and accents
   - Brand colors: Kelly (gray/green), JobSearch Pro (blue), Talent Finder (emerald)

2. **Authentication Integration**
   - Use existing auth context for user information
   - Load user-specific data in widgets
   - Secure API calls for data fetching

3. **Navigation Integration** 
   - Links within widgets should work in view mode
   - Links disabled/prevented in edit mode
   - Proper routing integration

### Data Integration

1. **Real Data Loading**
   - Async data fetching with loading states
   - Error handling and retry mechanisms
   - Empty states with appropriate CTAs
   - Refresh data on widget resize/configuration changes

2. **Mock Services**
   - HubSpot content service with varied content types
   - Realistic sample data for development/testing
   - Search and filtering capabilities for content

### Implementation Steps

1. **Phase 1: Core Infrastructure**
   - Set up type system and interfaces
   - Create basic layout service
   - Implement simple widget registry
   - Build main dashboard container

2. **Phase 2: Editing Engine**
   - Implement live editing mode toggle
   - Create resizable widget wrapper
   - Add drag and drop positioning
   - Build resize handle system

3. **Phase 3: Widget Development**
   - Create all required widget types
   - Implement responsive behavior
   - Add theme integration
   - Connect to real data sources

4. **Phase 4: Advanced Features**
   - Multiple layout support
   - Widget configuration panels
   - Export/import functionality
   - Performance optimization

### Performance Requirements

- Smooth 60fps drag and resize operations
- Efficient re-rendering during interactions
- Lazy loading of widget content where appropriate
- Debounced save operations
- Memoized widget components

### Browser Support

- Modern browsers with ES6+ support
- Touch device support for mobile editing
- Responsive design for different screen sizes

### Testing Requirements

- Unit tests for all widget components
- Integration tests for layout service
- E2E tests for editing workflows
- Visual regression tests for layout consistency

## Implementation Notes

- Use React 19 RC with TypeScript
- Leverage existing component library and design system
- Follow established patterns for API integration
- Maintain consistency with existing application theming
- Ensure accessibility compliance (keyboard navigation, screen readers)
- Implement proper error boundaries and fallbacks

## Success Criteria

The implementation is successful when:
1. Users can toggle edit mode and see real content while editing
2. Widgets can be dragged, resized, and added/removed smoothly
3. Widget content adapts meaningfully to size changes
4. All widgets load real data and handle empty/loading states
5. Theme switching affects all widget colors appropriately
6. Layouts persist across browser sessions and page navigation
7. The system performs smoothly with 10+ widgets on screen
8. Mobile/touch devices can use basic editing functionality

This system should provide a professional-grade dashboard customization experience similar to tools like Gecko Board, Monday.com, or Notion's block system, but specifically tailored for job search dashboard content.