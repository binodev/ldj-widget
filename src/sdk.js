// src/sdk.js
const LDJWidget = {
  config: {},

  init(options) {
    this.config = {
      apiKey: options.apiKey,
      apiUrl: options.apiUrl || 'https://api.ledevisjuridique.fr/api/v1',
      services: options.services || ['appointment', 'documents', 'ai_chat'],
      theme: options.theme || {},
    };

    this.injectButton();
  },

  injectButton() {
    if (document.getElementById('ldj-widget-button')) return;

    const button = document.createElement('button');
    button.id = 'ldj-widget-button';
    button.innerText = this.config.theme.buttonText || 'Assistance juridique';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${this.config.theme.primaryColor || '#1E2B59'};
      color: #fff;
      padding: 12px 18px;
      border-radius: 999px;
      border: none;
      cursor: pointer;
      z-index: 2147483647;
      font-family: system-ui, sans-serif;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    `;

    button.addEventListener('click', () => {
      alert('LDJ Widget placeholder - à connecter à ton UI plus tard');
    });

    document.body.appendChild(button);
  },
};

export default LDJWidget;