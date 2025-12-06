// src/sdk.js
// LDJ Widget SDK - Intégration des services juridiques

const LDJWidget = {
  config: {},
  modal: null,
  iframe: null,

  init(options) {
    this.config = {
      partnerId: options.partnerId,
      configId: options.configId,
      apiUrl: options.apiUrl || 'https://api.ledevisjuridique.fr',
      widgetUrl: options.widgetUrl || 'https://app.ledevisjuridique.fr',
      services: options.services || ['ai_chat', 'documents', 'appointment', 'neojustice'],
      theme: {
        primaryColor: options.theme?.primaryColor || '#1D243C',
        buttonText: options.theme?.buttonText || 'Assistance juridique',
        logo: options.theme?.logo || null,
      },
    };

    this.injectStyles();
    this.injectButton();
    this.createModal();
    this.setupMessageListener();
  },

  injectStyles() {
    if (document.getElementById('ldj-widget-styles')) return;

    const style = document.createElement('style');
    style.id = 'ldj-widget-styles';
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

      #ldj-widget-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${this.config.theme.primaryColor};
        color: #fff;
        height: 44px;
        padding: 10px 20px;
        border-radius: 30px;
        border: none;
        cursor: pointer;
        z-index: 2147483646;
        font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 500;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      #ldj-widget-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
      }

      #ldj-widget-button svg {
        width: 20px;
        height: 20px;
      }

      #ldj-widget-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2147483647;
        font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      #ldj-widget-modal.open {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #ldj-widget-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
      }

      #ldj-widget-container {
        position: relative;
        width: 90%;
        max-width: 900px;
        height: 85%;
        max-height: 700px;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      #ldj-widget-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid #e5e7eb;
        background: #f9fafb;
      }

      #ldj-widget-header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      #ldj-widget-logo {
        height: 32px;
        width: auto;
      }

      #ldj-widget-title {
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
      }

      #ldj-widget-close {
        width: 36px;
        height: 36px;
        border: none;
        background: #f3f4f6;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }

      #ldj-widget-close:hover {
        background: #e5e7eb;
      }

      #ldj-widget-close svg {
        width: 20px;
        height: 20px;
        color: #6b7280;
      }

      #ldj-widget-iframe {
        flex: 1;
        width: 100%;
        border: none;
      }

      #ldj-widget-loader {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }

      #ldj-widget-loader.hidden {
        display: none;
      }

      .ldj-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e5e7eb;
        border-top-color: ${this.config.theme.primaryColor};
        border-radius: 50%;
        animation: ldj-spin 1s linear infinite;
      }

      @keyframes ldj-spin {
        to { transform: rotate(360deg); }
      }

      @media (max-width: 640px) {
        #ldj-widget-container {
          width: 100%;
          height: 100%;
          max-width: none;
          max-height: none;
          border-radius: 0;
        }

        #ldj-widget-button {
          bottom: 16px;
          right: 16px;
          padding: 8px 16px;
          height: 40px;
          font-size: 13px;
        }
      }
    `;
    document.head.appendChild(style);
  },

  injectButton() {
    if (document.getElementById('ldj-widget-button')) return;

    const button = document.createElement('button');
    button.id = 'ldj-widget-button';
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      ${this.config.theme.buttonText}
    `;
    button.addEventListener('click', () => this.open());
    document.body.appendChild(button);
  },

  createModal() {
    if (document.getElementById('ldj-widget-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'ldj-widget-modal';

    const logoHtml = this.config.theme.logo
      ? `<img id="ldj-widget-logo" src="${this.config.theme.logo}" alt="Logo" />`
      : '';

    modal.innerHTML = `
      <div id="ldj-widget-backdrop"></div>
      <div id="ldj-widget-container">
        <div id="ldj-widget-header">
          <div id="ldj-widget-header-left">
            ${logoHtml}
            <h2 id="ldj-widget-title">Assistance juridique</h2>
          </div>
          <button id="ldj-widget-close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div id="ldj-widget-loader">
          <div class="ldj-spinner"></div>
          <span style="color: #6b7280; font-size: 14px;">Chargement...</span>
        </div>
        <iframe id="ldj-widget-iframe"></iframe>
      </div>
    `;

    document.body.appendChild(modal);

    this.modal = modal;
    this.iframe = document.getElementById('ldj-widget-iframe');

    // Event listeners
    document.getElementById('ldj-widget-backdrop').addEventListener('click', () => this.close());
    document.getElementById('ldj-widget-close').addEventListener('click', () => this.close());

    // Hide loader when iframe loads
    this.iframe.addEventListener('load', () => {
      document.getElementById('ldj-widget-loader').classList.add('hidden');
    });
  },

  setupMessageListener() {
    window.addEventListener('message', (event) => {
      // Validate origin
      if (!event.origin.includes(new URL(this.config.widgetUrl).hostname)) return;

      const { type, data } = event.data || {};

      switch (type) {
        case 'ldj-widget-close':
          this.close();
          break;
        case 'ldj-widget-navigate':
          this.navigateTo(data.service);
          break;
        case 'ldj-widget-resize':
          // Handle resize if needed
          break;
      }
    });
  },

  open(service = null) {
    if (!this.modal) return;

    // Build iframe URL
    const url = new URL(`${this.config.widgetUrl}/widget-embed`);
    url.searchParams.set('partnerId', this.config.partnerId);
    url.searchParams.set('configId', this.config.configId);
    url.searchParams.set('primaryColor', this.config.theme.primaryColor);
    if (this.config.theme.logo) {
      url.searchParams.set('logo', this.config.theme.logo);
    }
    if (service) {
      url.pathname += `/${service}`;
    }

    // Show loader
    document.getElementById('ldj-widget-loader').classList.remove('hidden');

    // Load iframe
    this.iframe.src = url.toString();
    this.modal.classList.add('open');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Track widget open
    this.trackUsage('widget_view');
  },

  close() {
    if (!this.modal) return;

    this.modal.classList.remove('open');
    this.iframe.src = 'about:blank';
    document.body.style.overflow = '';
  },

  navigateTo(service) {
    this.open(service);
  },

  trackUsage(action, metadata = {}) {
    const url = `${this.config.apiUrl}/api/api-widget/usage`;

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        configId: this.config.configId,
        action,
        metadata: {
          ...metadata,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        },
      }),
    }).catch((err) => console.warn('LDJ Widget: tracking error', err));
  },
};

// Auto-init if LDJ_WIDGET_CONFIG is defined globally
if (typeof window !== 'undefined' && window.LDJ_WIDGET_CONFIG) {
  LDJWidget.init(window.LDJ_WIDGET_CONFIG);
}

// Export for ES modules and make available globally
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LDJWidget;
}
window.LDJWidget = LDJWidget;

export default LDJWidget;