/**
 * Share Button Component
 * Native share API with clipboard fallback
 */
class ShareButton extends HTMLElement {
  constructor() {
    super();
    this.boundNativeShare = this.nativeShare.bind(this);
    this.boundOnToggle = this.onToggle.bind(this);
    this.boundCopyToClipboard = this.copyToClipboard.bind(this);
    this.boundClose = this.close.bind(this);
  }

  connectedCallback() {
    this.$shareButton = this.querySelector('button');
    this.$summary = this.querySelector('summary');
    this.$details = this.querySelector('details');
    this.$closeButton = this.querySelector('.share-button__close');
    this.$successMessage = this.querySelector('[id^="ShareMessage"]');
    this.$urlInput = this.querySelector('input');
    this.$copyButton = this.querySelector('.share-button__copy');

    this.urlToShare = this.$urlInput?.value || window.location.href;

    // Use native share API if available
    if (navigator.share) {
      if (this.$details) {
        this.$details.setAttribute('hidden', '');
      }
      if (this.$shareButton) {
        this.$shareButton.classList.remove('hidden');
        this.$shareButton.addEventListener('click', this.boundNativeShare);
      }
    } else {
      // Fallback to copy-to-clipboard
      if (this.$details) {
        this.$details.addEventListener('toggle', this.boundOnToggle);
      }
      if (this.$copyButton) {
        this.$copyButton.addEventListener('click', this.boundCopyToClipboard);
      }
      if (this.$closeButton) {
        this.$closeButton.addEventListener('click', this.boundClose);
      }
    }
  }

  disconnectedCallback() {
    if (navigator.share) {
      if (this.$shareButton) {
        this.$shareButton.removeEventListener('click', this.boundNativeShare);
      }
    } else {
      if (this.$details) {
        this.$details.removeEventListener('toggle', this.boundOnToggle);
      }
      if (this.$copyButton) {
        this.$copyButton.removeEventListener('click', this.boundCopyToClipboard);
      }
      if (this.$closeButton) {
        this.$closeButton.removeEventListener('click', this.boundClose);
      }
    }
  }

  nativeShare() {
    navigator.share({
      url: this.urlToShare,
      title: document.title,
    });
  }

  onToggle() {
    if (!this.$details?.open) {
      if (this.$successMessage) {
        this.$successMessage.classList.add('hidden');
        this.$successMessage.textContent = '';
      }
      if (this.$closeButton) {
        this.$closeButton.classList.add('hidden');
      }
      this.$summary?.focus();
    }
  }

  copyToClipboard() {
    if (!this.$urlInput) return;

    navigator.clipboard.writeText(this.$urlInput.value).then(() => {
      if (this.$successMessage) {
        this.$successMessage.classList.remove('hidden');
        this.$successMessage.textContent = window.accessibilityStrings?.shareSuccess || 'Link copied!';
      }
      if (this.$closeButton) {
        this.$closeButton.classList.remove('hidden');
        this.$closeButton.focus();
      }
    });
  }

  close() {
    if (this.$details) {
      this.$details.open = false;
    }
    this.onToggle();
  }

  updateUrl(url) {
    this.urlToShare = url;
    if (this.$urlInput) {
      this.$urlInput.value = url;
    }
  }
}

customElements.define('share-button', ShareButton);
export default ShareButton;
