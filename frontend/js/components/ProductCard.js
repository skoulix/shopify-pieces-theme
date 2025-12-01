import { Piece } from 'piecesjs';
import { gsap } from 'gsap';

/**
 * ProductCard Component
 * Handles product card hover effects and interactions
 */
class ProductCard extends Piece {
  constructor() {
    super('ProductCard', {
      stylesheets: [],
    });
  }

  mount() {
    // Get elements
    this.$image = this.$('img')[0];
    this.$secondaryImage = this.$('[data-secondary-image]')[0];
    this.$title = this.$('[data-product-title]')[0];
    this.$price = this.$('[data-product-price]')[0];
    this.$quickAdd = this.$('[data-quick-add]')[0];

    // Bind hover events
    this.on('mouseenter', this, this.handleMouseEnter);
    this.on('mouseleave', this, this.handleMouseLeave);

    // Quick add button
    if (this.$quickAdd) {
      this.on('click', this.$quickAdd, this.handleQuickAdd);
    }

    // Initial reveal animation (will be triggered by AnimationManager)
    if (this.hasAttribute('data-reveal')) {
      gsap.set(this, { opacity: 0, y: 30 });
    }
  }

  unmount() {
    this.off('mouseenter', this, this.handleMouseEnter);
    this.off('mouseleave', this, this.handleMouseLeave);

    if (this.$quickAdd) {
      this.off('click', this.$quickAdd, this.handleQuickAdd);
    }
  }

  handleMouseEnter() {
    // Scale up image
    if (this.$image) {
      gsap.to(this.$image, {
        scale: 1.05,
        duration: 0.6,
        ease: 'power2.out',
      });
    }

    // Show secondary image if exists
    if (this.$secondaryImage) {
      gsap.to(this.$secondaryImage, {
        opacity: 1,
        duration: 0.4,
      });
    }

    // Show quick add button
    if (this.$quickAdd) {
      gsap.to(this.$quickAdd, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }

  handleMouseLeave() {
    // Reset image scale
    if (this.$image) {
      gsap.to(this.$image, {
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
      });
    }

    // Hide secondary image
    if (this.$secondaryImage) {
      gsap.to(this.$secondaryImage, {
        opacity: 0,
        duration: 0.4,
      });
    }

    // Hide quick add button
    if (this.$quickAdd) {
      gsap.to(this.$quickAdd, {
        opacity: 0,
        y: 10,
        duration: 0.3,
      });
    }
  }

  handleQuickAdd(e) {
    e.preventDefault();
    e.stopPropagation();

    const variantId = this.$quickAdd.dataset.variantId;
    const quantity = parseInt(this.$quickAdd.dataset.quantity) || 1;

    if (!variantId) {
      console.warn('No variant ID found for quick add');
      return;
    }

    // Add loading state
    this.$quickAdd.classList.add('is-loading');

    // Add to cart via Shopify AJAX API
    fetch(window.routes.cart_add_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        id: variantId,
        quantity: quantity,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.$quickAdd.classList.remove('is-loading');
        this.$quickAdd.classList.add('is-added');

        // Emit event for cart drawer
        this.emit('cart:add', document, { item: data });

        // Reset button state after delay
        setTimeout(() => {
          this.$quickAdd.classList.remove('is-added');
        }, 2000);
      })
      .catch((error) => {
        console.error('Error adding to cart:', error);
        this.$quickAdd.classList.remove('is-loading');
        this.$quickAdd.classList.add('is-error');

        setTimeout(() => {
          this.$quickAdd.classList.remove('is-error');
        }, 2000);
      });
  }

  // Method for staggered reveal animations
  reveal(delay = 0) {
    gsap.to(this, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: delay,
      ease: 'power2.out',
    });
  }
}

customElements.define('c-product-card', ProductCard);
export default ProductCard;
