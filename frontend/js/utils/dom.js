/**
 * DOM Utilities
 * Helper functions for DOM manipulation
 */

/**
 * HTML Update Utility class
 * Used for swapping HTML nodes with view transition support
 */
export class HTMLUpdateUtility {
  /**
   * Swap an HTML node with new content using a view transition approach
   * @param {HTMLElement} oldNode - The node to replace
   * @param {HTMLElement} newContent - The new content
   * @param {Function[]} preProcessCallbacks - Callbacks to run before swap
   * @param {Function[]} postProcessCallbacks - Callbacks to run after swap
   */
  static viewTransition(oldNode, newContent, preProcessCallbacks = [], postProcessCallbacks = []) {
    preProcessCallbacks?.forEach((callback) => callback(newContent));

    const newNodeWrapper = document.createElement('div');
    HTMLUpdateUtility.setInnerHTML(newNodeWrapper, newContent.outerHTML);
    const newNode = newNodeWrapper.firstChild;

    // Dedupe IDs to prevent conflicts
    const uniqueKey = Date.now();
    oldNode.querySelectorAll('[id], [form]').forEach((element) => {
      if (element.id) element.id = `${element.id}-${uniqueKey}`;
      if (element.form) element.setAttribute('form', `${element.form.getAttribute('id')}-${uniqueKey}`);
    });

    oldNode.parentNode.insertBefore(newNode, oldNode);
    oldNode.style.display = 'none';

    postProcessCallbacks?.forEach((callback) => callback(newNode));

    setTimeout(() => oldNode.remove(), 500);
  }

  /**
   * Set innerHTML and reinject script tags to allow execution
   * @param {HTMLElement} element - The element to update
   * @param {string} html - The HTML string to set
   */
  static setInnerHTML(element, html) {
    element.innerHTML = html;
    element.querySelectorAll('script').forEach((oldScriptTag) => {
      const newScriptTag = document.createElement('script');
      Array.from(oldScriptTag.attributes).forEach((attribute) => {
        newScriptTag.setAttribute(attribute.name, attribute.value);
      });
      newScriptTag.appendChild(document.createTextNode(oldScriptTag.innerHTML));
      oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
    });
  }
}

/**
 * Section ID utilities for Shopify sections
 */
export class SectionId {
  static #separator = '__';

  /**
   * Parse the section ID from a qualified section ID
   * @param {string} qualifiedSectionId - e.g., 'template--22224696705326__main'
   * @returns {string} The section ID, e.g., 'template--22224696705326'
   */
  static parseId(qualifiedSectionId) {
    return qualifiedSectionId.split(SectionId.#separator)[0];
  }

  /**
   * Parse the section name from a qualified section ID
   * @param {string} qualifiedSectionId - e.g., 'template--22224696705326__main'
   * @returns {string} The section name, e.g., 'main'
   */
  static parseSectionName(qualifiedSectionId) {
    return qualifiedSectionId.split(SectionId.#separator)[1];
  }

  /**
   * Create a qualified section ID
   * @param {string} sectionId - The section ID
   * @param {string} sectionName - The section name
   * @returns {string} The qualified section ID
   */
  static getIdForSection(sectionId, sectionName) {
    return `${sectionId}${SectionId.#separator}${sectionName}`;
  }
}

/**
 * Parse HTML string to DOM
 * @param {string} html - HTML string to parse
 * @returns {Document} Parsed document
 */
export function parseHTML(html) {
  return new DOMParser().parseFromString(html, 'text/html');
}

/**
 * Get innerHTML from parsed HTML by selector
 * @param {string} html - HTML string
 * @param {string} selector - CSS selector
 * @returns {string} Inner HTML of selected element
 */
export function getSectionInnerHTML(html, selector = '.shopify-section') {
  return parseHTML(html).querySelector(selector)?.innerHTML || '';
}

/**
 * Create element from HTML string
 * @param {string} html - HTML string
 * @returns {HTMLElement} Created element
 */
export function createElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

// Export for global access (backwards compatibility)
if (typeof window !== 'undefined') {
  window.HTMLUpdateUtility = HTMLUpdateUtility;
  window.SectionId = SectionId;
}
