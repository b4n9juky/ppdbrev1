import { useState } from 'react';
import { createPortal } from 'react-dom';

const docTypeLabels = {
    foto: 'Pas Foto',
    ijazah: 'Ijazah',
    ktp_ortu: 'KTP Orang Tua',
    kk: 'Kartu Keluarga',
    akta: 'Akta Kelahiran',
    rapor: 'Rapor',
    prestasi: 'Sertifikat Prestasi',
    surat_keterangan: 'Surat Keterangan',
    other: 'Lainnya',
};

const docOrder = ['kk', 'akta', 'ijazah', 'rapor', 'surat_keterangan', 'foto', 'ktp_ortu', 'prestasi', 'other'];

function isImage(filePath) {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
}

function PreviewModal({ doc, documentTypes, onClose }) {
    const getTypeLabel = (doc) => {
        const dt = documentTypes.find(dt => dt.code === doc.document_type);
        return dt?.name || docTypeLabels[doc.document_type] || doc.document_type.replace('_', ' ');
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">{getTypeLabel(doc)}</h3>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="max-h-[70vh] overflow-auto p-5">
                    {isImage(doc.file_path) ? (
                        <img
                            src={`/storage/${doc.file_path}`}
                            alt={getTypeLabel(doc)}
                            className="w-full rounded-xl"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 mb-4">
                                <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-700 mb-1">File PDF</p>
                            <p className="text-xs text-gray-400 mb-4">{doc.file_path.split('/').pop()}</p>
                            <a
                                href={`/storage/${doc.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-emerald-600 hover:to-green-700"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Buka di Tab Baru
                            </a>
                        </div>
                    )}
                </div>
                <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-3 flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default function StudentDocuments({ documents = [], documentTypes = [] }) {
    const [previewDoc, setPreviewDoc] = useState(null);

    const getTypeLabel = (doc) => {
        const dt = documentTypes.find(dt => dt.code === doc.document_type);
        return dt?.name || docTypeLabels[doc.document_type] || doc.document_type.replace('_', ' ');
    };

    const getDocIcon = (doc) => {
        if (isImage(doc.file_path)) {
            return (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            );
        }
        return (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            </div>
        );
    };

    const sortedDocs = [...documents].sort((a, b) => {
        const ai = docOrder.indexOf(a.document_type);
        const bi = docOrder.indexOf(b.document_type);
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });

    return (
        <div>
            <p className="text-xs font-semibold text-gray-500 mb-3">Dokumen</p>
            <div className="space-y-2">
                {sortedDocs.length > 0 ? (
                    sortedDocs.map((doc) => (
                        <button
                            key={doc.id}
                            onClick={() => setPreviewDoc(doc)}
                            type="button"
                            className="w-full flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 text-left shadow-sm transition-all hover:border-emerald-200 hover:bg-emerald-50/30 hover:shadow-md"
                        >
                            {getDocIcon(doc)}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {getTypeLabel(doc)}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    {doc.file_path.split('/').pop()}
                                </p>
                            </div>
                            <svg className="h-4 w-4 shrink-0 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    ))
                ) : (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-4 text-center">
                        <p className="text-xs text-gray-400">Belum ada dokumen</p>
                    </div>
                )}
            </div>

            {previewDoc && (
                <PreviewModal
                    doc={previewDoc}
                    documentTypes={documentTypes}
                    onClose={() => setPreviewDoc(null)}
                />
            )}
        </div>
    );
}
