import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';

/**
 * Product Lightbox Component
 * Uses PhotoSwipe Lightbox for product image gallery with video support
 */
class ProductLightbox extends HTMLElement {
  constructor() {
    super();
    this.lightbox = null;
    this.boundOnVariantChange = this.onVariantChange.bind(this);
  }

  connectedCallback() {
    requestAnimationFrame(() => {
      this.initLightbox();
    });

    document.addEventListener('variant:change', this.boundOnVariantChange);
  }

  disconnectedCallback() {
    document.removeEventListener('variant:change', this.boundOnVariantChange);
    if (this.lightbox) {
      this.lightbox.destroy();
      this.lightbox = null;
    }
  }

  onVariantChange() {
    setTimeout(() => this.initLightbox(), 100);
  }

  initLightbox() {
    if (this.lightbox) {
      this.lightbox.destroy();
    }

    const galleryItems = this.querySelectorAll('a[data-lightbox]');
    if (galleryItems.length === 0) return;

    this.lightbox = new PhotoSwipeLightbox({
      gallery: this,
      children: 'a[data-lightbox]',
      pswpModule: PhotoSwipe,
    });

    // Transform item data to handle videos
    this.lightbox.addFilter('itemData', (itemData, index) => {
      const el = galleryItems[index];
      if (!el) return itemData;

      const mediaType = el.dataset.mediaType || 'image';

      // Image - use default PhotoSwipe behavior
      if (mediaType === 'image') {
        return {
          src: el.href,
          width: parseInt(el.dataset.pswpWidth, 10) || 1920,
          height: parseInt(el.dataset.pswpHeight, 10) || 1280,
          alt: el.dataset.alt || '',
        };
      }

      // Video - use HTML content
      const videoHost = el.dataset.videoHost || 'local';
      const src = el.dataset.src || el.href;
      let videoHtml = '';

      if (videoHost === 'youtube') {
        const videoId = this.extractYouTubeId(src);
        videoHtml = `
          <div class="pswp__video-container" style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;">
            <iframe
              src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0"
              width="960"
              height="540"
              frameborder="0"
              allow="autoplay; fullscreen"
              allowfullscreen
              style="max-width:90vw;max-height:80vh;"
            ></iframe>
          </div>
        `;
      } else if (videoHost === 'vimeo') {
        const videoId = this.extractVimeoId(src);
        videoHtml = `
          <div class="pswp__video-container" style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;">
            <iframe
              src="https://player.vimeo.com/video/${videoId}?autoplay=1"
              width="960"
              height="540"
              frameborder="0"
              allow="autoplay; fullscreen"
              allowfullscreen
              style="max-width:90vw;max-height:80vh;"
            ></iframe>
          </div>
        `;
      } else {
        // Local/Shopify video
        videoHtml = `
          <div class="pswp__video-container" style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;">
            <video
              src="${src}"
              controls
              autoplay
              playsinline
              style="max-width:90vw;max-height:80vh;"
            ></video>
          </div>
        `;
      }

      return {
        html: videoHtml,
      };
    });

    // Handle HTML content for videos
    this.lightbox.on('contentLoad', (e) => {
      const { content } = e;
      if (content.data.html) {
        e.preventDefault();
        content.element = document.createElement('div');
        content.element.className = 'pswp__video-content';
        content.element.style.cssText = 'display:flex;align-items:center;justify-content:center;width:100%;height:100%;';
        content.element.innerHTML = content.data.html;
      }
    });

    this.lightbox.on('contentAppend', (e) => {
      const { content } = e;
      if (content.data.html && content.element) {
        e.preventDefault();
        content.slide.container.appendChild(content.element);
      }
    });

    // Stop videos when closing or changing slides
    this.lightbox.on('close', () => this.stopAllVideos());
    this.lightbox.on('change', () => this.stopAllVideos());

    this.lightbox.init();
  }

  stopAllVideos() {
    const videos = document.querySelectorAll('.pswp__video-content video, .pswp__video-content iframe');
    videos.forEach((el) => {
      if (el.tagName === 'VIDEO') {
        el.pause();
      } else if (el.tagName === 'IFRAME') {
        el.src = '';
      }
    });
  }

  extractYouTubeId(url) {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : '';
  }

  extractVimeoId(url) {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : '';
  }
}

customElements.define('product-lightbox', ProductLightbox);
export default ProductLightbox;
