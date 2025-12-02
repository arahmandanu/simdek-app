import { onMounted, onUnmounted, ref } from 'vue';

interface PerformanceMetrics {
  loadTime: number;
  ttfb: number;
  fcp: number;
  lcp: number;
  memoryUsage?: number;
}

/**
 * Composable for monitoring kiosk performance
 * Tracks key metrics: load time, TTFB, FCP, LCP, memory usage
 */
export function usePerformanceMonitor() {
  const metrics = ref<PerformanceMetrics>({
    loadTime: 0,
    ttfb: 0,
    fcp: 0,
    lcp: 0,
  });

  const memoryCheckInterval = ref<number | null>(null);
  const warningThreshold = 500; // MB

  const checkMemoryUsage = () => {
    if (
      'memory' in performance &&
      (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory
    ) {
      const memoryInfo = (performance as Performance & { memory: { usedJSHeapSize: number } })
        .memory;
      const usedMemoryMB = memoryInfo.usedJSHeapSize / 1048576;
      metrics.value.memoryUsage = Math.round(usedMemoryMB);

      // Warn if memory usage exceeds threshold
      if (usedMemoryMB > warningThreshold) {
        console.warn(
          `High memory usage detected: ${Math.round(usedMemoryMB)}MB (threshold: ${warningThreshold}MB)`
        );
      }
    }
  };

  const collectPerformanceMetrics = () => {
    try {
      // Get navigation timing
      const navTiming = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      if (navTiming) {
        metrics.value.loadTime = Math.round(navTiming.loadEventEnd - navTiming.fetchStart);
        metrics.value.ttfb = Math.round(navTiming.responseStart - navTiming.requestStart);
      }

      // Get paint timing (FCP)
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find((entry) => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        metrics.value.fcp = Math.round(fcpEntry.startTime);
      }

      // Get LCP using PerformanceObserver
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
            renderTime?: number;
            loadTime?: number;
          };
          if (lastEntry) {
            metrics.value.lcp = Math.round(lastEntry.renderTime || lastEntry.loadTime || 0);
          }
        });

        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      }

      // Initial memory check
      checkMemoryUsage();

      // Log performance metrics
      console.log('📊 Performance Metrics:', {
        'Load Time': `${metrics.value.loadTime}ms`,
        'Time to First Byte': `${metrics.value.ttfb}ms`,
        'First Contentful Paint': `${metrics.value.fcp}ms`,
        'Largest Contentful Paint': `${metrics.value.lcp}ms`,
        'Memory Usage': metrics.value.memoryUsage ? `${metrics.value.memoryUsage}MB` : 'N/A',
      });
    } catch (error) {
      console.error('Error collecting performance metrics:', error);
    }
  };

  onMounted(() => {
    // Collect metrics after page load
    if (document.readyState === 'complete') {
      collectPerformanceMetrics();
    } else {
      window.addEventListener('load', collectPerformanceMetrics);
    }

    // Check memory usage every 5 minutes
    memoryCheckInterval.value = window.setInterval(
      () => {
        checkMemoryUsage();
      },
      5 * 60 * 1000
    );
  });

  onUnmounted(() => {
    if (memoryCheckInterval.value) {
      clearInterval(memoryCheckInterval.value);
    }
  });

  return {
    metrics,
    checkMemoryUsage,
  };
}
