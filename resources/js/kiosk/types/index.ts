// TypeScript Interfaces for SIMDES Kiosk

/**
 * Kiosk Configuration
 */
export interface KioskConfig {
  theme: {
    primaryColor: string;
    logo: string;
    headerTitle: string;
  };
  idleTimeout: {
    enabled: boolean;
    duration: number; // milliseconds
  };
}

/**
 * Slide Item Types
 */
export type SlideType = 'image' | 'video' | 'pdf';

export interface SlideItem {
  id: number;
  type: SlideType;
  url: string;
  title?: string; // Optional title for display
  duration: number; // milliseconds, 0 for video (auto-detect)
  order: number;
}

export interface SlidesResponse {
  slides: SlideItem[];
}

/**
 * Service Item
 */
export type ServiceAction = 'navigate' | 'print' | 'external';

export interface ServiceItem {
  id: number;
  title: string;
  icon: string; // MDI icon name
  action: ServiceAction;
  route: string;
  order: number;
}

export interface ServicesResponse {
  services: ServiceItem[];
}

/**
 * Running Text Message
 */
export interface RunningTextMessage {
  id: number;
  text: string;
  textMakassar?: string;
  order: number;
}

export interface RunningTextResponse {
  messages: RunningTextMessage[];
}

/**
 * Analytics Event
 */
export interface AnalyticsEvent {
  event: string;
  data?: Record<string, unknown>;
  timestamp: number;
}

/**
 * Kiosk Mode
 */
export type KioskMode = 'attract' | 'services';

/**
 * API Response Wrapper
 */
export interface ApiResponse<T> {
  data: T;
  error?: string;
}
