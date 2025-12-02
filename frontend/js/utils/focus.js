/**
 * Focus Management Utilities
 * Handles focus trapping for modals, drawers, and accessible components
 */

const FOCUSABLE_SELECTOR =
  'summary, a[href], button:enabled, [tabindex]:not([tabindex^="-"]), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe';

const trapFocusHandlers = {};

/**
 * Get all focusable elements within a container
 * @param {HTMLElement} container - The container to search within
 * @returns {HTMLElement[]} Array of focusable elements
 */
export function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
}

/**
 * Trap focus within a container (for modals, drawers, etc.)
 * @param {HTMLElement} container - The container to trap focus within
 * @param {HTMLElement} elementToFocus - The element to focus initially
 */
export function trapFocus(container, elementToFocus = container) {
  const elements = getFocusableElements(container);
  const first = elements[0];
  const last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = (event) => {
    if (event.target !== container && event.target !== last && event.target !== first) return;
    document.addEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = () => {
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = (event) => {
    if (event.code.toUpperCase() !== 'TAB') return;

    // On the last focusable element and tab forward, focus the first element
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    // On the first focusable element and tab backward, focus the last element
    if ((event.target === container || event.target === first) && event.shiftKey) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener('focusout', trapFocusHandlers.focusout);
  document.addEventListener('focusin', trapFocusHandlers.focusin);

  elementToFocus.focus();

  // Select text in input fields
  if (
    elementToFocus.tagName === 'INPUT' &&
    ['search', 'text', 'email', 'url'].includes(elementToFocus.type) &&
    elementToFocus.value
  ) {
    elementToFocus.setSelectionRange(0, elementToFocus.value.length);
  }
}

/**
 * Remove focus trap and optionally focus an element
 * @param {HTMLElement|null} elementToFocus - Element to focus after removing trap
 */
export function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener('focusin', trapFocusHandlers.focusin);
  document.removeEventListener('focusout', trapFocusHandlers.focusout);
  document.removeEventListener('keydown', trapFocusHandlers.keydown);

  if (elementToFocus) elementToFocus.focus();
}

// Export for global access (backwards compatibility)
if (typeof window !== 'undefined') {
  window.trapFocus = trapFocus;
  window.removeTrapFocus = removeTrapFocus;
  window.getFocusableElements = getFocusableElements;
}
