import StudentStatusCard from '@/Components/pendaftar/StudentStatusCard';
import StudentDocuments from '@/Components/pendaftar/StudentDocuments';
import StudentActions from '@/Components/pendaftar/StudentActions';
import StudentNotes from '@/Components/pendaftar/StudentNotes';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Pencil, Check, X } from 'lucide-react';

export default function StudentPreviewPanel({ registration, user, documentTypes, subjects = [], routePrefix = 'admin' }) {
    const [isEditingScores, setIsEditingScores] = useState(false);
    const [editScores, setEditScores] = useState([]);
    const [saving, setSaving] = useState(false);

    if (!registration) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center px-6">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
                        <svg className="h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Belum ada pendaftar dipilih</h3>
                    <p className="text-xs text-gray-400">Klik salah satu baris pada tabel untuk melihat detail</p>
                </div>
            </div>
        );
    }

    const bio = registration.student_biodata || {};
    const photo = registration.student_documents?.find(d => d.document_type === 'foto');
    const scores = registration.subject_scores || registration.subjectScores || [];
    const avgScore = scores.length > 0
        ? (scores.reduce((sum, s) => sum + (parseFloat(s.scores) || 0), 0) / scores.length).toFixed(2)
        : null;

    function startEditing() {
        const existingScores = {};
        scores.forEach((s) => {
            existingScores[s.subject_id] = s.scores ?? '';
        });
        setEditScores(subjects.map((s) => ({
            subject_id: s.id,
            scores: existingScores[s.id] ?? '',
        })));
        setIsEditingScores(true);
    }

    function cancelEditing() {
        setEditScores([]);
        setIsEditingScores(false);
    }

    function handleScoreChange(index, value) {
        setEditScores((prev) => prev.map((s, i) => (i === index ? { ...s, scores: value } : s)));
    }

    function handleSave() {
        setSaving(true);
        const payload = editScores.map((s) => ({
            subject_id: s.subject_id,
            scores: s.scores !== '' ? parseFloat(s.scores) : null,
        }));
        router.patch(route(`${routePrefix}.registrations.scores.update`, registration.id), {
            scores: payload,
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setSaving(false);
                setIsEditingScores(false);
                setEditScores([]);
            },
            onError: () => {
                setSaving(false);
            },
        });
    }

    return (
        <div className="p-5 space-y-6">
                {/* Identitas & Foto + QR/SKL */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                        {photo ? (
                            <img
                                src={`/storage/${photo.file_path}`}
                                alt="Foto"
                                className="h-20 w-20 rounded-2xl object-cover shadow-md ring-2 ring-gray-100"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-md">
                                <span className="text-2xl font-bold text-gray-400">
                                    {(bio.full_name || registration.user?.name || '?').charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold text-gray-900 truncate">
                                {bio.full_name || registration.user?.name || '-'}
                            </h2>
                            <div className="mt-1 space-y-0.5">
                                <p className="text-xs text-gray-500">
                                    NISN: <span className="font-mono font-medium text-gray-700">{bio.nisn || '-'}</span>
                                </p>
                                <p className="text-xs text-gray-500">
                                    NIK: <span className="font-mono font-medium text-gray-700">{bio.nik || '-'}</span>
                                </p>
                                <p className="text-xs text-gray-500">
                                    No. Pendaftaran: <span className="font-mono font-medium text-gray-700">{registration.id}</span>
                                </p>
                                <p className="text-xs text-gray-500">
                                    Jalur: <span className="font-medium text-gray-700">{registration.admission_path?.name || '-'}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 shrink-0 pl-4 border-l border-gray-100">
                        {registration.qrcode && (
                            <div className="flex flex-col items-center">
                                <img src={registration.qrcode} alt="QR" className="w-20 h-20" />
                                <span className="text-[10px] text-gray-400 mt-0.5">QR Pendaftaran</span>
                            </div>
                        )}
                        <a
                            href={route(`${routePrefix}.print.registration-proof`, registration.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-violet-700 shadow-sm ring-1 ring-violet-200 transition hover:bg-violet-50"
                        >
                            Cetak Bukti
                        </a>
                        {(registration.status === 'accepted' || registration.status === 'reserve') && (
                            <a
                                href={route(`${routePrefix}.print.decision-letter`, registration.id)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-200 transition hover:bg-emerald-50"
                            >
                                SK Kelulusan
                            </a>
                        )}
                    </div>
                </div>

                {/* Biodata Card */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Biodata Calon Siswa</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Asal Sekolah</span>
                            <span className="text-sm font-semibold text-gray-800">{bio.previous_school || '-'}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">No. WhatsApp / Kontak</span>
                            <span className="text-sm font-semibold text-gray-800 font-mono">{bio.phone_number || '-'}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Jenis Kelamin</span>
                            <span className="text-sm font-semibold text-gray-800">{bio.gender === 'male' ? 'Laki-laki' : bio.gender === 'female' ? 'Perempuan' : '-'}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tempat, Tanggal Lahir</span>
                            <span className="text-sm font-semibold text-gray-800">
                                {bio.birth_place || '-'}, {bio.birth_date ? (() => {
                                    try {
                                        const d = new Date(bio.birth_date);
                                        return isNaN(d.getTime()) ? bio.birth_date : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                                    } catch {
                                        return bio.birth_date || '-';
                                    }
                                })() : '-'}
                            </span>
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Alamat Lengkap</span>
                            <span className="text-sm font-semibold text-gray-800 leading-relaxed">{bio.address || '-'}</span>
                        </div>
                    </div>
                </div>

                {/* Nilai */}
                <div className={`rounded-xl border p-4 ${isEditingScores ? 'bg-white border-emerald-300' : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-100'}`}>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Nilai Seleksi</p>
                        {!isEditingScores && registration.processing_status !== 'baru' && subjects.length > 0 && (
                            <button
                                onClick={startEditing}
                                className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-200 transition hover:bg-emerald-50"
                            >
                                <Pencil className="h-3 w-3" />
                                Edit Nilai
                            </button>
                        )}
                    </div>

                    {!isEditingScores ? (
                        <>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Nilai Rata-rata</p>
                                    <p className="text-2xl font-bold text-emerald-700 mt-1">
                                        {avgScore || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Ranking</p>
                                    <p className="text-2xl font-bold text-emerald-700 mt-1">
                                        {registration.ranking || '-'}
                                    </p>
                                </div>
                            </div>
                            {scores.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-emerald-200/50">
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                        {scores.map((s) => (
                                            <div key={s.id || s.subject_id} className="flex justify-between text-xs">
                                                <span className="text-gray-600">{s.subject?.name || 'Mapel'}</span>
                                                <span className="font-semibold text-gray-900">{s.scores ?? '-'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="space-y-3">
                            {editScores.map((score, index) => (
                                <div key={score.subject_id}>
                                    <label className="mb-1 block text-xs font-semibold text-gray-600">
                                        {subjects.find((s) => s.id === score.subject_id)?.name || 'Mapel'}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={score.scores}
                                        onChange={(e) => handleScoreChange(index, e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 shadow-sm transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                                        placeholder="0 - 100"
                                    />
                                </div>
                            ))}
                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    onClick={cancelEditing}
                                    disabled={saving}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Batal
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:from-emerald-600 hover:to-green-700 disabled:opacity-60"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    {saving ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status */}
                <StudentStatusCard registration={registration} />

                {/* Dokumen */}
                <StudentDocuments documents={registration.student_documents || []} documentTypes={documentTypes || []} />

                {/* Catatan */}
                <StudentNotes key={`notes-${registration.id}`} registration={registration} routePrefix={routePrefix} />

                {/* Aksi */}
                <StudentActions key={`actions-${registration.id}`} registration={registration} user={user} routePrefix={routePrefix} />
            </div>
    );
}
