import { Piece } from 'piecesjs';
import { gsap } from 'gsap';

/**
 * Modal Component
 * Accessible modal dialog with GSAP animations
 */
class Modal extends Piece {
  constructor() {
    super('Modal', {
      stylesheets: [],
    });

    this.openedBy = null;
    this.focusableElements = [];
    this.firstFocusable = null;
    this.lastFocusable = null;
  }

  mount() {
    this.$closeButtons = this.$$('[data-modal-close]');
    this.$dialog = this.$('[role="dialog"]')[0] || this;
    this.$overlay = this.$('[data-modal-overlay]')[0];

    // Bind close buttons
    this.$closeButtons.forEach((button) => {
      this.on('click', button, this.hide);
    });

    // Close on overlay click
    if (this.$overlay) {
      this.on('click', this.$overlay, this.hide);
    }

    // Close on escape
    this.on('keyup', this, this.onKeyUp);

    // Close on click outside dialog content
    this.on('click', this, this.onBackdropClick);

    // Move to body for proper stacking
    if (!this.moved) {
      this.moved = true;
      this.dataset.section = this.closest('.shopify-section')?.id?.replace('shopify-section-', '') || '';
      document.body.appendChild(this);
    }
  }

  unmount() {
    this.$closeButtons.forEach((button) => {
      this.off('click', button, this.hide);
    });
    if (this.$overlay) {
      this.off('click', this.$overlay, this.hide);
    }
    this.off('keyup', this, this.onKeyUp);
    this.off('click', this, this.onBackdropClick);
  }

  show(opener) {
    this.openedBy = opener;

    // Load deferred content if exists
    const popup = this.$('.template-popup')[0];
    if (popup?.loadContent) popup.loadContent();

    // Pause all media
    if (typeof pauseAllMedia === 'function') {
      pauseAllMedia();
    }

    // Show modal
    document.body.classList.add('overflow-hidden');
    this.setAttribute('open', '');

    // Animate in
    gsap.fromTo(
      this,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          this.trapFocus();
        },
      }
    );

    if (this.$dialog && this.$dialog !== this) {
      gsap.fromTo(
        this.$dialog,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
  }

  hide() {
    // Animate out
    gsap.to(this, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        document.body.classList.remove('overflow-hidden');
        this.removeAttribute('open');

        // Return focus
        this.releaseFocus();

        // Pause media
        if (typeof pauseAllMedia === 'function') {
          pauseAllMedia();
        }

        // Dispatch event
        document.body.dispatchEvent(new CustomEvent('modalClosed'));
      },
    });
  }

  onKeyUp(event) {
    if (event.code === 'Escape') {
      this.hide();
    }
  }

  onBackdropClick(event) {
    if (event.target === this) {
      this.hide();
    }
  }

  trapFocus() {
    this.focusableElements = this.getFocusableElements();
    this.firstFocusable = this.focusableElements[0];
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];

    // Focus first element
    this.$dialog?.focus();

    // Add tab trap
    this.on('keydown', this, this.handleTabKey);
  }

  releaseFocus() {
    this.off('keydown', this, this.handleTabKey);
    if (this.openedBy) {
      this.openedBy.focus();
    }
  }

  handleTabKey(event) {
    if (event.code !== 'Tab') return;

    if (event.shiftKey) {
      if (document.activeElement === this.firstFocusable) {
        event.preventDefault();
        this.lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === this.lastFocusable) {
        event.preventDefault();
        this.firstFocusable?.focus();
      }
    }
  }

  getFocusableElements() {
    return Array.from(
      this.querySelectorAll(
        'summary, a[href], button:enabled, [tabindex]:not([tabindex^="-"]), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe'
      )
    );
  }
}

customElements.define('c-modal', Modal);
export default Modal;
