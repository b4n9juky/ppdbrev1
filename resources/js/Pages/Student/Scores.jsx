import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Scores({ registration, subjects }) {
    const isLocked = registration.status !== 'draft';

    const existingScores = {};
    (registration.subject_scores || []).forEach((s) => {
        existingScores[s.subject_id] = s.ijazah_score;
    });

    const [scores, setScores] = useState(() => {
        const initial = {};
        subjects.forEach((s) => {
            initial[s.id] = existingScores[s.id] ?? '';
        });
        return initial;
    });

    const [saving, setSaving] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);

        const payload = subjects.map((s) => ({
            subject_id: s.id,
            ijazah_score: scores[s.id] !== '' ? parseFloat(scores[s.id]) : null,
        }));

        router.patch(route('student.scores.update'), { scores: payload }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    }

    return (
        <StudentLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Nilai Ijazah
                </h2>
            }
        >
            <Head title="Nilai" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    {isLocked ? (
                        <div className="rounded-xl border bg-white p-8 shadow-sm">
                            <div className="mb-6 rounded-lg bg-blue-50 p-4 text-center text-blue-700">
                                Pendaftaran telah dikirim. Data tidak dapat diubah.
                            </div>
                            {subjects.length > 0 && (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Mata Pelajaran</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Nilai Ijazah</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {subjects.map((s) => (
                                            <tr key={s.id}>
                                                <td className="px-4 py-3 text-sm text-gray-800">{s.name}</td>
                                                <td className="px-4 py-3 text-right text-sm text-gray-800">
                                                    {existingScores[s.id] ?? '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            <div className="mt-6">
                                <Link
                                    href={route('student.dashboard')}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    &larr; Kembali ke Dashboard
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border bg-white p-8 shadow-sm">
                            <h3 className="mb-2 text-xl font-semibold text-gray-800">Nilai Ijazah</h3>
                            <p className="mb-6 text-sm text-gray-500">
                                Masukkan nilai ijazah untuk setiap mata pelajaran (0-100).
                            </p>

                            {subjects.length === 0 ? (
                                <p className="text-center text-gray-400">Belum ada mata pelajaran yang ditentukan.</p>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Mata Pelajaran</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Nilai Ijazah</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {subjects.map((s) => (
                                                <tr key={s.id}>
                                                    <td className="px-4 py-3 text-sm text-gray-800">{s.name}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                            value={scores[s.id]}
                                                            onChange={(e) =>
                                                                setScores((prev) => ({
                                                                    ...prev,
                                                                    [s.id]: e.target.value,
                                                                }))
                                                            }
                                                            className="w-28 rounded-md border-gray-300 text-right shadow-sm focus:border-green-500 focus:ring-green-500"
                                                            placeholder="0-100"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div className="flex items-center justify-between pt-4">
                                        <Link
                                            href={route('student.dashboard')}
                                            className="text-sm text-gray-500 hover:text-gray-700"
                                        >
                                            &larr; Kembali ke Dashboard
                                        </Link>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-600 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    Simpan Nilai
                                </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}
