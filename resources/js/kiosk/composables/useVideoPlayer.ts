import { ref, onUnmounted } from 'vue';
import type { Ref } from 'vue';

interface UseVideoPlayerOptions {
  onEnded?: () => void;
  onError?: (error: string) => void;
  onDurationDetected?: (duration: number) => void;
  onReady?: () => void;
  onPause?: () => void;
  onPlay?: () => void;
}

export function useVideoPlayer(
  videoElement: Ref<HTMLVideoElement | null>,
  url: string,
  options: UseVideoPlayerOptions = {}
) {
  const videoDuration = ref<number>(0);
  const playAttempts = ref(0);
  const maxPlayAttempts = 3;
  const isMounted = ref(false);

  const handleMetadataLoaded = () => {
    if (!videoElement.value || !isMounted.value) return;

    videoDuration.value = videoElement.value.duration;

    if (isFinite(videoDuration.value) && videoDuration.value > 0) {
      options.onDurationDetected?.(videoDuration.value * 1000);
      console.log(`Video duration detected: ${videoDuration.value}s`);
    }
  };

  const handleCanPlay = () => {
    if (isMounted.value) {
      options.onReady?.();
      attemptPlay();
    }
  };

  const handleError = (event: Event) => {
    const error = (event.target as HTMLVideoElement)?.error;
    const errorMsg = `Failed to load video: ${url} (code: ${error?.code}, message: ${error?.message})`;
    console.error(errorMsg);
    options.onError?.(errorMsg);
  };

  const handleEnded = () => {
    console.log('Video ended:', url);
    options.onEnded?.();
  };

  const handlePause = () => {
    // Detect unexpected pauses and attempt to resume
    if (isMounted.value && videoElement.value && !videoElement.value.ended) {
      console.warn('Video paused unexpectedly, attempting to resume:', url);
      options.onPause?.();
      attemptPlay();
    }
  };

  const handlePlay = () => {
    console.log('Video playing:', url);
    playAttempts.value = 0;
    options.onPlay?.();
  };

  const handleStalled = () => {
    console.warn('Video stalled (network issues):', url);
  };

  const handleWaiting = () => {
    console.log('Video buffering:', url);
  };

  // Attempt to play video with retry logic
  const attemptPlay = async () => {
    if (!videoElement.value || !isMounted.value) return;

    if (playAttempts.value >= maxPlayAttempts) {
      console.error('Max play attempts reached for:', url);
      options.onError?.('Max play attempts reached');
      return;
    }

    playAttempts.value++;

    try {
      await videoElement.value.play();
      console.log('Video play successful');
    } catch (error) {
      console.error('Video play failed:', error);

      // Retry after a short delay
      if (playAttempts.value < maxPlayAttempts) {
        setTimeout(() => attemptPlay(), 500);
      } else {
        options.onError?.('Failed to play video after multiple attempts');
      }
    }
  };

  // Handle page visibility changes (critical for kiosks)
  const handleVisibilityChange = () => {
    if (!videoElement.value || !isMounted.value) return;

    if (document.hidden) {
      console.log('Page hidden, pausing video');
      videoElement.value.pause();
    } else {
      console.log('Page visible, resuming video');
      attemptPlay();
    }
  };

  const setupListeners = () => {
    if (!videoElement.value) return;

    isMounted.value = true;

    // Add all event listeners
    videoElement.value.addEventListener('loadedmetadata', handleMetadataLoaded);
    videoElement.value.addEventListener('canplay', handleCanPlay);
    videoElement.value.addEventListener('loadeddata', handleCanPlay);
    videoElement.value.addEventListener('error', handleError);
    videoElement.value.addEventListener('ended', handleEnded);
    videoElement.value.addEventListener('pause', handlePause);
    videoElement.value.addEventListener('play', handlePlay);
    videoElement.value.addEventListener('stalled', handleStalled);
    videoElement.value.addEventListener('waiting', handleWaiting);

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Load and attempt to play
    videoElement.value.load();
  };

  const cleanup = () => {
    isMounted.value = false;

    // Remove visibility listener
    document.removeEventListener('visibilitychange', handleVisibilityChange);

    if (!videoElement.value) return;

    // Remove all event listeners
    videoElement.value.removeEventListener('loadedmetadata', handleMetadataLoaded);
    videoElement.value.removeEventListener('canplay', handleCanPlay);
    videoElement.value.removeEventListener('loadeddata', handleCanPlay);
    videoElement.value.removeEventListener('error', handleError);
    videoElement.value.removeEventListener('ended', handleEnded);
    videoElement.value.removeEventListener('pause', handlePause);
    videoElement.value.removeEventListener('play', handlePlay);
    videoElement.value.removeEventListener('stalled', handleStalled);
    videoElement.value.removeEventListener('waiting', handleWaiting);

    // Properly stop and clean up video
    videoElement.value.pause();
    videoElement.value.removeAttribute('src');
    videoElement.value.load(); // Important: releases resources
  };

  onUnmounted(cleanup);

  return {
    videoDuration,
    setupListeners,
    cleanup,
    attemptPlay,
  };
}
