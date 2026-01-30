/**
 * Safe localStorage wrapper
 * Handles private browsing mode and quota exceeded errors
 */

/**
 * Safely get a localStorage value
 * @param {string} key - Storage key
 * @returns {string|null} - Retrieved value or null on error/not found
 */
export function safeLocalStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    // Private browsing mode
    return null;
  }
}

/**
 * Safely set a localStorage value
 * @param {string} key - Storage key
 * @param {string} value - Value to set
 * @returns {boolean} - True on success, false on error
 */
export function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    // Private browsing mode or quota exceeded
    return false;
  }
}

/**
 * Safely get/set localStorage values (legacy API - prefer safeLocalStorageGet/Set)
 * @param {string} key - Storage key
 * @param {*} [value] - Value to set (omit to get)
 * @returns {*} - Retrieved value, true on successful set, null/false on error
 * @deprecated Use safeLocalStorageGet or safeLocalStorageSet for consistent types
 */
export function safeLocalStorage(key, value) {
  if (value !== undefined) {
    return safeLocalStorageSet(key, value);
  }
  return safeLocalStorageGet(key);
}

/**
 * Safely remove localStorage item
 * @param {string} key - Storage key
 * @returns {boolean} - Success status
 */
export function safeLocalStorageRemove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}

export default safeLocalStorage;
