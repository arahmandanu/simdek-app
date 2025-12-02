import { ref, onMounted, onUnmounted } from 'vue';
import localforage from 'localforage';

/**
 * Composable for offline sync with IndexedDB caching
 *
 * Implements a NetworkFirst strategy:
 * 1. Try to fetch from API
 * 2. On success: cache to IndexedDB
 * 3. On fail: read from IndexedDB cache
 * 4. Auto-sync every 5 minutes when online
 */
export function useOfflineSync() {
  const isOnline = ref(navigator.onLine);
  const syncInterval = ref<number | null>(null);

  // Configure localforage
  const db = localforage.createInstance({
    name: 'simdes-kiosk',
    storeName: 'api-cache',
    description: 'SIMDES Kiosk API Cache',
  });

  /**
   * Update online status
   */
  function updateOnlineStatus() {
    isOnline.value = navigator.onLine;
  }

  /**
   * Sync a Pinia store with API and cache
   *
   * @param storeName - Name for cache key (e.g., 'config', 'slides')
   * @param apiEndpoint - API endpoint to fetch from
   * @param cacheKey - Optional custom cache key (defaults to storeName)
   * @returns Promise with the fetched data
   */
  async function syncStore<T>(
    storeName: string,
    apiEndpoint: string,
    cacheKey?: string
  ): Promise<T | null> {
    const key = cacheKey || storeName;

    try {
      // Try to fetch from API
      const response = await fetch(apiEndpoint);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: T = await response.json();

      // Cache the successful response
      await db.setItem(key, {
        data,
        timestamp: Date.now(),
      });

      console.log(`✓ Synced ${storeName} from API`);
      return data;
    } catch (error) {
      console.warn(`✗ Failed to fetch ${storeName} from API, using cache:`, error);

      // Try to read from cache
      try {
        const cached = await db.getItem<{ data: T; timestamp: number }>(key);

        if (cached) {
          const age = Date.now() - cached.timestamp;
          const ageMinutes = Math.floor(age / 60000);
          console.log(`→ Using cached ${storeName} (${ageMinutes} minutes old)`);
          return cached.data;
        }
      } catch (cacheError) {
        console.error(`✗ Failed to read ${storeName} from cache:`, cacheError);
      }

      return null;
    }
  }

  /**
   * Get cached data without attempting API fetch
   */
  async function getCached<T>(cacheKey: string): Promise<T | null> {
    try {
      const cached = await db.getItem<{ data: T; timestamp: number }>(cacheKey);
      return cached ? cached.data : null;
    } catch (error) {
      console.error(`Failed to read ${cacheKey} from cache:`, error);
      return null;
    }
  }

  /**
   * Clear all cached data
   */
  async function clearCache() {
    try {
      await db.clear();
      console.log('✓ Cache cleared');
    } catch (error) {
      console.error('✗ Failed to clear cache:', error);
    }
  }

  /**
   * Clear specific cache entry
   */
  async function clearCacheKey(key: string) {
    try {
      await db.removeItem(key);
      console.log(`✓ Cleared cache for ${key}`);
    } catch (error) {
      console.error(`✗ Failed to clear cache for ${key}:`, error);
    }
  }

  /**
   * Get cache age in milliseconds
   */
  async function getCacheAge(key: string): Promise<number | null> {
    try {
      const cached = await db.getItem<{ data: unknown; timestamp: number }>(key);
      if (cached) {
        return Date.now() - cached.timestamp;
      }
    } catch (error) {
      console.error(`Failed to get cache age for ${key}:`, error);
    }
    return null;
  }

  /**
   * Start auto-sync (every 5 minutes)
   */
  function startAutoSync(syncCallback: () => Promise<void>) {
    if (syncInterval.value) {
      clearInterval(syncInterval.value);
    }

    syncInterval.value = window.setInterval(
      async () => {
        if (isOnline.value) {
          console.log('→ Auto-sync triggered');
          try {
            await syncCallback();
          } catch (error) {
            console.error('✗ Auto-sync failed:', error);
          }
        }
      },
      5 * 60 * 1000
    ); // 5 minutes
  }

  /**
   * Stop auto-sync
   */
  function stopAutoSync() {
    if (syncInterval.value) {
      clearInterval(syncInterval.value);
      syncInterval.value = null;
    }
  }

  // Setup lifecycle hooks
  onMounted(() => {
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  });

  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus);
    window.removeEventListener('offline', updateOnlineStatus);
    stopAutoSync();
  });

  return {
    // State
    isOnline,

    // Methods
    syncStore,
    getCached,
    clearCache,
    clearCacheKey,
    getCacheAge,
    startAutoSync,
    stopAutoSync,
  };
}
