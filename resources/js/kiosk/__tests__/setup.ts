import { vi } from 'vitest';
import { config } from '@vue/test-utils';

// Mock CSS imports
vi.mock('*.css', () => ({}));
vi.mock('*.scss', () => ({}));
vi.mock('*.sass', () => ({}));

// Mock Vuetify components
config.global.stubs = {
  VApp: true,
  VMain: true,
  VContainer: true,
  VRow: true,
  VCol: true,
  VCard: true,
  VCardText: true,
  VCardActions: true,
  VBtn: true,
  VIcon: true,
  VProgressCircular: true,
  VDialog: true,
  VAppBar: true,
  VToolbar: true,
  VToolbarTitle: true,
  VSpacer: true,
  VFooter: true,
};

// Mock localforage
vi.mock('localforage', () => ({
  default: {
    config: vi.fn(),
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;
