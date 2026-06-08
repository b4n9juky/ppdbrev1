import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function StudentNotes({ registration, routePrefix = 'admin' }) {
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanged, setHasChanged] = useState(false);

    useEffect(() => {
        setNotes('');
        setHasChanged(false);
    }, [registration?.id]);

    useEffect(() => {
        setHasChanged(notes.trim() !== '');
    }, [notes]);

    function handleSave() {
        if (!registration || !hasChanged) return;
        setIsSaving(true);
        router.post(route(`${routePrefix}.registrations.note`, registration.id), {
            notes,
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsSaving(false);
                setNotes('');
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
            
            {/* Display current active notes above the textarea */}
            {registration.verification_notes && (
                <div className="mb-3 rounded-xl bg-amber-50/60 border border-amber-100/80 p-3 text-xs text-amber-900 leading-relaxed shadow-sm">
                    <p className="font-semibold text-amber-950 mb-0.5">Catatan Saat Ini:</p>
                    <p className="whitespace-pre-wrap font-medium">{registration.verification_notes}</p>
                </div>
            )}

            {/* Only show the textarea if the processing status is NOT completed (selesai) */}
            {registration.processing_status !== 'selesai' ? (
                <>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Tulis catatan verifikasi baru untuk di-update..."
                        rows={3}
                        data-gramm="false"
                        data-gramm_editor="false"
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
                </>
            ) : (
                <div className="rounded-xl bg-gray-50 p-3 text-center text-xs text-gray-400 border border-gray-100">
                    Berkas telah diverifikasi (tidak dapat diubah)
                </div>
            )}
        </div>
    );
}
