import StudentStatusCard from '@/Components/pendaftar/StudentStatusCard';
import StudentDocuments from '@/Components/pendaftar/StudentDocuments';
import StudentActions from '@/Components/pendaftar/StudentActions';
import StudentNotes from '@/Components/pendaftar/StudentNotes';

export default function StudentPreviewPanel({ registration, user, documentTypes }) {
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
    const score = registration.total_score;
    const scores = registration.subject_scores || registration.subjectScores || [];
    const avgScore = scores.length > 0
        ? (scores.reduce((sum, s) => sum + (parseFloat(s.scores) || 0), 0) / scores.length).toFixed(2)
        : null;

    return (
        <div className="p-5 space-y-6">
                {/* Identitas & Foto */}
                <div className="flex items-start gap-4">
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
                    <div className="flex-1 min-w-0">
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

                {/* Nilai */}
                <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 p-4">
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
                </div>

                {/* Status */}
                <StudentStatusCard registration={registration} />

                {/* Dokumen */}
                <StudentDocuments documents={registration.student_documents || []} documentTypes={documentTypes || []} />

                {/* Catatan */}
                <StudentNotes registration={registration} />

                {/* Aksi */}
                <StudentActions registration={registration} user={user} />
            </div>
    );
}
