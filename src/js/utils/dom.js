/**
 * DOM manipulation utilities
 */

/**
 * Safely set HTML content from a trusted source (like server-rendered HTML)
 * Uses a DocumentFragment for better performance
 * @param {HTMLElement} element - Target element
 * @param {string} html - HTML string from trusted source
 */
export function setTrustedHTML(element, html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  element.replaceChildren(template.content);
}

/**
 * Replace element children with cloned nodes from another element
 * @param {HTMLElement} target - Target element
 * @param {HTMLElement} source - Source element to clone from
 */
export function replaceChildrenFrom(target, source) {
  target.replaceChildren(...source.cloneNode(true).childNodes);
}

/**
 * Create a focus trap for modal dialogs
 * @param {HTMLElement} element - Modal element to trap focus within
 * @returns {Object} - Object with destroy method to clean up
 */
export function createFocusTrap(element) {
  const focusableSelectors = [
    'button:not([disabled]):not([tabindex="-1"])',
    '[href]:not([tabindex="-1"])',
    'input:not([disabled]):not([tabindex="-1"])',
    'select:not([disabled]):not([tabindex="-1"])',
    'textarea:not([disabled]):not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  let focusableElements = [];
  let firstElement = null;
  let lastElement = null;

  function updateFocusableElements() {
    focusableElements = [...element.querySelectorAll(focusableSelectors)];
    firstElement = focusableElements[0];
    lastElement = focusableElements[focusableElements.length - 1];
  }

  function handleKeydown(e) {
    if (e.key !== 'Tab') return;

    updateFocusableElements();
    if (!focusableElements.length) return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  element.addEventListener('keydown', handleKeydown);

  // Initial focus
  updateFocusableElements();
  if (firstElement) {
    requestAnimationFrame(() => firstElement.focus());
  }

  return {
    update: updateFocusableElements,
    destroy() {
      element.removeEventListener('keydown', handleKeydown);
    }
  };
}

export default { setTrustedHTML, replaceChildrenFrom, createFocusTrap };
