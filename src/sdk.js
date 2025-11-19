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

    // Injecter la police Poppins si elle n'est pas déjà présente
    if (!document.getElementById('ldj-widget-font')) {
      const link = document.createElement('link');
      link.id = 'ldj-widget-font';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(link);
    }

    const button = document.createElement('button');
    button.id = 'ldj-widget-button';
    button.innerText = this.config.theme.buttonText || 'Assistance juridique';
    const primaryColor = this.config.theme.primaryColor || '#1D243C';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${primaryColor};
      color: #fff;
      height: 36px;
      padding: 8px 16px;
      border-radius: 30px;
      border: none;
      cursor: pointer;
      z-index: 2147483647;
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-weight: 500;
      font-size: 14px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      transition: background-color 0.2s, box-shadow 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    `;

    // Ajouter effet hover
    button.addEventListener('mouseenter', () => {
      button.style.background = '#151a2e';
      button.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.background = primaryColor;
      button.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    });

    button.addEventListener('click', () => {
      alert('LDJ Widget placeholder - à connecter à ton UI plus tard');
    });

    document.body.appendChild(button);
  },
};

export default LDJWidget;