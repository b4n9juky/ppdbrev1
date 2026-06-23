import React, { useEffect, useRef } from 'react';

export default function Turnstile({ siteKey, onSuccess }) {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);

    useEffect(() => {
        // Define global callback when the script loads
        window.onloadTurnstileCallback = () => {
            renderWidget();
        };

        const renderWidget = () => {
            if (window.turnstile && containerRef.current && !widgetIdRef.current) {
                try {
                    widgetIdRef.current = window.turnstile.render(containerRef.current, {
                        sitekey: siteKey,
                        callback: (token) => {
                            onSuccess(token);
                        },
                        'expired-callback': () => {
                            onSuccess('');
                        },
                        'error-callback': () => {
                            onSuccess('');
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
            document.body.appendChild(script);
        } else {
            // Script already exists, check if global turnstile object is available
            if (window.turnstile) {
                renderWidget();
            } else {
                // If script exists but turnstile is not loaded yet, wait for onload callback
                window.onloadTurnstileCallback = renderWidget;
            }
        }

        // Cleanup widget on unmount
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
    }, [siteKey, onSuccess]);

    return (
        <div className="flex justify-center my-4">
            <div ref={containerRef} className="cf-turnstile" />
        </div>
    );
}
