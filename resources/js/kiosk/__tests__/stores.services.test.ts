import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useServicesStore } from '../stores/services';

// Mock fetch
global.fetch = vi.fn();

describe('useServicesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with empty services array', () => {
    const store = useServicesStore();

    expect(store.services).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.lastFetch).toBeNull();
  });

  it('computes hasServices correctly', () => {
    const store = useServicesStore();

    expect(store.hasServices).toBe(false);

    store.services = [
      {
        id: 1,
        title: 'Service 1',
        titleMakassar: 'Service 1 MK',
        icon: 'mdi-home',
        action: 'navigate',
        route: '/path',
        order: 1,
      },
    ];

    expect(store.hasServices).toBe(true);
  });

  it('computes servicesCount correctly', () => {
    const store = useServicesStore();

    store.services = [
      {
        id: 1,
        title: 'Service 1',
        titleMakassar: 'Service 1 MK',
        icon: 'mdi-home',
        action: 'navigate',
        route: '/path1',
        order: 1,
      },
      {
        id: 2,
        title: 'Service 2',
        titleMakassar: 'Service 2 MK',
        icon: 'mdi-info',
        action: 'navigate',
        route: '/path2',
        order: 2,
      },
    ];

    expect(store.servicesCount).toBe(2);
  });

  it('gets service by id', () => {
    const store = useServicesStore();

    store.services = [
      {
        id: 1,
        title: 'Service 1',
        titleMakassar: 'Service 1 MK',
        icon: 'mdi-home',
        action: 'navigate',
        route: '/path1',
        order: 1,
      },
      {
        id: 2,
        title: 'Service 2',
        titleMakassar: 'Service 2 MK',
        icon: 'mdi-info',
        action: 'navigate',
        route: '/path2',
        order: 2,
      },
    ];

    const service = store.getServiceById(2);

    expect(service).toBeDefined();
    expect(service?.title).toBe('Service 2');
    expect(service?.id).toBe(2);
  });

  it('returns undefined for non-existent service id', () => {
    const store = useServicesStore();

    store.services = [
      {
        id: 1,
        title: 'Service 1',
        titleMakassar: 'Service 1 MK',
        icon: 'mdi-home',
        action: 'navigate',
        route: '/path1',
        order: 1,
      },
    ];

    const service = store.getServiceById(999);

    expect(service).toBeUndefined();
  });

  it('gets services by action type', () => {
    const store = useServicesStore();

    store.services = [
      {
        id: 1,
        title: 'Navigate Service',
        titleMakassar: 'Navigate Service MK',
        icon: 'mdi-navigation',
        action: 'navigate',
        route: '/path1',
        order: 1,
      },
      {
        id: 2,
        title: 'URL Service',
        titleMakassar: 'URL Service MK',
        icon: 'mdi-web',
        action: 'external',
        route: 'https://example.com',
        order: 2,
      },
      {
        id: 3,
        title: 'Another Navigate',
        titleMakassar: 'Another Navigate MK',
        icon: 'mdi-navigation',
        action: 'navigate',
        route: '/path2',
        order: 3,
      },
    ];

    const navigateServices = store.getServicesByAction('navigate');
    const externalServices = store.getServicesByAction('external');

    expect(navigateServices).toHaveLength(2);
    expect(externalServices).toHaveLength(1);
    expect(navigateServices[0].title).toBe('Navigate Service');
    expect(externalServices[0].title).toBe('URL Service');
  });

  it('resets store state', () => {
    const store = useServicesStore();

    store.services = [
      {
        id: 1,
        title: 'Service 1',
        titleMakassar: 'Service 1 MK',
        icon: 'mdi-home',
        action: 'navigate',
        route: '/path1',
        order: 1,
      },
    ];
    store.error = 'Some error';

    store.reset();

    expect(store.services).toEqual([]);
    expect(store.error).toBeNull();
    expect(store.lastFetch).toBeNull();
  });

  it('fetches and sorts services by order', async () => {
    const store = useServicesStore();

    const mockResponse = {
      services: [
        {
          id: 3,
          title: 'Service 3',
          titleMakassar: 'Service 3 MK',
          icon: 'mdi-web',
          action: 'navigate',
          route: '/path3',
          order: 3,
        },
        {
          id: 1,
          title: 'Service 1',
          titleMakassar: 'Service 1 MK',
          icon: 'mdi-home',
          action: 'navigate',
          route: '/path1',
          order: 1,
        },
        {
          id: 2,
          title: 'Service 2',
          titleMakassar: 'Service 2 MK',
          icon: 'mdi-info',
          action: 'navigate',
          route: '/path2',
          order: 2,
        },
      ],
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await store.fetchServices();

    expect(store.services).toHaveLength(3);
    expect(store.services[0].order).toBe(1);
    expect(store.services[1].order).toBe(2);
    expect(store.services[2].order).toBe(3);
  });

  it('handles fetch errors gracefully', async () => {
    const store = useServicesStore();

    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    try {
      await store.fetchServices();
    } catch {
      // Expected to throw
    }

    expect(store.error).toBe('Network error');
    expect(store.services).toEqual([]);
  });
});
