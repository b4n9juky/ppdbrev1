import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function StudentNotes({ registration }) {
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanged, setHasChanged] = useState(false);

    useEffect(() => {
        setNotes(registration?.verification_notes || '');
        setHasChanged(false);
    }, [registration?.id, registration?.verification_notes]);

    useEffect(() => {
        if (!registration) return;
        const current = notes;
        const original = registration?.verification_notes || '';
        setHasChanged(current !== original);
    }, [notes, registration?.verification_notes, registration?.id]);

    function handleSave() {
        if (!registration || !hasChanged) return;
        setIsSaving(true);
        router.post(route('admin.registrations.note', registration.id), {
            notes,
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsSaving(false);
                setHasChanged(false);
            },
            onError: () => {
                setIsSaving(false);
            },
        });
    }

    if (!registration) {
        return (
            <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Catatan Verifikasi</p>
                <div className="rounded-xl bg-gray-50 p-4 text-center text-xs text-gray-400">
                    Pilih pendaftar untuk menambahkan catatan
                </div>
            </div>
        );
    }

    return (
        <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Catatan Verifikasi</p>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tulis catatan verifikasi..."
                rows={4}
                className="block w-full rounded-xl border-gray-200 bg-white text-sm shadow-sm transition placeholder:text-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
            {hasChanged && (
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:opacity-50"
                >
                    {isSaving ? 'Menyimpan...' : 'Simpan Catatan'}
                </button>
            )}
        </div>
    );
}
