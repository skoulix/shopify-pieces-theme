import { Piece } from 'piecesjs';
import { gsap } from 'gsap';

/**
 * Magnetic Component
 * Creates magnetic hover effect on elements (buttons, links, etc.)
 */
class Magnetic extends Piece {
  constructor() {
    super('Magnetic', {
      stylesheets: [],
    });

    this.strength = 0.3;
    this.ease = 0.1;
  }

  mount() {
    // Get settings from data attributes
    this.strength = parseFloat(this.dataset.strength) || 0.3;
    this.ease = parseFloat(this.dataset.ease) || 0.1;

    // Get inner element if specified
    this.$inner = this.$('[data-magnetic-inner]')[0] || this.firstElementChild || this;

    // Bind events
    this.on('mouseenter', this, this.handleMouseEnter);
    this.on('mousemove', this, this.handleMouseMove);
    this.on('mouseleave', this, this.handleMouseLeave);
  }

  unmount() {
    this.off('mouseenter', this, this.handleMouseEnter);
    this.off('mousemove', this, this.handleMouseMove);
    this.off('mouseleave', this, this.handleMouseLeave);

    // Reset position
    gsap.set([this, this.$inner], { x: 0, y: 0 });
  }

  handleMouseEnter() {
    this.rect = this.getBoundingClientRect();
  }

  handleMouseMove(e) {
    if (!this.rect) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = this.rect;

    // Calculate center of element
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Calculate distance from center
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    // Apply magnetic effect
    gsap.to(this, {
      x: deltaX * this.strength,
      y: deltaY * this.strength,
      duration: 0.3,
      ease: 'power2.out',
    });

    // Apply stronger effect to inner element
    if (this.$inner && this.$inner !== this) {
      gsap.to(this.$inner, {
        x: deltaX * this.strength * 0.5,
        y: deltaY * this.strength * 0.5,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }

  handleMouseLeave() {
    // Reset position
    gsap.to(this, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });

    if (this.$inner && this.$inner !== this) {
      gsap.to(this.$inner, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      });
    }

    this.rect = null;
  }
}

customElements.define('c-magnetic', Magnetic);
export default Magnetic;
