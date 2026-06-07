import { X, FileText, User, BookOpen, ClipboardList, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const statusBadge = {
    draft: 'bg-gray-100 text-gray-700 ring-gray-300',
    pending: 'bg-blue-50 text-blue-700 ring-blue-300',
    accepted: 'bg-emerald-50 text-emerald-700 ring-emerald-300',
    reserve: 'bg-amber-50 text-amber-700 ring-amber-300',
    rejected: 'bg-red-50 text-red-700 ring-red-300',
};

const statusLabels = {
    draft: 'Draft',
    pending: 'Pending',
    accepted: 'Passed',
    reserve: 'Reserve',
    rejected: 'Failed',
};

const processingLabels = {
    baru: 'Pending',
    diproses: 'In Progress',
    selesai: 'Verified',
};

export default function ApplicantDetailDrawer({ applicant, onClose }) {
    useEffect(() => {
        if (applicant) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [applicant]);

    if (!applicant) return null;

    const bio = applicant.student_biodata || {};
    const docs = applicant.student_documents || [];

    const drawer = (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 flex h-full w-full max-w-lg flex-col bg-white shadow-xl animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-purple-100 text-sm font-bold text-violet-700">
                            {(bio.full_name || applicant.user?.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">{bio.full_name || applicant.user?.name}</h3>
                            <p className="text-xs text-gray-400">ID: #{applicant.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                    {/* Status */}
                    <div className="flex gap-3">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${statusBadge[applicant.status] || 'bg-gray-100 text-gray-700 ring-gray-300'}`}>
                            {statusLabels[applicant.status] || applicant.status}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${applicant.processing_status === 'selesai' ? 'bg-emerald-50 text-emerald-700 ring-emerald-300' : applicant.processing_status === 'diproses' ? 'bg-amber-50 text-amber-700 ring-amber-300' : 'bg-blue-50 text-blue-700 ring-blue-300'}`}>
                            {processingLabels[applicant.processing_status] || applicant.processing_status}
                        </span>
                        {applicant.admission_path && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200">
                                {applicant.admission_path.name}
                            </span>
                        )}
                    </div>

                    {/* Profile Section */}
                    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <h4 className="text-sm font-semibold text-gray-900">Profile</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-xs text-gray-400">NISN</span>
                                <p className="font-medium text-gray-800">{bio.nisn || '-'}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400">Gender</span>
                                <p className="font-medium text-gray-800">{bio.gender === 'L' ? 'Laki-laki' : bio.gender === 'P' ? 'Perempuan' : '-'}</p>
                            </div>
                            <div className="col-span-2">
                                <span className="text-xs text-gray-400">Tempat, Tanggal Lahir</span>
                                <p className="font-medium text-gray-800">
                                    {[bio.birth_place, bio.birth_date ? new Date(bio.birth_date).toLocaleDateString('id-ID') : ''].filter(Boolean).join(', ') || '-'}
                                </p>
                            </div>
                            <div className="col-span-2">
                                <span className="text-xs text-gray-400">Alamat</span>
                                <p className="font-medium text-gray-800">{bio.address || '-'}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400">No. HP</span>
                                <p className="font-medium text-gray-800">{bio.phone_number || '-'}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400">Asal Sekolah</span>
                                <p className="font-medium text-gray-800">{bio.previous_school || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Documents Section */}
                    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <h4 className="text-sm font-semibold text-gray-900">Documents</h4>
                        </div>
                        {docs.length > 0 ? (
                            <div className="space-y-2">
                                {docs.map((doc, idx) => (
                                    <div key={idx} className="flex items-center justify-between rounded-lg bg-white px-3 py-2.5 shadow-sm ring-1 ring-gray-100">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-700">{doc.document_type}</span>
                                        </div>
                                        <a
                                            href={`/storage/${doc.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-800"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                            View
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">Tidak ada dokumen</p>
                        )}
                    </div>

                    {/* Scores Section */}
                    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-gray-400" />
                            <h4 className="text-sm font-semibold text-gray-900">Academic Scores</h4>
                        </div>
                        {applicant.subject_scores && applicant.subject_scores.length > 0 ? (
                            <div className="space-y-2">
                                {applicant.subject_scores.map((score, idx) => (
                                    <div key={idx} className="flex items-center justify-between rounded-lg bg-white px-3 py-2.5 shadow-sm ring-1 ring-gray-100">
                                        <span className="text-sm text-gray-700">{score.subject?.name || 'Mata Pelajaran'}</span>
                                        <span className="text-sm font-semibold text-gray-900">{score.scores ?? '-'}</span>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 px-3 py-2.5">
                                    <span className="text-sm font-semibold text-violet-800">Total Nilai</span>
                                    <span className="text-sm font-bold text-violet-900">{applicant.total_score ?? '-'}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">Belum ada nilai</p>
                        )}
                    </div>

                    {/* Notes Section */}
                    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <ClipboardList className="h-4 w-4 text-gray-400" />
                            <h4 className="text-sm font-semibold text-gray-900">Verification Notes</h4>
                        </div>
                        {applicant.verification_notes ? (
                            <div className="rounded-lg bg-white px-3 py-2.5 shadow-sm ring-1 ring-gray-100">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{applicant.verification_notes}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">Tidak ada catatan verifikasi</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(drawer, document.body);
}
