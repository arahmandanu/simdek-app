import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { useIdleTimeout } from '../composables/useIdleTimeout';

describe('useIdleTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('initializes with correct default values', () => {
    const callback = vi.fn();

    const TestComponent = defineComponent({
      setup() {
        const idleTimeout = useIdleTimeout(callback);
        return { idleTimeout };
      },
      template: '<div></div>',
    });

    const wrapper = mount(TestComponent);

    const { showCountdown, countdownSeconds } = wrapper.vm.idleTimeout;

    expect(showCountdown.value).toBe(false);
    expect(countdownSeconds.value).toBe(10);

    wrapper.unmount();
  });

  it('returns isIdle state', () => {
    const callback = vi.fn();

    const TestComponent = defineComponent({
      setup() {
        const idleTimeout = useIdleTimeout(callback);
        return { idleTimeout };
      },
      template: '<div></div>',
    });

    const wrapper = mount(TestComponent);

    const { isIdle } = wrapper.vm.idleTimeout;

    expect(isIdle.value).toBe(false);

    wrapper.unmount();
  });
});
