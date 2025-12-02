import { Piece } from 'piecesjs';
import { gsap } from 'gsap';
import { trapFocus, removeTrapFocus } from '../utils/focus.js';

/**
 * Header Component
 * Manages header animations, scroll behavior, and menu interactions
 * Replaces: menu-drawer, header-drawer from global.js
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
    this.breakpoint = 'tablet'; // matches data-breakpoint
  }

  mount() {
    // Get elements
    this.$header = this;
    this.$menuToggle = this.$('[data-menu-toggle]')[0];
    this.$menuDrawer = this.$('[data-menu-drawer]')[0];
    this.$menuOverlay = this.$('[data-menu-overlay]')[0];
    this.$submenus = this.$$('details.has-submenu');

    // Get breakpoint from data attribute
    this.breakpoint = this.dataset.breakpoint || 'tablet';

    // Bind main menu toggle
    if (this.$menuToggle) {
      this.on('click', this.$menuToggle, this.toggleMenu);
    }

    if (this.$menuOverlay) {
      this.on('click', this.$menuOverlay, this.closeMenu);
    }

    // Bind submenu toggles
    this.$submenus.forEach((submenu) => {
      const summary = submenu.querySelector('summary');
      if (summary) {
        this.on('click', summary, this.handleSubmenuClick);
      }
    });

    // Close buttons within menu
    this.$$('[data-menu-close]').forEach((btn) => {
      this.on('click', btn, this.handleCloseClick);
    });

    // Scroll behavior
    this.on('scroll', window, this.handleScroll);

    // Keyboard events
    this.on('keyup', this, this.handleKeyUp);

    // Focus out handling
    this.on('focusout', this, this.handleFocusOut);

    // Initial state
    this.handleScroll();

    // Entrance animation
    this.animateIn();
  }

  unmount() {
    this.off('scroll', window, this.handleScroll);
    this.off('keyup', this, this.handleKeyUp);
    this.off('focusout', this, this.handleFocusOut);

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
    // Set viewport height for mobile browsers
    document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);

    this.$header.classList.add('menu-open');
    document.body.classList.add(`overflow-hidden-${this.breakpoint}`);

    // Animate menu open
    if (this.$menuDrawer) {
      this.$menuDrawer.classList.add('menu-opening');

      gsap.fromTo(
        this.$menuDrawer,
        { x: '100%' },
        {
          x: '0%',
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            // Trap focus when animation completes
            trapFocus(this.$menuDrawer, this.$menuToggle);
          },
        }
      );
    }

    if (this.$menuOverlay) {
      gsap.fromTo(this.$menuOverlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }

    this.$menuToggle?.setAttribute('aria-expanded', 'true');

    // Stop Lenis scroll
    this.emit('menu:open', document, {});
  }

  closeMenu(returnFocus = true) {
    // Animate menu close
    if (this.$menuDrawer) {
      gsap.to(this.$menuDrawer, {
        x: '100%',
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          this.$header.classList.remove('menu-open');
          this.$menuDrawer.classList.remove('menu-opening');
          document.body.classList.remove(`overflow-hidden-${this.breakpoint}`);

          // Close all submenus
          this.closeAllSubmenus();

          // Release focus trap
          if (returnFocus) {
            removeTrapFocus(this.$menuToggle);
          }
        },
      });
    } else {
      this.$header.classList.remove('menu-open');
      document.body.classList.remove(`overflow-hidden-${this.breakpoint}`);
    }

    if (this.$menuOverlay) {
      gsap.to(this.$menuOverlay, { opacity: 0, duration: 0.3 });
    }

    this.$menuToggle?.setAttribute('aria-expanded', 'false');

    // Resume Lenis scroll
    this.emit('menu:close', document, {});
  }

  handleSubmenuClick(event) {
    const summary = event.currentTarget;
    const details = summary.parentElement;
    const isOpen = details.hasAttribute('open');

    // If opening, add animation class
    if (!isOpen) {
      setTimeout(() => {
        details.classList.add('menu-opening');
        summary.setAttribute('aria-expanded', 'true');

        // Trap focus in submenu
        const firstButton = details.querySelector('button, a');
        trapFocus(details.querySelector('.submenu') || details, firstButton);
      }, 100);
    }
  }

  handleCloseClick(event) {
    const details = event.currentTarget.closest('details');
    if (details) {
      this.closeSubmenu(details);
    } else {
      this.closeMenu();
    }
  }

  closeSubmenu(details) {
    details.classList.remove('menu-opening');
    details.querySelector('summary')?.setAttribute('aria-expanded', 'false');

    // Animate close
    setTimeout(() => {
      details.removeAttribute('open');
      removeTrapFocus(details.querySelector('summary'));
    }, 300);
  }

  closeAllSubmenus() {
    this.$submenus.forEach((submenu) => {
      submenu.removeAttribute('open');
      submenu.classList.remove('menu-opening');
      submenu.querySelector('summary')?.setAttribute('aria-expanded', 'false');
    });
  }

  handleKeyUp(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return;

    // Check for open submenu first
    const openSubmenu = event.target.closest('details[open]');
    if (openSubmenu && openSubmenu !== this.$menuDrawer?.closest('details')) {
      this.closeSubmenu(openSubmenu);
      return;
    }

    // Close main menu
    if (this.$header.classList.contains('menu-open')) {
      this.closeMenu();
    }
  }

  handleFocusOut() {
    // Close menu if focus leaves the header entirely
    setTimeout(() => {
      if (this.$header.classList.contains('menu-open') && !this.contains(document.activeElement)) {
        this.closeMenu(false);
      }
    });
  }

  // Reset method for Swup page transitions
  reset() {
    this.closeMenu(false);
    this.closeAllSubmenus();
    this.isScrolled = false;
    this.lastScrollY = 0;
  }

  // Reveal method (called by cart notification)
  reveal() {
    this.$header.classList.remove('is-hidden');
  }
}

customElements.define('c-header', Header);
export default Header;
