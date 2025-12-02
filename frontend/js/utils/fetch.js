/**
 * Fetch Utilities
 * Helper functions for making HTTP requests
 */

/**
 * Get fetch configuration for Shopify AJAX API
 * @param {string} type - Response type ('json' or 'html')
 * @returns {Object} Fetch configuration object
 */
export function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: `application/${type}`,
    },
  };
}

/**
 * Fetch JSON data from a URL
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Parsed JSON response
 */
export async function fetchJSON(url, options = {}) {
  const response = await fetch(url, {
    ...fetchConfig('json'),
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch HTML from a URL
 * @param {string} url - URL to fetch
 * @returns {Promise<Document>} Parsed HTML document
 */
export async function fetchHTML(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const text = await response.text();
  return new DOMParser().parseFromString(text, 'text/html');
}

/**
 * Add item to cart via AJAX
 * @param {Object} items - Cart items to add
 * @returns {Promise<Object>} Cart response
 */
export async function addToCart(items) {
  const response = await fetch('/cart/add.js', {
    ...fetchConfig(),
    body: JSON.stringify({ items }),
  });

  return response.json();
}

/**
 * Update cart via AJAX
 * @param {Object} updates - Cart updates
 * @returns {Promise<Object>} Cart response
 */
export async function updateCart(updates) {
  const response = await fetch('/cart/update.js', {
    ...fetchConfig(),
    body: JSON.stringify({ updates }),
  });

  return response.json();
}

// Export for global access (backwards compatibility)
if (typeof window !== 'undefined') {
  window.fetchConfig = fetchConfig;
}
