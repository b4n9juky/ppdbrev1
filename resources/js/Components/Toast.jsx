import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function Toast() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            setType('success');
            setVisible(true);
        } else if (flash?.error) {
            setMessage(flash.error);
            setType('error');
            setVisible(true);
        }
    }, [flash]);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                setVisible(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const icon = type === 'success' ? '✓' : '✕';

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            <div className={`flex items-center gap-3 rounded-xl px-5 py-3 text-white shadow-lg ${bgColor}`}>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
                    {icon}
                </span>
                <span className="text-sm font-medium">{message}</span>
                <button
                    onClick={() => setVisible(false)}
                    className="ml-2 text-white/70 hover:text-white"
                >
                    x
                </button>
            </div>
        </div>
    );
}
