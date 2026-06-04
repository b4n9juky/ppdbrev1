import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Documents({ registration, activeYear }) {
    const isLocked = registration && registration.status !== 'draft';
    const docs = registration?.student_documents || [];

    const [documentType, setDocumentType] = useState('ijazah');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

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
                setUploading(false);
                setDocumentType('ijazah');
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dokumen Pendaftaran
                </h2>
            }
        >
            <Head title="Dokumen" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    {!registration ? (
                        <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-800">Belum Mendaftar</h3>
                            <p className="mt-2 text-gray-500">Silakan daftar terlebih dahulu.</p>
                            <Link
                                href="/daftar"
                                className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
                            >
                                Daftar Sekarang
                            </Link>
                        </div>
                    ) : (
                        <div className="rounded-xl border bg-white p-8 shadow-sm">
                            {isLocked && (
                                <div className="mb-6 rounded-lg bg-blue-50 p-4 text-center text-blue-700">
                                    Pendaftaran telah dikirim. Status:{' '}
                                    <span className="font-semibold capitalize">{registration.status}</span>.
                                    Data tidak dapat diubah.
                                </div>
                            )}

                            {!isLocked && (
                                <>
                                    <h3 className="mb-6 text-xl font-semibold text-gray-800">Upload Dokumen</h3>

                                    <form onSubmit={handleUpload} className="mb-6 rounded-lg border bg-gray-50 p-4">
                                        <div className="flex flex-wrap items-end gap-4">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700">Jenis Dokumen</label>
                                                <select
                                                    value={documentType}
                                                    onChange={(e) => setDocumentType(e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                >
                                                    <option value="ijazah">Ijazah</option>
                                                    <option value="ktp_ortu">KTP Orang Tua</option>
                                                    <option value="kk">Kartu Keluarga</option>
                                                    <option value="prestasi">Sertifikat Prestasi</option>
                                                    <option value="other">Lainnya</option>
                                                </select>
                                            </div>
                                            <div className="flex-[2]">
                                                <label className="block text-sm font-medium text-gray-700">File (PDF/JPG/PNG, max 5MB)</label>
                                                <input
                                                    type="file"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    onChange={(e) => setFile(e.target.files[0] || null)}
                                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-700 hover:file:bg-green-100"
                                                />
                                            </div>
                <button
                    type="submit"
                    disabled={uploading || !documentType || !file}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-600 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Upload
                </button>
                                        </div>
                                    </form>
                                </>
                            )}

                            <h4 className="mb-4 text-lg font-semibold text-gray-800">Dokumen Terupload</h4>
                            {docs.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Jenis</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">File</th>
                                            {!isLocked && (
                                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Aksi</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {docs.map((doc) => (
                                            <tr key={doc.id}>
                                                <td className="px-4 py-3 text-sm capitalize text-gray-800">{doc.document_type.replace('_', ' ')}</td>
                                                <td className="px-4 py-3 text-sm text-gray-500">{doc.file_path.split('/').pop()}</td>
                                                {!isLocked && (
                                                    <td className="px-4 py-3 text-right">
                                                        <button
                                                            onClick={() => handleDelete(doc.id)}
                                                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 shadow-sm transition hover:bg-red-100 hover:border-red-300"
                                                        >
                                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            Hapus
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center text-sm text-gray-400">Belum ada dokumen yang diupload</p>
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
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}
