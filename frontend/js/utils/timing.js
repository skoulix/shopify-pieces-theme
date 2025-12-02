/**
 * Timing Utilities
 * Debounce, throttle, and other timing functions
 */

/**
 * Debounce a function - delays execution until after wait ms have elapsed since the last call
 * @param {Function} fn - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
export function debounce(fn, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

/**
 * Throttle a function - limits execution to once per delay ms
 * @param {Function} fn - Function to throttle
 * @param {number} delay - Minimum milliseconds between calls
 * @returns {Function} Throttled function
 */
export function throttle(fn, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn.apply(this, args);
  };
}

/**
 * Wait for a specified duration
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Resolves after the duration
 */
export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Request animation frame with promise
 * @returns {Promise} Resolves on next animation frame
 */
export function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

// Export for global access (backwards compatibility)
if (typeof window !== 'undefined') {
  window.debounce = debounce;
  window.throttle = throttle;
}
