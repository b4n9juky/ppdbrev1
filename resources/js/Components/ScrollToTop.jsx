import { ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-200 transition-all duration-300 hover:bg-emerald-700 hover:shadow-xl active:scale-95 ${
                visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll to top"
        >
            <ArrowUp className="h-5 w-5" />
        </button>
    );
}
