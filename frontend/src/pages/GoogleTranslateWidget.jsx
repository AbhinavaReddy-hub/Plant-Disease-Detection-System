import React, { useEffect } from 'react';

const GoogleTranslateWidget = () => {
  useEffect(() => {
    if (!window.isGoogleTranslateInitialized) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      // Define the global initialization function
      window.googleTranslateElementInit = () => {
        if (!document.querySelector('.VIpgJd-ZVi9od-xl07Ob-lTBxed')) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,hi,te,ur',
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            'translate'
          );
        }
        window.isGoogleTranslateInitialized = true;
      };
    } 
  }, []);

  return <div id="translate"></div>;
};

export default GoogleTranslateWidget;
