import { Piece } from 'piecesjs';
import { gsap } from 'gsap';

/**
 * Header Component
 * Manages header animations, scroll behavior, and menu interactions
 */
class Header extends Piece {
  constructor() {
    super('Header', {
      stylesheets: [],
    });

    this.isScrolled = false;
    this.lastScrollY = 0;
    this.scrollThreshold = 100;
    this.hideOnScroll = false;
  }

  mount() {
    // Get elements
    this.$header = this;
    this.$menuToggle = this.$('[data-menu-toggle]')[0];
    this.$menuDrawer = this.$('[data-menu-drawer]')[0];
    this.$menuOverlay = this.$('[data-menu-overlay]')[0];

    // Bind events
    if (this.$menuToggle) {
      this.on('click', this.$menuToggle, this.toggleMenu);
    }

    if (this.$menuOverlay) {
      this.on('click', this.$menuOverlay, this.closeMenu);
    }

    // Scroll behavior
    this.on('scroll', window, this.handleScroll);

    // Keyboard events
    this.on('keydown', document, this.handleKeydown);

    // Initial state
    this.handleScroll();

    // Entrance animation
    this.animateIn();
  }

  unmount() {
    this.off('scroll', window, this.handleScroll);
    this.off('keydown', document, this.handleKeydown);

    if (this.$menuToggle) {
      this.off('click', this.$menuToggle, this.toggleMenu);
    }

    if (this.$menuOverlay) {
      this.off('click', this.$menuOverlay, this.closeMenu);
    }
  }

  animateIn() {
    gsap.from(this.$header, {
      y: -100,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power2.out',
    });
  }

  handleScroll() {
    const scrollY = window.scrollY;

    // Toggle scrolled state
    if (scrollY > this.scrollThreshold && !this.isScrolled) {
      this.isScrolled = true;
      this.$header.classList.add('is-scrolled');
    } else if (scrollY <= this.scrollThreshold && this.isScrolled) {
      this.isScrolled = false;
      this.$header.classList.remove('is-scrolled');
    }

    // Hide on scroll down, show on scroll up
    if (this.hideOnScroll) {
      if (scrollY > this.lastScrollY && scrollY > this.scrollThreshold) {
        this.$header.classList.add('is-hidden');
      } else {
        this.$header.classList.remove('is-hidden');
      }
    }

    this.lastScrollY = scrollY;
  }

  toggleMenu() {
    const isOpen = this.$header.classList.contains('menu-open');

    if (isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.$header.classList.add('menu-open');
    document.body.classList.add('overflow-hidden');

    // Animate menu open
    if (this.$menuDrawer) {
      gsap.fromTo(
        this.$menuDrawer,
        { x: '100%' },
        {
          x: '0%',
          duration: 0.5,
          ease: 'power2.out',
        }
      );
    }

    if (this.$menuOverlay) {
      gsap.fromTo(
        this.$menuOverlay,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.3,
        }
      );
    }

    // Stop Lenis scroll
    this.emit('menu:open', document, {});
  }

  closeMenu() {
    // Animate menu close
    if (this.$menuDrawer) {
      gsap.to(this.$menuDrawer, {
        x: '100%',
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          this.$header.classList.remove('menu-open');
          document.body.classList.remove('overflow-hidden');
        },
      });
    }

    if (this.$menuOverlay) {
      gsap.to(this.$menuOverlay, {
        opacity: 0,
        duration: 0.3,
      });
    }

    // Resume Lenis scroll
    this.emit('menu:close', document, {});
  }

  handleKeydown(e) {
    if (e.key === 'Escape' && this.$header.classList.contains('menu-open')) {
      this.closeMenu();
    }
  }

  // Reset method for Swup page transitions
  reset() {
    this.closeMenu();
    this.isScrolled = false;
    this.lastScrollY = 0;
  }
}

customElements.define('c-header', Header);
export default Header;
