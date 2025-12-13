/**
 * RecentlyViewedManager - Track and display recently viewed products
 * Stores product data in localStorage for persistence across sessions
 */
class RecentlyViewedManager {
  constructor() {
    this.storageKey = 'pieces_recently_viewed';
    this.maxProducts = 12;
    this.listeners = new Set();
  }

  /**
   * Get recently viewed products from localStorage
   * @returns {Array} Array of product objects
   */
  getProducts() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Add a product to recently viewed
   * @param {Object} product - Product data
   * @param {string} product.id - Product ID
   * @param {string} product.handle - Product handle
   * @param {string} product.title - Product title
   * @param {string} product.url - Product URL
   * @param {string} product.image - Featured image URL
   * @param {number} product.price - Product price in cents
   * @param {number} [product.compareAtPrice] - Compare at price in cents
   * @param {string} [product.vendor] - Product vendor
   * @param {boolean} [product.available] - Product availability
   */
  addProduct(product) {
    if (!product || !product.id || !product.handle) return;

    const products = this.getProducts();

    // Remove if already exists (will be re-added at beginning)
    const filteredProducts = products.filter(p => p.id !== product.id);

    // Add to beginning of array
    const newProducts = [
      {
        id: product.id,
        handle: product.handle,
        title: product.title,
        url: product.url || `/products/${product.handle}`,
        image: product.image,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        vendor: product.vendor,
        available: product.available !== false,
        addedAt: Date.now()
      },
      ...filteredProducts
    ].slice(0, this.maxProducts);

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(newProducts));
      this.notify();
    } catch {
      // localStorage might be full or disabled
    }
  }

  /**
   * Remove a product from recently viewed
   * @param {string} productId - Product ID to remove
   */
  removeProduct(productId) {
    const products = this.getProducts();
    const filteredProducts = products.filter(p => p.id !== productId);

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(filteredProducts));
      this.notify();
    } catch {
      // Handle error silently
    }
  }

  /**
   * Clear all recently viewed products
   */
  clear() {
    try {
      localStorage.removeItem(this.storageKey);
      this.notify();
    } catch {
      // Handle error silently
    }
  }

  /**
   * Get products excluding a specific product ID
   * Useful for showing "recently viewed" on a product page without showing current product
   * @param {string} excludeId - Product ID to exclude
   * @param {number} limit - Maximum number of products to return
   * @returns {Array} Filtered array of products
   */
  getProductsExcluding(excludeId, limit = 8) {
    return this.getProducts()
      .filter(p => p.id !== excludeId)
      .slice(0, limit);
  }

  /**
   * Subscribe to changes
   * @param {Function} callback - Function to call when products change
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners of changes
   */
  notify() {
    const products = this.getProducts();
    this.listeners.forEach(callback => {
      try {
        callback(products);
      } catch {
        // Listener error - continue notifying others
      }
    });
  }

  /**
   * Format money according to shop settings
   */
  formatMoney(cents) {
    // Handle string input - remove any non-numeric chars except decimal
    if (typeof cents === 'string') {
      cents = cents.replace(/[^\d.-]/g, '');
      // If it has a decimal, it might be dollars - convert to cents
      if (cents.includes('.')) {
        cents = Math.round(parseFloat(cents) * 100);
      } else {
        cents = parseInt(cents, 10);
      }
    }
    cents = cents || 0;

    const moneyFormat = window.themeSettings?.moneyFormat || '${{amount}}';
    const value = cents / 100;
    const amountNoDecimals = Math.floor(value);

    // Format with thousand separators
    const amountFormatted = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const amountWithComma = value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const amountNoDecimalsWithComma = amountNoDecimals.toLocaleString('de-DE');
    const amountWithApostrophe = value.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return moneyFormat
      .replace(/\{\{\s*amount_with_comma_separator\s*\}\}/g, amountWithComma)
      .replace(/\{\{\s*amount_no_decimals_with_comma_separator\s*\}\}/g, amountNoDecimalsWithComma)
      .replace(/\{\{\s*amount_with_apostrophe_separator\s*\}\}/g, amountWithApostrophe)
      .replace(/\{\{\s*amount_no_decimals\s*\}\}/g, amountNoDecimals.toLocaleString('en-US'))
      .replace(/\{\{\s*amount\s*\}\}/g, amountFormatted);
  }
}

// Singleton export
export const recentlyViewedManager = new RecentlyViewedManager();
export default recentlyViewedManager;
