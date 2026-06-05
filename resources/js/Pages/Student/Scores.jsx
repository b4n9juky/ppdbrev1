import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Scores({ registration, subjects }) {
    const isLocked = registration.status !== 'draft';

    const existingScores = {};
    (registration.subject_scores || []).forEach((s) => {
        existingScores[s.subject_id] = s.scores;
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
            scores: scores[s.id] !== '' ? parseFloat(scores[s.id]) : null,
        }));

        router.patch(route('student.scores.update'), { scores: payload }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    }

    return (
        <StudentLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#468432] to-[#9AD872] shadow-lg shadow-emerald-100">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Nilai Ijazah</h2>
                        <p className="text-sm text-gray-500">Masukkan nilai ijazah sekolah asal Anda</p>
                    </div>
                </div>
            }
        >
            <Head title="Nilai" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    {isLocked ? (
                        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                            <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-sm text-blue-700 flex items-center gap-3">
                                <svg className="h-5 w-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    Pendaftaran telah dikirim. Data nilai tidak dapat diubah kembali.
                                </div>
                            </div>
                            {subjects.length > 0 && (
                                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-gray-50/70">
                                            <tr>
                                                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Mata Pelajaran</th>
                                                <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Nilai Ijazah</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {subjects.map((s) => (
                                                <tr key={s.id} className="hover:bg-gray-50/50 transition">
                                                    <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{s.name}</td>
                                                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-gray-900 font-mono">
                                                        {existingScores[s.id] ?? '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <div className="mt-6 border-t border-gray-50 pt-5">
                                <Link
                                    href={route('student.dashboard')}
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#468432] transition hover:text-[#468432]/80"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Kembali ke Dashboard
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 border-b border-gray-50 pb-3">Input Nilai Ijazah</h3>
                            <p className="mt-2 text-sm text-gray-500 mb-6">
                                Masukkan nilai ijazah untuk setiap mata pelajaran (skala 0-100). Gunakan titik (.) untuk angka desimal.
                            </p>

                            {subjects.length === 0 ? (
                                <div className="py-12 text-center text-sm text-gray-400">Belum ada mata pelajaran yang ditentukan oleh administrator.</div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                                        <table className="min-w-full divide-y divide-gray-100">
                                            <thead className="bg-gray-50/70">
                                                <tr>
                                                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Mata Pelajaran</th>
                                                    <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-500 w-36">Nilai Ijazah</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {subjects.map((s) => (
                                                    <tr key={s.id} className="hover:bg-gray-50/50 transition">
                                                        <td className="px-5 py-3 text-sm font-medium text-gray-800">{s.name}</td>
                                                        <td className="px-5 py-3 text-right">
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
                                                                className="w-28 rounded-xl border-gray-200 text-right shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm font-mono"
                                                                placeholder="0-100"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-gray-50 pt-5">
                                        <Link
                                            href={route('student.dashboard')}
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-700"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                            </svg>
                                            Kembali
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#468432] to-[#9AD872] px-6 py-2.5 text-sm font-bold text-white shadow-sm shadow-[#468432]/10 hover:opacity-95 transition disabled:opacity-50"
                                        >
                                            {saving ? (
                                                <>
                                                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Simpan Nilai
                                                </>
                                            )}
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
