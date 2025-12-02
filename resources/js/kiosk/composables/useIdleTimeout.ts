import { ref, onMounted, onUnmounted } from 'vue';

const IDLE_TIMEOUT = 15 * 1000; // 15 seconds
const COUNTDOWN_START = 5 * 1000; // Show countdown at 5s remaining

export function useIdleTimeout(callback: () => void) {
  let timeoutId: number | null = null;
  let countdownIntervalId: number | null = null;

  const showCountdown = ref(false);
  const countdownSeconds = ref(10);
  const isIdle = ref(false);

  const clearTimers = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (countdownIntervalId) {
      clearInterval(countdownIntervalId);
      countdownIntervalId = null;
    }
  };

  const resetTimer = () => {
    clearTimers();
    showCountdown.value = false;
    countdownSeconds.value = 5;
    isIdle.value = false;

    // Set main timeout (15 seconds total)
    timeoutId = window.setTimeout(() => {
      // Start countdown (last 5 seconds)
      showCountdown.value = true;
      let countdown = 5;
      countdownSeconds.value = countdown;

      countdownIntervalId = window.setInterval(() => {
        countdown--;
        countdownSeconds.value = countdown;

        if (countdown <= 0) {
          clearTimers();
          showCountdown.value = false;
          isIdle.value = true;

          // Execute callback (return to attract mode)
          callback();
        }
      }, 1000);
    }, IDLE_TIMEOUT - COUNTDOWN_START);
  };

  const handleUserActivity = () => {
    resetTimer();
  };

  onMounted(() => {
    // List of events that indicate user activity
    const events = ['touchstart', 'touchmove', 'mousemove', 'mousedown', 'keydown'];

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Start the timer
    resetTimer();
  });

  onUnmounted(() => {
    clearTimers();

    const events = ['touchstart', 'touchmove', 'mousemove', 'mousedown', 'keydown'];

    events.forEach((event) => {
      window.removeEventListener(event, handleUserActivity);
    });
  });

  return {
    resetTimer,
    showCountdown,
    countdownSeconds,
    isIdle,
  };
}
