'use client';

import { useEffect, useRef } from 'react';

interface ReCaptchaInstance {
  render: (container: HTMLElement, parameters: RenderParameters) => number;
  reset: (widgetId: number) => void;
}

interface RenderParameters {
  sitekey: string;
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: () => void;
}

interface RecaptchaProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}

export function Recaptcha({ onVerify, onExpire, onError }: RecaptchaProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const callbacksRef = useRef({ onVerify, onExpire, onError });

  // Update callbacks without re-rendering
  callbacksRef.current = { onVerify, onExpire, onError };

  useEffect(() => {
    // Type assertion for window
    const win = window as unknown as { grecaptcha?: ReCaptchaInstance };

    if (!siteKey) {
      console.error('reCAPTCHA site key is not defined. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY environment variable.');
      return;
    }

    const renderRecaptcha = () => {
      if (win.grecaptcha?.render && recaptchaRef.current && !widgetId.current) {
        try {
          widgetId.current = win.grecaptcha.render(recaptchaRef.current, {
            sitekey: siteKey,
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
          if (win.grecaptcha?.render) {
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
      script.onerror = () => {
        console.error('Failed to load reCAPTCHA script');
        callbacksRef.current.onError?.();
      };
      document.head.appendChild(script);
    };

    loadScript();

    return () => {
      if (widgetId.current !== null && win.grecaptcha?.reset) {
        try {
          win.grecaptcha.reset(widgetId.current);
        } catch (error) {
          console.error('reCAPTCHA reset error:', error);
        }
      }
    };
  }, [siteKey]);

  if (!siteKey) {
    return (
      <div className="text-red-500 p-4 border border-red-300 bg-red-50">
        reCAPTCHA configuration error: Missing site key
      </div>
    );
  }

  return <div className='w-full' ref={recaptchaRef} />;
}