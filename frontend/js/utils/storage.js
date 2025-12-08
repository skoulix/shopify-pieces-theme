/**
 * Safe localStorage wrapper
 * Handles private browsing mode and quota exceeded errors
 */

/**
 * Safely get/set localStorage values
 * @param {string} key - Storage key
 * @param {*} [value] - Value to set (omit to get)
 * @returns {*} - Retrieved value, true on successful set, null/false on error
 */
export function safeLocalStorage(key, value) {
  try {
    if (value !== undefined) {
      localStorage.setItem(key, value);
      return true;
    }
    return localStorage.getItem(key);
  } catch (e) {
    // Private browsing mode or quota exceeded
    return value !== undefined ? false : null;
  }
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
