import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useRunningTextStore } from '../stores/runningText';

// Mock fetch
global.fetch = vi.fn();

describe('useRunningTextStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with empty messages and Indonesian language', () => {
    const store = useRunningTextStore();

    expect(store.messages).toEqual([]);
    expect(store.language).toBe('id');
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.lastFetch).toBeNull();
  });

  it('computes hasMessages correctly', () => {
    const store = useRunningTextStore();

    expect(store.hasMessages).toBe(false);

    store.messages = [{ id: 1, text: 'Test', textMakassar: 'Test MK', order: 1 }];

    expect(store.hasMessages).toBe(true);
  });

  it('computes messageCount correctly', () => {
    const store = useRunningTextStore();

    store.messages = [
      { id: 1, text: 'Msg 1', textMakassar: 'Msg 1 MK', order: 1 },
      { id: 2, text: 'Msg 2', textMakassar: 'Msg 2 MK', order: 2 },
      { id: 3, text: 'Msg 3', textMakassar: 'Msg 3 MK', order: 3 },
    ];

    expect(store.messageCount).toBe(3);
  });

  it('displays Indonesian messages when language is id', () => {
    const store = useRunningTextStore();

    store.messages = [
      { id: 1, text: 'Indonesian 1', textMakassar: 'Makassar 1', order: 1 },
      { id: 2, text: 'Indonesian 2', textMakassar: 'Makassar 2', order: 2 },
    ];
    store.language = 'id';

    expect(store.displayMessages).toEqual(['Indonesian 1', 'Indonesian 2']);
  });

  it('displays Makassar messages when language is makassar', () => {
    const store = useRunningTextStore();

    store.messages = [
      { id: 1, text: 'Indonesian 1', textMakassar: 'Makassar 1', order: 1 },
      { id: 2, text: 'Indonesian 2', textMakassar: 'Makassar 2', order: 2 },
    ];
    store.language = 'makassar';

    expect(store.displayMessages).toEqual(['Makassar 1', 'Makassar 2']);
  });

  it('sets language', () => {
    const store = useRunningTextStore();

    expect(store.language).toBe('id');

    store.setLanguage('makassar');
    expect(store.language).toBe('makassar');

    store.setLanguage('id');
    expect(store.language).toBe('id');
  });

  it('toggles language between id and makassar', () => {
    const store = useRunningTextStore();

    expect(store.language).toBe('id');

    store.toggleLanguage();
    expect(store.language).toBe('makassar');

    store.toggleLanguage();
    expect(store.language).toBe('id');
  });

  it('resets store state', () => {
    const store = useRunningTextStore();

    store.messages = [{ id: 1, text: 'Test', textMakassar: 'Test MK', order: 1 }];
    store.language = 'makassar';
    store.error = 'Some error';

    store.reset();

    expect(store.messages).toEqual([]);
    expect(store.language).toBe('id');
    expect(store.error).toBeNull();
    expect(store.lastFetch).toBeNull();
  });

  it('fetches and sorts messages by order', async () => {
    const store = useRunningTextStore();

    const mockResponse = {
      messages: [
        { id: 3, text: 'Msg 3', textMakassar: 'Msg 3 MK', order: 3 },
        { id: 1, text: 'Msg 1', textMakassar: 'Msg 1 MK', order: 1 },
        { id: 2, text: 'Msg 2', textMakassar: 'Msg 2 MK', order: 2 },
      ],
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await store.fetchMessages();

    expect(store.messages).toHaveLength(3);
    expect(store.messages[0].order).toBe(1);
    expect(store.messages[1].order).toBe(2);
    expect(store.messages[2].order).toBe(3);
  });

  it('displays all messages correctly', () => {
    const store = useRunningTextStore();

    store.messages = [
      { id: 1, text: 'Message 1', textMakassar: 'Message 1 MK', order: 1 },
      { id: 2, text: 'Message 2', textMakassar: 'Message 2 MK', order: 2 },
      { id: 3, text: 'Message 3', textMakassar: 'Message 3 MK', order: 3 },
    ];
    store.language = 'id';

    expect(store.displayMessages).toEqual(['Message 1', 'Message 2', 'Message 3']);
    expect(store.displayMessages).toHaveLength(3);
  });
});
