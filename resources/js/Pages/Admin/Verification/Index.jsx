import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { FileText, User, X, CheckCircle, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const statusConfig = {
    draft: { label: 'Draft', bg: 'bg-gray-100 text-gray-700 ring-gray-300' },
    pending: { label: 'Menunggu', bg: 'bg-blue-50 text-blue-700 ring-blue-300' },
    accepted: { label: 'Diterima', bg: 'bg-emerald-50 text-emerald-700 ring-emerald-300' },
    reserve: { label: 'Cadangan', bg: 'bg-amber-50 text-amber-700 ring-amber-300' },
    rejected: { label: 'Ditolak', bg: 'bg-red-50 text-red-700 ring-red-300' },
};

const processingStatusConfig = {
    baru: { label: 'Baru', bg: 'bg-gray-100 text-gray-700 ring-gray-300' },
    diproses: { label: 'Diproses', bg: 'bg-amber-100 text-amber-700 ring-amber-300' },
    selesai: { label: 'Selesai', bg: 'bg-emerald-100 text-emerald-800 ring-emerald-300' },
};

const perPageOptions = [10, 15, 25, 50, 100];

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

function isImage(filePath) {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
}

export default function Index({ registrations, paths, filters }) {
    const { auth } = usePage().props;
    const currentUser = auth.user;

    const [search, setSearch] = useState(filters.search || '');
    const [pathFilter, setPathFilter] = useState(filters.path || '');
    const [selectedRegForDocs, setSelectedRegForDocs] = useState(null);
    const [selectedRegForBiodata, setSelectedRegForBiodata] = useState(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            const params = { ...filters, search, path: pathFilter, page: 1 };
            if (search === (filters.search || '') && pathFilter === (filters.path || '')) return;
            router.get(route('admin.verification.index'), params, { preserveState: true, preserveScroll: true });
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [search, pathFilter]);

    function handlePathChange(value) {
        setPathFilter(value);
    }

    function handlePerPage(value) {
        router.get(route('admin.verification.index'), {
            ...filters, per_page: value, page: 1,
        }, { preserveState: true, preserveScroll: true });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200">
                        <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Verifikasi Pendaftar</h2>
                        <p className="text-sm text-gray-500">Riwayat verifikasi pendaftar yang telah selesai diproses operator</p>
                    </div>
                </div>
            }
        >
            <Head title="Verifikasi" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        {/* Filter bar */}
                        <div className="border-b border-gray-100 bg-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari nama, NISN..."
                                        className="rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 shadow-sm transition placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none w-60"
                                    />
                                </div>
                                <select
                                    value={pathFilter}
                                    onChange={(e) => handlePathChange(e.target.value)}
                                    className="rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-gray-700 shadow-sm transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                                >
                                    <option value="">Semua Jalur</option>
                                    {paths.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-sm text-gray-600 whitespace-nowrap">Tampilkan</label>
                                <select
                                    value={filters.per_page || 15}
                                    onChange={(e) => handlePerPage(e.target.value)}
                                    className="rounded-lg border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-sm font-medium text-gray-700 shadow-sm transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                                >
                                    {perPageOptions.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <span className="text-sm text-gray-600">entri</span>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto min-h-[300px]">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead>
                                    <tr className="bg-gray-50/80">
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">#</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nama</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">NISN</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Jalur</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Total Nilai</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Dokumen</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status Verifikasi</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status Kelulusan</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Operator</th>
                                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {registrations.data.map((reg, idx) => {
                                        const st = statusConfig[reg.status] || statusConfig.draft;
                                        return (
                                            <tr key={reg.id} className="transition-colors hover:bg-gray-50/50">
                                                <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-400">
                                                    {registrations.from + idx}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 text-xs font-semibold text-emerald-700">
                                                            {(reg.student_biodata?.full_name || reg.user.name || '?').charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {reg.student_biodata?.full_name || reg.user.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                                                    {reg.student_biodata?.nisn || '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                                                    {reg.admission_path?.name}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-900">
                                                    {reg.total_score ?? '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
                                                        <FileText className="h-3 w-3" />
                                                        {reg.student_documents?.length || 0}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${(processingStatusConfig[reg.processing_status] || processingStatusConfig.baru).bg}`}>
                                                        {(processingStatusConfig[reg.processing_status] || processingStatusConfig.baru).label}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${st.bg}`}>
                                                        {st.label}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                                                    {reg.assigned_operator?.name || '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setSelectedRegForBiodata(reg)}
                                                            className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 shadow-xs transition-all hover:bg-sky-100 hover:shadow-sm active:translate-y-px"
                                                        >
                                                            <User className="h-3.5 w-3.5" />
                                                            Biodata
                                                        </button>
                                                        <button
                                                            onClick={() => setSelectedRegForDocs(reg)}
                                                            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-xs transition-all hover:bg-emerald-100 hover:shadow-sm active:translate-y-px"
                                                        >
                                                            <FileText className="h-3.5 w-3.5" />
                                                            Dokumen
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {registrations.data.length === 0 && (
                                        <tr>
                                            <td colSpan={10} className="px-6 py-16 text-center">
                                                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                                                    <CheckCircle className="h-7 w-7 text-gray-300" />
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {search || pathFilter ? 'Tidak ada hasil ditemukan' : 'Belum ada pendaftar yang selesai diverifikasi'}
                                                </p>
                                                {(search || pathFilter) && (
                                                    <p className="mt-1 text-xs text-gray-400">Coba ubah kata kunci atau filter Anda</p>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 bg-gray-50/30 px-6 py-4 sm:flex-row">
                            <div className="text-sm text-gray-500">
                                {registrations.total > 0 ? (
                                    <>Menampilkan <span className="font-medium text-gray-700">{registrations.from}</span> sampai{' '}
                                    <span className="font-medium text-gray-700">{registrations.to}</span> dari{' '}
                                    <span className="font-medium text-gray-700">{registrations.total}</span> entri</>
                                ) : 'Tidak ada data'}
                            </div>
                            {registrations.last_page > 1 && (
                                <div className="flex items-center gap-1">
                                    {registrations.current_page > 1 ? (
                                        <Link href={registrations.prev_page_url} preserveState
                                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                            </svg>
                                            Prev
                                        </Link>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-300 cursor-not-allowed">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                            </svg>
                                            Prev
                                        </span>
                                    )}
                                    {registrations.links.slice(1, -1).map((link, i) => {
                                        if (link.label === '...') {
                                            return <span key={i} className="px-2 py-2 text-sm text-gray-400">⋯</span>;
                                        }
                                        return link.active ? (
                                            <span key={i} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 text-sm font-semibold text-white shadow-sm">{link.label}</span>
                                        ) : (
                                            <Link key={i} href={link.url} preserveState className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900">{link.label}</Link>
                                        );
                                    })}
                                    {registrations.current_page < registrations.last_page ? (
                                        <Link href={registrations.next_page_url} preserveState
                                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900">
                                            Next
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-300 cursor-not-allowed">
                                            Next
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Biodata */}
            {selectedRegForBiodata && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedRegForBiodata(null)}>
                    <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="border-b border-gray-100 bg-gradient-to-r from-sky-50 to-blue-50 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 shadow-sm shadow-sky-200">
                                    <User className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">Biodata Pendaftar</h3>
                                    <p className="text-xs text-gray-500">Data diri calon peserta didik</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedRegForBiodata(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-white/60 hover:text-gray-600 transition">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="p-6 max-h-[65vh] overflow-y-auto">
                            {(() => {
                                const bio = selectedRegForBiodata.student_biodata;
                                if (!bio) {
                                    return (
                                        <div className="text-center py-12">
                                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
                                                <User className="h-6 w-6" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-500">Siswa belum melengkapi biodata.</p>
                                        </div>
                                    );
                                }
                                const items = [
                                    { label: 'NISN', value: bio.nisn },
                                    { label: 'Nama Lengkap', value: bio.full_name },
                                    { label: 'Jenis Kelamin', value: bio.gender === 'male' ? 'Laki-laki' : bio.gender === 'female' ? 'Perempuan' : bio.gender },
                                    { label: 'Tempat Lahir', value: bio.birth_place },
                                    { label: 'Tanggal Lahir', value: bio.birth_date },
                                    { label: 'No. Telepon', value: bio.phone_number },
                                    { label: 'Asal Sekolah', value: bio.previous_school },
                                    { label: 'Alamat', value: bio.address },
                                ];
                                return (
                                    <div className="divide-y divide-gray-50">
                                        {items.map((item, i) => (
                                            <div key={i} className="flex items-start gap-4 py-3">
                                                <span className="min-w-[120px] text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.label}</span>
                                                <span className="text-sm font-medium text-gray-900 break-words">{item.value || '-'}</span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 flex justify-end">
                            <button onClick={() => setSelectedRegForBiodata(null)} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">Tutup</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Dokumen */}
            {selectedRegForDocs && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-gray-900">
                                    Dokumen: {selectedRegForDocs.student_biodata?.full_name || selectedRegForDocs.user.name}
                                </h3>
                                <p className="text-xs text-gray-400">NISN: {selectedRegForDocs.student_biodata?.nisn || '-'}</p>
                            </div>
                            <button onClick={() => setSelectedRegForDocs(null)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {(selectedRegForDocs.student_documents || []).length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {(selectedRegForDocs.student_documents || []).map((doc) => {
                                        const typeColor = docTypeColors[doc.document_type] || docTypeColors.other;
                                        const typeLabel = docTypeLabels[doc.document_type] || doc.document_type.replace('_', ' ');
                                        return (
                                            <div key={doc.id} className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
                                                <div className="relative h-28 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                                                    {isImage(doc.file_path) ? (
                                                        <img src={`/storage/${doc.file_path}`} alt={typeLabel} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-1">
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                                                                <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                            <span className="text-[10px] font-semibold text-gray-500">PDF</span>
                                                        </div>
                                                    )}
                                                    <a href={`/storage/${doc.file_path}`} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/30">
                                                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm opacity-0 transition-all group-hover:opacity-100 backdrop-blur-sm">
                                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            Lihat Berkas
                                                        </span>
                                                    </a>
                                                </div>
                                                <div className="p-3">
                                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${typeColor}`}>{typeLabel}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">Belum ada dokumen.</p>
                                </div>
                            )}
                        </div>
                        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 flex justify-end">
                            <button onClick={() => setSelectedRegForDocs(null)} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">Tutup</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
