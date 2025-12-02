/**
 * Media Utilities
 * Handles pausing/playing of various media types
 */

/**
 * Pause all media on the page (videos, iframes, 3D models)
 */
export function pauseAllMedia() {
  // Pause YouTube videos
  document.querySelectorAll('.js-youtube').forEach((video) => {
    video.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
  });

  // Pause Vimeo videos
  document.querySelectorAll('.js-vimeo').forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', '*');
  });

  // Pause HTML5 videos
  document.querySelectorAll('video').forEach((video) => video.pause());

  // Pause 3D models
  document.querySelectorAll('product-model').forEach((model) => {
    if (model.modelViewerUI) model.modelViewerUI.pause();
  });
}

/**
 * Play a specific video element
 * @param {HTMLVideoElement} video - The video element to play
 */
export function playVideo(video) {
  if (video && typeof video.play === 'function') {
    video.play().catch(() => {
      // Autoplay was prevented, user interaction required
    });
  }
}

// Export for global access (backwards compatibility)
if (typeof window !== 'undefined') {
  window.pauseAllMedia = pauseAllMedia;
}
