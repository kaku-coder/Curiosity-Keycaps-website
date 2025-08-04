function manageChatStateBasedOnCurrentSettings(
  currentData,
  previousSettings,
  currentSettings,
) {
  Object.keys(currentSettings).forEach(key => {
    if (previousSettings[key] !== currentSettings[key]) {
      settingChanged(key, currentSettings[key], currentData);
    }
  });
}

function settingChanged(key, value, currentData) {
  switch (key) {
    case 'icon':
    case 'text':
      localStorage.setItem(
        'shopifyChatData',
        JSON.stringify({...currentData, isOpen: false}),
      );
      break;
    case 'greetingMessage':
      localStorage.setItem(
        'shopifyChatData',
        JSON.stringify({
          ...currentData,
          conversationId: null,
          sessionId: null,
          hasSentCustomerInfo: false,
          isOpen: true,
        }),
      );
      break;
  }
}

(function load() {
  const chatButton = document.getElementById('chat-button-container');
  const chatSettings = chatButton.dataset;
  const buttonHorizontalPosition = chatButton.getAttribute(
    'data-horizontal-position',
  );
  const buttonVerticalPosition = chatButton.getAttribute(
    'data-vertical-position',
  );
  const buttonIcon = chatButton.getAttribute('data-icon');
  const buttonText = chatButton.getAttribute('data-text');
  const buttonColor = chatButton.getAttribute('data-color');
  const buttonSecondaryColor = chatButton.getAttribute('data-secondary-color');
  const buttonTernaryColor = chatButton.getAttribute('data-ternary-color');
  const shopDomain = chatButton.getAttribute('data-domain');
  const externalIdentifier = chatButton.getAttribute(
    'data-external-identifier',
  );
  const customerId = chatButton.getAttribute('data-customer-id');
  const customerEmail = chatButton.getAttribute('data-customer-email');
  const customerFirstName = chatButton.getAttribute('data-customer-first-name');
  const customerLastName = chatButton.getAttribute('data-customer-last-name');
  const customerAcceptsMarketing = chatButton.getAttribute(
    'data-customer-accepts-marketing',
  );
  const customerLogoutUrl = chatButton.getAttribute('data-customer-logout-url');

  if (Shopify.designMode) {
    const chatPreviewJSON =
      sessionStorage.getItem('chatPreview') || JSON.stringify({});
    const previousSettings = JSON.parse(chatPreviewJSON);
    sessionStorage.setItem('chatPreview', JSON.stringify(chatSettings));

    const currentData =
      JSON.parse(localStorage.getItem('shopifyChatData')) || {};
    manageChatStateBasedOnCurrentSettings(
      currentData,
      previousSettings,
      chatSettings,
    );
  }

  const src = document.currentScript.src;
  const script = document.createElement('script');

  const chatSrc = 'shopifyChatV1Widget.js';
  const indexSrc = src.replace('inbox-chat-loader.js', chatSrc);

  script.src = indexSrc;
  script.type = 'module';
  script.defer = true;
  script.async = true;
  Object.assign(script.dataset, {
    buttonColor: buttonColor,
    secondaryColor: buttonSecondaryColor,
    ternaryColor: buttonTernaryColor,
    icon: buttonIcon,
    text: buttonText,
    position: buttonHorizontalPosition,
    verticalPosition: buttonVerticalPosition,
    shopId: externalIdentifier,
    shop: shopDomain,
    shopDomain: shopDomain,
    ...(customerId && {customerId}),
    ...(customerEmail && {customerEmail}),
    ...(customerFirstName && {customerFirstName}),
    ...(customerLastName && {customerLastName}),
    ...(customerAcceptsMarketing && {customerAcceptsMarketing}),
    ...(customerLogoutUrl && {customerLogoutUrl}),
  });

  chatButton.parentNode.appendChild(script);
})();
