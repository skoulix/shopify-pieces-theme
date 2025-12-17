/**
 * ProductLightboxManager
 * Handles product image lightbox using GLightbox
 * Supports images, videos, and external videos (YouTube/Vimeo)
 */

import GLightbox from 'glightbox';

class ProductLightboxManager {
  constructor() {
    this.lightbox = null;
    this.initialized = false;
  }

  /**
   * Initialize lightbox for a product gallery
   * @param {HTMLElement} gallery - The product gallery container
   * @param {Object} options - Configuration options
   */
  init(gallery, options = {}) {
    if (!gallery) return;

    const defaults = {
      touchNavigation: true,
      loop: true,
      autoplayVideos: false,
      closeOnOutsideClick: true,
      zoomable: true,
      draggable: true,
      dragToleranceX: 40,
      dragToleranceY: 65,
      openEffect: 'fade',
      closeEffect: 'fade',
      cssEffects: {
        fadeIn: 'glightbox-fade-in',
        fadeOut: 'glightbox-fade-out'
      },
      svg: {
        close: '<i class="ph ph-x"></i>',
        prev: '<i class="ph ph-caret-left"></i>',
        next: '<i class="ph ph-caret-right"></i>'
      },
      plyr: {
        css: '',
        js: '',
        config: {
          ratio: '16:9',
          muted: false,
          hideControls: true,
          youtube: {
            noCookie: true,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3
          },
          vimeo: {
            byline: false,
            portrait: false,
            title: false,
            speed: true,
            transparent: false
          }
        }
      }
    };

    const config = { ...defaults, ...options };

    // Build elements array from gallery media
    const elements = this.buildElements(gallery);

    if (elements.length === 0) return;

    // Destroy existing lightbox if any
    if (this.lightbox) {
      this.lightbox.destroy();
    }

    // Initialize GLightbox with elements
    this.lightbox = GLightbox({
      elements,
      ...config
    });

    // Bind click handlers to gallery images
    this.bindClickHandlers(gallery);

    this.initialized = true;
  }

  /**
   * Build GLightbox elements array from gallery media
   * @param {HTMLElement} gallery - The product gallery container
   * @returns {Array} Array of GLightbox element objects
   */
  buildElements(gallery) {
    const mediaItems = gallery.querySelectorAll('[data-gallery-image]');
    const elements = [];

    mediaItems.forEach((item) => {
      const mediaType = item.dataset.mediaType;

      switch (mediaType) {
        case 'image': {
          const img = item.querySelector('img');
          if (img) {
            // Get the highest resolution image URL
            const src = img.src.replace(/width=\d+/, 'width=2000');
            elements.push({
              href: src,
              type: 'image',
              alt: img.alt || '',
              width: img.naturalWidth || 2000,
              height: img.naturalHeight || 2000
            });
          }
          break;
        }

        case 'video': {
          const video = item.querySelector('video');
          if (video) {
            const sources = video.querySelectorAll('source');
            const src = sources.length > 0 ? sources[0].src : video.src;
            // GLightbox needs inline video HTML for local videos
            const videoHtml = `<video src="${src}" class="glightbox-video" controls playsinline preload="metadata" style="max-width:100%; max-height:80vh;"></video>`;
            elements.push({
              content: videoHtml,
              type: 'inline'
            });
          }
          break;
        }

        case 'external_video': {
          const videoId = item.dataset.externalVideoId;
          const host = item.dataset.externalVideoHost;

          if (videoId && host) {
            let href = '';
            if (host === 'youtube') {
              href = `https://www.youtube.com/watch?v=${videoId}`;
            } else if (host === 'vimeo') {
              href = `https://vimeo.com/${videoId}`;
            }

            if (href) {
              elements.push({
                href,
                type: 'video',
                source: host
              });
            }
          }
          break;
        }

        // Skip 3D models - they don't work well in lightbox
        case 'model':
        default:
          break;
      }
    });

    return elements;
  }

  /**
   * Bind click handlers to gallery images and videos
   * @param {HTMLElement} gallery - The product gallery container
   */
  bindClickHandlers(gallery) {
    const mediaItems = gallery.querySelectorAll('[data-gallery-image]');

    // Track the lightbox index (excludes 3D models)
    let lightboxIndex = 0;
    const indexMap = new Map();

    mediaItems.forEach((item) => {
      const mediaType = item.dataset.mediaType;
      if (mediaType !== 'model') {
        indexMap.set(item, lightboxIndex);
        lightboxIndex++;
      }
    });

    mediaItems.forEach((item) => {
      const mediaType = item.dataset.mediaType;

      // Bind to images - click anywhere opens lightbox
      if (mediaType === 'image') {
        item.style.cursor = 'zoom-in';

        item.addEventListener('click', (e) => {
          // Don't open lightbox if clicking on interactive elements
          if (e.target.closest('button, .model-viewer-ui')) {
            return;
          }

          e.preventDefault();
          this.open(indexMap.get(item));
        });
      }

      // Bind to videos - only zoom button opens lightbox (poster click plays inline)
      if (mediaType === 'video' || mediaType === 'external_video') {
        // Videos use the zoom button added in product.liquid
        // The poster click plays inline, lightbox is optional via zoom button
      }
    });
  }

  /**
   * Open the lightbox at a specific slide index
   * @param {number} index - Slide index to open
   */
  open(index = 0) {
    if (this.lightbox) {
      this.lightbox.openAt(index);
    }
  }

  /**
   * Close the lightbox
   */
  close() {
    if (this.lightbox) {
      this.lightbox.close();
    }
  }

  /**
   * Destroy the lightbox instance
   */
  destroy() {
    if (this.lightbox) {
      this.lightbox.destroy();
      this.lightbox = null;
      this.initialized = false;
    }
  }

  /**
   * Reinitialize lightbox (useful after dynamic content updates)
   * @param {HTMLElement} gallery - The product gallery container
   * @param {Object} options - Configuration options
   */
  refresh(gallery, options = {}) {
    this.destroy();
    this.init(gallery, options);
  }
}

// Export singleton instance
export const productLightbox = new ProductLightboxManager();
export default ProductLightboxManager;
