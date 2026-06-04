import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ registration, subjects }) {
    const existingScores = {};
    (registration.subject_scores || []).forEach((s) => {
        existingScores[s.subject_id] = {
            ijazah_score: s.ijazah_score ?? '',
            test_score: s.test_score ?? '',
        };
    });

    const { data, setData, patch, processing, errors, setError } = useForm({
        scores: subjects.map((s) => ({
            subject_id: s.id,
            ijazah_score: existingScores[s.id]?.ijazah_score ?? '',
            test_score: existingScores[s.id]?.test_score ?? '',
        })),
    });

    function handleScoreChange(index, field, value) {
        const updated = data.scores.map((s, i) =>
            i === index ? { ...s, [field]: value } : s,
        );
        setData('scores', updated);
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (data.scores.length === 0) {
            setError('scores', 'Belum ada mata pelajaran.');
            return;
        }

        patch(route('admin.registrations.scores.update', registration.id), {
            preserveScroll: true,
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg shadow-purple-200">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Nilai Seleksi</h2>
                        <p className="text-sm text-gray-500">{registration.student_biodata?.full_name || 'Pendaftar'}</p>
                    </div>
                </div>
            }
        >
            <Head title="Nilai Seleksi" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Informasi Pendaftar</h3>
                                    <p className="mt-1 font-semibold text-gray-900">
                                        {registration.student_biodata?.full_name}
                                        <span className="ml-2 text-sm font-normal text-gray-500">— {registration.admission_path?.name}</span>
                                    </p>
                                </div>
                                {registration.total_score !== null && (
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Total Nilai</p>
                                        <p className="text-xl font-bold text-emerald-600">{registration.total_score}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="border-b border-gray-100 pb-4">
                            <h3 className="text-base font-semibold text-gray-900">Input Nilai</h3>
                            <p className="mt-1 text-sm text-gray-500">Masukkan nilai ijazah dan nilai tes untuk setiap mata pelajaran.</p>
                        </div>

                        {errors.scores && (
                            <p className="mt-4 text-sm text-red-600">{errors.scores}</p>
                        )}

                        {subjects.length === 0 ? (
                            <div className="mt-6 rounded-xl bg-gray-50 py-10 text-center text-sm text-gray-400">
                                Belum ada mata pelajaran yang tersedia untuk tahun ajaran ini.
                            </div>
                        ) : (
                            <div className="mt-6 overflow-hidden rounded-xl border border-gray-100">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Mata Pelajaran</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nilai Ijazah</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data.scores.map((score, index) => (
                                            <tr key={score.subject_id} className="transition-colors hover:bg-gray-50/50">
                                                <td className="px-5 py-3.5 text-sm font-medium text-gray-900">
                                                    {subjects.find((s) => s.id === score.subject_id)?.name || `Mapel #${score.subject_id}`}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max="100"
                                                        value={score.ijazah_score}
                                                        onChange={(e) => handleScoreChange(index, 'ijazah_score', e.target.value)}
                                                        className="block w-32 rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                                                        placeholder="0-100"
                                                    />
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {subjects.length > 0 && (
                            <div className="mt-6 flex justify-end border-t border-gray-100 pt-6">
                                <Button type="submit" disabled={processing} className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-sm shadow-emerald-200">
                                    Simpan Nilai
                                </Button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
