/**
 * Toast notification utility
 * Provides user-friendly error/success notifications
 */

import { DURATION, TIMEOUT } from './constants.js';

class ToastManager {
  constructor() {
    this.container = null;
    this.queue = [];
    this.current = null;
  }

  /**
   * Ensure toast container exists in DOM
   */
  ensureContainer() {
    if (this.container) return;

    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    this.container.setAttribute('role', 'status');
    this.container.setAttribute('aria-live', 'polite');
    document.body.appendChild(this.container);
  }

  /**
   * Show a toast notification
   * @param {string} message - The message to display
   * @param {Object} options - Toast options
   * @param {string} options.type - 'success', 'error', 'info' (default: 'info')
   * @param {number} options.duration - Duration in ms (default: 4000)
   */
  show(message, options = {}) {
    const { type = 'info', duration = 4000 } = options;

    this.ensureContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;

    // Build toast structure safely without innerHTML for user content
    const iconSpan = document.createElement('span');
    iconSpan.className = 'toast__icon';
    const iconI = document.createElement('i');
    iconI.className = `ph ${this.getIcon(type)}`;
    iconSpan.appendChild(iconI);

    const messageSpan = document.createElement('span');
    messageSpan.className = 'toast__message';
    messageSpan.textContent = message; // Safe: uses textContent instead of innerHTML

    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast__close';
    closeBtn.setAttribute('aria-label', 'Dismiss');
    const closeIcon = document.createElement('i');
    closeIcon.className = 'ph ph-x';
    closeBtn.appendChild(closeIcon);

    toast.appendChild(iconSpan);
    toast.appendChild(messageSpan);
    toast.appendChild(closeBtn);

    // Close button handler
    closeBtn.addEventListener('click', () => this.dismiss(toast), { once: true });

    // Add to container
    this.container.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.classList.add('toast--visible');
    });

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => this.dismiss(toast), duration);
    }

    return toast;
  }

  /**
   * Get icon class for toast type
   */
  getIcon(type) {
    const icons = {
      success: 'ph-check-circle',
      error: 'ph-warning-circle',
      info: 'ph-info'
    };
    return icons[type] || icons.info;
  }

  /**
   * Dismiss a toast
   */
  dismiss(toast) {
    if (!toast || !toast.parentNode) return;

    toast.classList.remove('toast--visible');
    toast.classList.add('toast--leaving');

    // Remove after animation
    setTimeout(() => {
      toast.remove();
    }, DURATION.normal);
  }

  /**
   * Show success toast
   */
  success(message, duration = 4000) {
    return this.show(message, { type: 'success', duration });
  }

  /**
   * Show error toast
   */
  error(message, duration = 5000) {
    return this.show(message, { type: 'error', duration });
  }

  /**
   * Show info toast
   */
  info(message, duration = 4000) {
    return this.show(message, { type: 'info', duration });
  }
}

// Singleton export
export const toast = new ToastManager();
export default toast;
