import React, { useEffect, useRef } from 'react';

export default function Turnstile({ siteKey, onSuccess }) {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);
    const onSuccessRef = useRef(onSuccess);

    useEffect(() => {
        onSuccessRef.current = onSuccess;
    }, [onSuccess]);

    useEffect(() => {
        const renderWidget = () => {
            if (window.turnstile && containerRef.current && !widgetIdRef.current) {
                try {
                    widgetIdRef.current = window.turnstile.render(containerRef.current, {
                        sitekey: siteKey,
                        callback: (token) => {
                            onSuccessRef.current(token);
                        },
                        'expired-callback': () => {
                            onSuccessRef.current('');
                        },
                        'error-callback': () => {
                            onSuccessRef.current('');
                        }
                    });
                } catch (e) {
                    console.error('Failed to render Turnstile widget:', e);
                }
            }
        };

        // Load the Turnstile script dynamically if not loaded
        let script = document.getElementById('cloudflare-turnstile-script');
        if (!script) {
            script = document.createElement('script');
            script.id = 'cloudflare-turnstile-script';
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback&render=explicit';
            script.async = true;
            script.defer = true;
            window.onloadTurnstileCallback = renderWidget;
            document.body.appendChild(script);
        } else {
            if (window.turnstile) {
                renderWidget();
            } else {
                window.onloadTurnstileCallback = renderWidget;
            }
        }

        return () => {
            if (window.turnstile && widgetIdRef.current) {
                try {
                    window.turnstile.remove(widgetIdRef.current);
                    widgetIdRef.current = null;
                } catch (e) {
                    // Ignore cleanup error
                }
            }
        };
    }, [siteKey]);

    return (
        <div className="flex justify-center my-4">
            <div ref={containerRef} className="cf-turnstile" />
        </div>
    );
}
