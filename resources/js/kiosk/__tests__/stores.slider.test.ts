import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSliderStore } from '../stores/slider';

// Mock fetch
global.fetch = vi.fn();

describe('useSliderStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with empty slides', () => {
    const store = useSliderStore();

    expect(store.slides).toEqual([]);
    expect(store.currentIndex).toBe(0);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('computes currentSlide correctly', () => {
    const store = useSliderStore();

    store.slides = [
      { id: 1, type: 'image', url: '/img1.jpg', duration: 10, order: 1 },
      { id: 2, type: 'image', url: '/img2.jpg', duration: 10, order: 2 },
    ];
    store.currentIndex = 1;

    expect(store.currentSlide).toEqual(store.slides[1]);
  });

  it('computes totalSlides correctly', () => {
    const store = useSliderStore();

    store.slides = [
      { id: 1, type: 'image', url: '/img1.jpg', duration: 10, order: 1 },
      { id: 2, type: 'image', url: '/img2.jpg', duration: 10, order: 2 },
      { id: 3, type: 'video', url: '/vid1.mp4', duration: 30, order: 3 },
    ];

    expect(store.totalSlides).toBe(3);
  });

  it('computes hasSlides correctly', () => {
    const store = useSliderStore();

    expect(store.hasSlides).toBe(false);

    store.slides = [{ id: 1, type: 'image', url: '/img1.jpg', duration: 10, order: 1 }];

    expect(store.hasSlides).toBe(true);
  });

  it('advances to next slide', () => {
    const store = useSliderStore();

    store.slides = [
      { id: 1, type: 'image', url: '/img1.jpg', duration: 10, order: 1 },
      { id: 2, type: 'image', url: '/img2.jpg', duration: 10, order: 2 },
      { id: 3, type: 'image', url: '/img3.jpg', duration: 10, order: 3 },
    ];
    store.currentIndex = 0;

    store.nextSlide();
    expect(store.currentIndex).toBe(1);

    store.nextSlide();
    expect(store.currentIndex).toBe(2);
  });

  it('loops to first slide after last', () => {
    const store = useSliderStore();

    store.slides = [
      { id: 1, type: 'image', url: '/img1.jpg', duration: 10, order: 1 },
      { id: 2, type: 'image', url: '/img2.jpg', duration: 10, order: 2 },
    ];
    store.currentIndex = 1; // Last slide

    store.nextSlide();
    expect(store.currentIndex).toBe(0); // Should loop to first
  });

  it('goes to previous slide', () => {
    const store = useSliderStore();

    store.slides = [
      { id: 1, type: 'image', url: '/img1.jpg', duration: 10, order: 1 },
      { id: 2, type: 'image', url: '/img2.jpg', duration: 10, order: 2 },
    ];
    store.currentIndex = 1;

    store.previousSlide();
    expect(store.currentIndex).toBe(0);
  });

  it('loops to last slide when going previous from first', () => {
    const store = useSliderStore();

    store.slides = [
      { id: 1, type: 'image', url: '/img1.jpg', duration: 10, order: 1 },
      { id: 2, type: 'image', url: '/img2.jpg', duration: 10, order: 2 },
    ];
    store.currentIndex = 0; // First slide

    store.previousSlide();
    expect(store.currentIndex).toBe(1); // Should loop to last
  });

  it('goes to specific slide', () => {
    const store = useSliderStore();

    store.slides = [
      { id: 1, type: 'image', url: '/img1.jpg', duration: 10, order: 1 },
      { id: 2, type: 'image', url: '/img2.jpg', duration: 10, order: 2 },
      { id: 3, type: 'image', url: '/img3.jpg', duration: 10, order: 3 },
    ];

    store.goToSlide(2);
    expect(store.currentIndex).toBe(2);
  });

  it('resets store state', () => {
    const store = useSliderStore();

    store.slides = [{ id: 1, type: 'image', url: '/img1.jpg', duration: 10, order: 1 }];
    store.currentIndex = 5;
    store.error = 'Some error';

    store.reset();

    expect(store.slides).toEqual([]);
    expect(store.currentIndex).toBe(0);
    expect(store.error).toBeNull();
  });

  it('fetches and sorts slides by order', async () => {
    const store = useSliderStore();

    const mockResponse = {
      slides: [
        { id: 3, type: 'image', url: '/img3.jpg', duration: 10, order: 3 },
        { id: 1, type: 'image', url: '/img1.jpg', duration: 10, order: 1 },
        { id: 2, type: 'video', url: '/vid1.mp4', duration: 30, order: 2 },
      ],
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await store.fetchSlides();

    expect(store.slides).toHaveLength(3);
    expect(store.slides[0].order).toBe(1);
    expect(store.slides[1].order).toBe(2);
    expect(store.slides[2].order).toBe(3);
  });
});
