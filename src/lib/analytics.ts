// src/lib/analytics.ts

// Extend Window interface to include Google Analytics properties
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

export const initializeGTM = (gtmId: string) => {
  if (!gtmId) return;
  
  // GTM initialization
  (function(w: Window & typeof globalThis, d: Document, s: string, l: string, i: string) {
    w[l as keyof Window] = w[l as keyof Window] || [];
    (w[l as keyof Window] as Record<string, unknown>[]).push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s) as HTMLScriptElement;
    const dl = l !== 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode?.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', gtmId);
};

export const initializeGA4 = (ga4Id: string) => {
  if (!ga4Id) return;
  
  // GA4 initialization
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', ga4Id);
};

export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
  }
  
  if (window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...parameters
    });
  }
};