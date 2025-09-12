export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  config?: Record<string, any>;
}

export interface PageLayout {
  id: string;
  name: string;
  widgets: WidgetConfig[];
  lastUpdated: string;
}

export interface WidgetDefinition {
  type: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultSize: { w: number; h: number };
  minSize?: { w: number; h: number };
  maxSize?: { w: number; h: number };
  configSchema?: Record<string, any>;
  component: React.ComponentType<any>;
  previewComponent?: React.ComponentType<any>;
}

export interface HubSpotContent {
  id: string;
  title: string;
  type: 'banner' | 'card' | 'text' | 'image' | 'cta' | 'blog_post';
  content: string;
  htmlContent?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  publishedDate?: string;
  author?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface PageBuilderMode {
  isEditing: boolean;
  selectedWidget?: string;
  showPreview: boolean;
}