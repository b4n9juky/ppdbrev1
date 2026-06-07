import { router } from '@inertiajs/react';
import { useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function StudentScoreEditor({ registration, subjects, onClose }) {
    const existingScores = {};
    (registration.subject_scores || registration.subjectScores || []).forEach((s) => {
        existingScores[s.subject_id] = s.scores ?? '';
    });

    const [scores, setScores] = useState(
        subjects.map((s) => ({
            subject_id: s.id,
            scores: existingScores[s.id] ?? '',
        }))
    );

    const [saving, setSaving] = useState(false);

    function handleChange(index, value) {
        setScores((prev) => prev.map((s, i) => (i === index ? { ...s, scores: value } : s)));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        const payload = scores.map((s) => ({
            subject_id: s.subject_id,
            scores: s.scores !== '' ? parseFloat(s.scores) : null,
        }));
        router.patch(route('admin.registrations.scores.update', registration.id), {
            scores: payload,
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setSaving(false);
                onClose();
            },
            onError: () => {
                setSaving(false);
            },
        });
    }

    const modal = (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-green-100">
                            <BookOpen className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">Edit Nilai</h3>
                            <p className="text-xs text-gray-400">{registration.student_biodata?.full_name || registration.user?.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    {scores.map((score, index) => (
                        <div key={score.subject_id}>
                            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                                {subjects.find((s) => s.id === score.subject_id)?.name || 'Mapel'}
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                value={score.scores}
                                onChange={(e) => handleChange(index, e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 shadow-sm transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                                placeholder="0 - 100"
                            />
                        </div>
                    ))}

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2 text-sm font-bold text-white shadow-sm transition-all hover:from-emerald-600 hover:to-green-700 hover:shadow-md active:translate-y-px disabled:opacity-60"
                        >
                            {saving ? 'Menyimpan...' : 'Simpan Nilai'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}
