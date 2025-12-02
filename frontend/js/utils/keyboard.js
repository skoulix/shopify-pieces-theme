/**
 * Keyboard Utilities
 * Event handlers for keyboard interactions
 */

/**
 * Handle escape key on details elements
 * @param {KeyboardEvent} event - The keyboard event
 */
export function onKeyUpEscape(event) {
  if (event.code.toUpperCase() !== 'ESCAPE') return;

  const openDetailsElement = event.target.closest('details[open]');
  if (!openDetailsElement) return;

  const summaryElement = openDetailsElement.querySelector('summary');
  openDetailsElement.removeAttribute('open');
  summaryElement.setAttribute('aria-expanded', 'false');
  summaryElement.focus();
}

/**
 * Check if a key event matches a specific key
 * @param {KeyboardEvent} event - The keyboard event
 * @param {string} key - The key to check (e.g., 'Escape', 'Enter', 'Tab')
 * @returns {boolean} Whether the key matches
 */
export function isKey(event, key) {
  return event.code.toUpperCase() === key.toUpperCase() || event.key.toUpperCase() === key.toUpperCase();
}

/**
 * Common key codes
 */
export const Keys = {
  ESCAPE: 'ESCAPE',
  ENTER: 'ENTER',
  SPACE: 'SPACE',
  TAB: 'TAB',
  ARROW_UP: 'ARROWUP',
  ARROW_DOWN: 'ARROWDOWN',
  ARROW_LEFT: 'ARROWLEFT',
  ARROW_RIGHT: 'ARROWRIGHT',
  HOME: 'HOME',
  END: 'END',
};

// Export for global access (backwards compatibility)
if (typeof window !== 'undefined') {
  window.onKeyUpEscape = onKeyUpEscape;
}
