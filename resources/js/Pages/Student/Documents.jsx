import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { isImage } from '@/lib/utils';

const docTypeLabels = {
    foto: 'Pas Foto',
    ijazah: 'Ijazah',
    ktp_ortu: 'KTP Orang Tua',
    kk: 'Kartu Keluarga',
    prestasi: 'Sertifikat Prestasi',
    other: 'Lainnya',
};

const docTypeColors = {
    foto: 'bg-rose-50 text-rose-700 ring-rose-200',
    ijazah: 'bg-blue-50 text-blue-700 ring-blue-200',
    ktp_ortu: 'bg-amber-50 text-amber-700 ring-amber-200',
    kk: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    prestasi: 'bg-violet-50 text-violet-700 ring-violet-200',
    other: 'bg-gray-50 text-gray-600 ring-gray-200',
};

export default function Documents({ registration, activeYear, documentTypes = [] }) {
    const isLocked = registration && registration.status !== 'draft';
    const docs = registration?.student_documents || [];

    const [documentType, setDocumentType] = useState(() => {
        return documentTypes[0]?.code || 'foto';
    });
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    function handleFileChange(e) {
        const f = e.target.files[0] || null;
        
        if (f && f.size > 2 * 1024 * 1024) {
            alert('Ukuran file maksimal adalah 2MB. Silakan pilih file yang lebih kecil.');
            e.target.value = '';
            setFile(null);
            setPreviewUrl(null);
            return;
        }

        setFile(f);
        if (f && f.type.startsWith('image/')) {
            setPreviewUrl(URL.createObjectURL(f));
        } else {
            setPreviewUrl(null);
        }
    }

    function handleUpload(e) {
        e.preventDefault();
        if (!file) return;
        setUploading(true);

        router.post(route('student.registration.document'), {
            document_type: documentType,
            file: file,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setFile(null);
                setPreviewUrl(null);
                setUploading(false);
                setDocumentType(documentTypes[0]?.code || 'foto');
                // Reset file input
                const input = document.getElementById('doc-file-input-subpage');
                if (input) input.value = '';
            },
        });
    }

    function handleDelete(id) {
        if (confirm('Hapus dokumen ini?')) {
            router.delete(route('student.registration.document.delete', id), {
                preserveScroll: true,
            });
        }
    }

    return (
        <StudentLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#468432] to-[#9AD872] shadow-lg shadow-emerald-100">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Dokumen Pendaftaran</h2>
                        <p className="text-sm text-gray-500">Upload dan kelola dokumen berkas pendaftaran Anda</p>
                    </div>
                </div>
            }
        >
            <Head title="Dokumen" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    {!registration ? (
                        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-[#9AD872]/20 to-[#468432]/10 opacity-30" />
                            <div className="relative">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFEF91]/30 to-[#9AD872]/20 shadow-inner">
                                    <svg className="h-10 w-10 text-[#468432]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Belum Mendaftar</h3>
                                <p className="mt-2 text-gray-500 max-w-sm mx-auto">Silakan lakukan pendaftaran terlebih dahulu untuk mengupload dokumen.</p>
                                <Link
                                    href="/daftar"
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#468432] to-[#9AD872] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#468432]/10 transition hover:opacity-90"
                                >
                                    Daftar Sekarang
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {isLocked && (
                                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-sm text-blue-700 flex items-center gap-3">
                                    <svg className="h-5 w-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        Pendaftaran telah dikirim. Status: <span className="font-semibold capitalize">{registration.status}</span>. Data berkas dikunci dan tidak dapat diubah kembali.
                                    </div>
                                </div>
                            )}

                            {!isLocked && (
                                <form onSubmit={handleUpload} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                                    <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-3">
                                        <h4 className="text-sm font-bold text-gray-700">Upload Dokumen Baru</h4>
                                        <p className="text-xs text-gray-400">Format: PDF, JPG, PNG — Maksimal ukuran file 2MB</p>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jenis Dokumen</label>
                                                <select
                                                    value={documentType}
                                                    onChange={(e) => setDocumentType(e.target.value)}
                                                    className="block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-[#468432] focus:ring-[#468432] text-sm"
                                                >
                                                    {documentTypes.map((dt) => (
                                                        <option key={dt.id || dt.code} value={dt.code}>
                                                            {dt.name}
                                                        </option>
                                                    ))}
                                                </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">File Dokumen</label>
                                            <label
                                                htmlFor="doc-file-input-subpage"
                                                className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition ${
                                                    file
                                                        ? 'border-[#9AD872] bg-emerald-50/20'
                                                        : 'border-gray-200 bg-gray-50 hover:border-[#468432] hover:bg-emerald-50/10'
                                                }`}
                                            >
                                                {previewUrl ? (
                                                    <img src={previewUrl} alt="Preview" className="mb-3 h-24 w-auto rounded-lg object-contain shadow-sm" />
                                                ) : (
                                                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                                                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                    </div>
                                                )}
                                                {file ? (
                                                    <div className="text-center">
                                                        <p className="text-sm font-semibold text-[#468432]">{file.name}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <p className="text-sm font-semibold text-gray-600">Klik untuk memilih file</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">atau drag & drop file ke sini</p>
                                                    </div>
                                                )}
                                                <input
                                                    id="doc-file-input-subpage"
                                                    type="file"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    onChange={handleFileChange}
                                                    className="sr-only"
                                                />
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!file || uploading}
                                            className="w-full rounded-xl bg-gradient-to-r from-[#468432] to-[#9AD872] px-6 py-2.5 text-sm font-bold text-white shadow-sm shadow-[#468432]/10 hover:opacity-95 disabled:opacity-50 transition sm:w-auto"
                                        >
                                            {uploading ? (
                                                <span className="inline-flex items-center gap-2">
                                                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    Mengupload...
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-2">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    Upload Dokumen
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div>
                                <h4 className="mb-4 text-base font-bold text-gray-800 border-b border-gray-50 pb-3">Dokumen Terupload ({docs.length})</h4>
                                {docs.length > 0 ? (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {docs.map((doc) => {
                                            const typeColor = docTypeColors[doc.document_type] || docTypeColors.other;
                                            const typeLabel = documentTypes.find(dt => dt.code === doc.document_type)?.name || docTypeLabels[doc.document_type] || doc.document_type.replace('_', ' ');
                                            const fileName = doc.file_path.split('/').pop();
                                            const fileIsImage = isImage(doc.file_path);

                                            return (
                                                <div key={doc.id} className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
                                                    <div className="relative h-32 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                                                        {fileIsImage ? (
                                                            <img
                                                                src={`/storage/${doc.file_path}`}
                                                                alt={typeLabel}
                                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-2">
                                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                                                                    <svg className="h-7 w-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                                <span className="text-[10px] font-semibold text-gray-500">PDF</span>
                                                            </div>
                                                        )}
                                                        <a
                                                            href={`/storage/${doc.file_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/30"
                                                        >
                                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm opacity-0 transition-all group-hover:opacity-100 backdrop-blur-sm">
                                                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                Lihat
                                                            </span>
                                                        </a>
                                                    </div>
                                                    <div className="p-3 flex items-start justify-between gap-2">
                                                        <div className="min-w-0 flex-1">
                                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${typeColor}`}>
                                                                {typeLabel}
                                                            </span>
                                                            <p className="mt-1 truncate text-xs text-gray-400" title={fileName}>
                                                                {fileName}
                                                            </p>
                                                        </div>
                                                        {!isLocked && (
                                                            <button
                                                                onClick={() => handleDelete(doc.id)}
                                                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition"
                                                                title="Hapus berkas"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-gray-200 py-10 bg-white shadow-sm">
                                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                                            <svg className="h-7 w-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-500">Belum ada berkas terunggah</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-start border-t border-gray-50 pt-5">
                                <Link
                                    href={route('student.dashboard')}
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Kembali ke Dashboard
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}
