'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

interface RecaptchaProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}

export function Recaptcha({ onVerify, onExpire, onError }: RecaptchaProps) {
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const callbacksRef = useRef({ onVerify, onExpire, onError });

  // Update callbacks without re-rendering
  callbacksRef.current = { onVerify, onExpire, onError };

  useEffect(() => {
    const renderRecaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.render && recaptchaRef.current && !widgetId.current) {
        try {
          widgetId.current = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
            callback: (token: string) => callbacksRef.current.onVerify(token),
            'expired-callback': () => callbacksRef.current.onExpire?.(),
            'error-callback': () => callbacksRef.current.onError?.(),
          });
        } catch (error) {
          console.error('reCAPTCHA render error:', error);
        }
      }
    };

    const loadScript = () => {
      if (document.querySelector('script[src*="recaptcha"]')) {
        const checkReady = () => {
          if (window.grecaptcha && window.grecaptcha.render) {
            renderRecaptcha();
          } else {
            setTimeout(checkReady, 100);
          }
        };
        checkReady();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setTimeout(renderRecaptcha, 100);
      };
      document.head.appendChild(script);
    };

    loadScript();

    return () => {
      if (widgetId.current !== null && window.grecaptcha && window.grecaptcha.reset) {
        try {
          window.grecaptcha.reset(widgetId.current);
        } catch (error) {
          console.error('reCAPTCHA reset error:', error);
        }
      }
    };
  }, []); // Empty dependency array - only run once

  return <div className='w-full' ref={recaptchaRef} />;
}