import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useConfigStore } from '../stores/config';

// Mock fetch
global.fetch = vi.fn();

describe('useConfigStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with default values', () => {
    const store = useConfigStore();

    expect(store.config).toBeDefined();
    expect(store.config.theme.primaryColor).toBe('#c2282a');
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('sets loading state when fetching', async () => {
    const store = useConfigStore();

    const mockResponse = {
      theme: {
        primaryColor: '#c2282a',
        logo: '/images/logo.png',
        headerTitle: 'Test Kiosk',
      },
      idleTimeout: {
        enabled: true,
        duration: 60000,
      },
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const promise = store.fetchConfig();
    expect(store.loading).toBe(true);

    await promise;
    expect(store.loading).toBe(false);
  });

  it('updates config on successful fetch', async () => {
    const store = useConfigStore();

    const mockResponse = {
      theme: {
        primaryColor: '#ff0000',
        logo: '/images/new-logo.png',
        headerTitle: 'New Kiosk Title',
      },
      idleTimeout: {
        enabled: true,
        duration: 120000,
      },
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await store.fetchConfig();

    expect(store.config.theme.primaryColor).toBe('#ff0000');
    expect(store.config.theme.logo).toBe('/images/new-logo.png');
    expect(store.config.theme.headerTitle).toBe('New Kiosk Title');
    expect(store.config.idleTimeout.enabled).toBe(true);
    expect(store.config.idleTimeout.duration).toBe(120000);
  });

  it('handles fetch errors', async () => {
    const store = useConfigStore();

    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    try {
      await store.fetchConfig();
    } catch {
      // Expected to throw
    }

    expect(store.error).toBe('Network error');
    expect(store.loading).toBe(false);
  });

  it('resets to default values', () => {
    const store = useConfigStore();

    store.config.theme.primaryColor = '#ff0000';
    store.error = 'Some error';

    store.reset();

    expect(store.config.theme.primaryColor).toBe('#c2282a');
    expect(store.error).toBeNull();
  });
});
