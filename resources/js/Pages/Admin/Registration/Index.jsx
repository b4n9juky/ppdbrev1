import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import QuotaMonitor from '@/Components/admin/QuotaMonitor';
import Dropdown from '@/Components/Dropdown';
import Modal from '@/Components/Modal';
import { Head, Link, router, usePage } from '@inertiajs/react';
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
    ijazah: 'Ijazah',
    ktp_ortu: 'KTP Orang Tua',
    kk: 'Kartu Keluarga',
    prestasi: 'Sertifikat Prestasi',
    other: 'Lainnya',
};

const docTypeColors = {
    ijazah: 'bg-blue-50 text-blue-700 ring-blue-200',
    ktp_ortu: 'bg-amber-50 text-amber-700 ring-amber-200',
    kk: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    prestasi: 'bg-violet-50 text-violet-700 ring-violet-200',
    other: 'bg-gray-50 text-gray-600 ring-gray-200',
};

function isImage(filePath) {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
}

export default function Index({ registrations, paths, filters, subjects }) {
    const { auth } = usePage().props;
    const currentUser = auth.user;

    const [search, setSearch] = useState(filters.search || '');
    const [selectedRegForDocs, setSelectedRegForDocs] = useState(null);
    const [selectedRegForActions, setSelectedRegForActions] = useState(null);
    const [selectedRegForScores, setSelectedRegForScores] = useState(null);
    const [scoresData, setScoresData] = useState([]);
    const [isSavingScores, setIsSavingScores] = useState(false);
    const debounceRef = useRef(null);

    useEffect(() => {
        if (selectedRegForScores) {
            const existingScores = {};
            const userScores = selectedRegForScores.subject_scores || selectedRegForScores.subjectScores || [];
            userScores.forEach((s) => {
                existingScores[s.subject_id] = {
                    ijazah_score: s.ijazah_score ?? '',
                    test_score: s.test_score ?? '',
                };
            });
            setScoresData((subjects || []).map((s) => ({
                subject_id: s.id,
                ijazah_score: existingScores[s.id]?.ijazah_score ?? '',
                test_score: existingScores[s.id]?.test_score ?? '',
            })));
        } else {
            setScoresData([]);
        }
    }, [selectedRegForScores, subjects]);

    function handleScoreChange(index, field, value) {
        const updated = [...scoresData];
        updated[index] = { ...updated[index], [field]: value };
        setScoresData(updated);
    }

    function handleSaveScores(e) {
        e.preventDefault();
        setIsSavingScores(true);
        router.patch(route('admin.registrations.scores.update', selectedRegForScores.id), {
            scores: scoresData
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedRegForScores(null);
                setIsSavingScores(false);
            },
            onError: () => {
                setIsSavingScores(false);
            }
        });
    }

    function handleClaim(registration) {
        if (confirm(`Ambil pendaftar "${registration.student_biodata?.full_name || registration.user.name}" untuk diproses?`)) {
            router.post(route('admin.registrations.claim', registration.id), {}, {
                preserveScroll: true,
                onSuccess: () => setSelectedRegForActions(null),
            });
        }
    }

    function handleComplete(registration) {
        if (confirm(`Selesaikan proses verifikasi pendaftar "${registration.student_biodata?.full_name || registration.user.name}"?`)) {
            router.post(route('admin.registrations.complete', registration.id), {}, {
                preserveScroll: true,
                onSuccess: () => setSelectedRegForActions(null),
            });
        }
    }

    function handleRelease(registration) {
        if (confirm(`Lepaskan penugasan pendaftar "${registration.student_biodata?.full_name || registration.user.name}"?`)) {
            router.post(route('admin.registrations.release', registration.id), {}, {
                preserveScroll: true,
                onSuccess: () => setSelectedRegForActions(null),
            });
        }
    }

    // Debounced server-side search
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(route('admin.registrations.index'), {
                    ...filters,
                    search,
                    page: 1,
                }, { preserveState: true, preserveScroll: true });
            }
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [search]);

    function handleSort(field) {
        const direction = filters.sort === field && filters.direction === 'asc' ? 'desc' : 'asc';
        router.get(route('admin.registrations.index'), {
            ...filters,
            sort: field,
            direction,
        }, { preserveState: true });
    }

    function handlePerPage(value) {
        router.get(route('admin.registrations.index'), {
            ...filters,
            per_page: value,
            page: 1,
        }, { preserveState: true, preserveScroll: true });
    }

    function handleStatusChange(registration, status) {
        if (confirm(`Ubah status pendaftar "${registration.student_biodata?.full_name || registration.user.name}" menjadi "${statusConfig[status]?.label}"?`)) {
            router.patch(route('admin.registrations.status.update', registration.id), {
                status,
            }, {
                preserveScroll: true,
                onSuccess: () => setSelectedRegForActions(null),
            });
        }
    }

    function handleReset(registration) {
        if (confirm(`Reset pendaftar "${registration.student_biodata?.full_name || registration.user.name}"? Semua nilai akan dihapus dan siswa dapat mengupdate data kembali.`)) {
            router.patch(route('admin.registrations.reset', registration.id), {}, {
                preserveScroll: true,
                onSuccess: () => setSelectedRegForActions(null),
            });
        }
    }

    const SortIcon = ({ field }) => {
        if (filters.sort !== field) {
            return (
                <svg className="h-3.5 w-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }
        return filters.direction === 'asc' ? (
            <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-200">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Data Pendaftar</h2>
                        <p className="text-sm text-gray-500">Verifikasi dan kelulusan pendaftar</p>
                    </div>
                </div>
            }
        >
            <Head title="Pendaftar" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {paths.length > 0 && (
                        <div className="mb-8">
                            <div className="mb-4">
                                <h3 className="text-base font-semibold text-gray-900">Monitoring Kuota</h3>
                                <p className="text-sm text-gray-500">Status kapasitas jalur pendaftaran</p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {paths.map((path) => (
                                    <QuotaMonitor key={path.id} path={path} />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        {/* Status Filters */}
                        <div className="border-b border-gray-100 bg-white px-6 py-4 flex flex-wrap gap-2">
                            {[
                                { key: 'all', label: 'Semua Data' },
                                { key: 'baru', label: 'Belum Diproses' },
                                { key: 'my_processing', label: 'Sedang Saya Proses' },
                                { key: 'selesai', label: 'Selesai' },
                            ].map((tab) => {
                                const isActive = (filters.processing_status || 'all') === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => {
                                            router.get(route('admin.registrations.index'), {
                                                ...filters,
                                                processing_status: tab.key,
                                                page: 1,
                                            }, { preserveState: true });
                                        }}
                                        className={`rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition-all duration-200 border ${
                                            isActive
                                                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-transparent'
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* DataTable Header — Search + Entries per page */}
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari nama, NISN, jalur..."
                                        className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 shadow-sm transition placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none sm:w-72"
                                    />
                                    {search && (
                                        <button
                                            onClick={() => setSearch('')}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto pb-36 min-h-[300px]">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead>
                                    <tr className="bg-gray-50/80">
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            <button onClick={() => handleSort('created_at')} className="group flex items-center gap-1.5 transition hover:text-gray-700">
                                                Nama
                                                <SortIcon field="created_at" />
                                            </button>
                                        </th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Jalur</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            <button onClick={() => handleSort('total_score')} className="group flex items-center gap-1.5 transition hover:text-gray-700">
                                                Nilai
                                                <SortIcon field="total_score" />
                                            </button>
                                        </th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status Kelulusan</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status Operator</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Operator</th>
                                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {registrations.data.map((reg) => {
                                        const st = statusConfig[reg.status] || statusConfig.draft;
                                        return (
                                            <tr key={reg.id} className="transition-colors hover:bg-gray-50/50">
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-amber-100 text-xs font-semibold text-orange-700">
                                                            {(reg.student_biodata?.full_name || reg.user.name || '?').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {reg.student_biodata?.full_name || reg.user.name}
                                                            </div>
                                                            <div className="text-xs text-gray-400">
                                                                {reg.student_biodata?.nisn || '-'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                                                    {reg.admission_path?.name}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-900">
                                                    {reg.total_score ?? '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${st.bg}`}>
                                                        {st.label}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${(processingStatusConfig[reg.processing_status] || processingStatusConfig.baru).bg}`}>
                                                        {(processingStatusConfig[reg.processing_status] || processingStatusConfig.baru).label}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                                                    {reg.assigned_operator?.name || reg.assigned_operator_id || '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-right text-sm">
                                                    <div className="flex items-center justify-end gap-2 ml-auto">
                                                        {/* ADMIN ACTIONS */}
                                                        {currentUser.role === 'admin' && (
                                                            <div className="flex items-center gap-2">
                                                                {reg.status !== 'draft' && (
                                                                    <button
                                                                        onClick={() => setSelectedRegForDocs(reg)}
                                                                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-100"
                                                                    >
                                                                        Berkas ({reg.student_documents?.length || 0})
                                                                    </button>
                                                                )}
                                                                
                                                                <button
                                                                    onClick={() => setSelectedRegForScores(reg)}
                                                                    className="inline-flex items-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1.5 text-xs font-semibold text-violet-700 shadow-sm transition hover:bg-violet-100"
                                                                >
                                                                    Nilai
                                                                </button>
                                                                
                                                                <button
                                                                    onClick={() => setSelectedRegForActions(reg)}
                                                                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                                                                >
                                                                    Pilihan
                                                                    <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* OPERATOR ACTIONS */}
                                                        {currentUser.role === 'operator' && (
                                                            <div className="flex items-center gap-2">
                                                                {reg.processing_status === 'baru' && (
                                                                    <button 
                                                                        onClick={() => handleClaim(reg)} 
                                                                        disabled={reg.status === 'draft'}
                                                                        className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
                                                                    >
                                                                        Ambil
                                                                    </button>
                                                                )}

                                                                {reg.processing_status === 'diproses' && reg.assigned_operator_id === currentUser.id && (
                                                                    <>
                                                                        <button
                                                                            onClick={() => setSelectedRegForScores(reg)}
                                                                            className="inline-flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                                                                        >
                                                                            Lanjutkan
                                                                        </button>
                                                                        
                                                                        <button
                                                                            onClick={() => setSelectedRegForDocs(reg)}
                                                                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-100"
                                                                        >
                                                                            Berkas ({reg.student_documents?.length || 0})
                                                                        </button>
                                                                        
                                                                        <button
                                                                            onClick={() => setSelectedRegForActions(reg)}
                                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                                                                        >
                                                                            Aksi
                                                                            <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                                                        </button>
                                                                    </>
                                                                )}

                                                                {reg.processing_status === 'diproses' && reg.assigned_operator_id !== currentUser.id && (
                                                                    <span className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
                                                                        Sedang diproses operator lain
                                                                    </span>
                                                                )}

                                                                {reg.processing_status === 'selesai' && (
                                                                    <>
                                                                        <button onClick={() => setSelectedRegForDocs(reg)} className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
                                                                            Lihat
                                                                        </button>
                                                                        {reg.status !== 'draft' && (
                                                                            <button
                                                                                onClick={() => setSelectedRegForActions(reg)}
                                                                                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                                                                            >
                                                                                Pilihan
                                                                                <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                                                            </button>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {registrations.data.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-16 text-center">
                                                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                                                    <svg className="h-7 w-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {search ? 'Tidak ada hasil ditemukan' : 'Belum ada pendaftar'}
                                                </p>
                                                {search && (
                                                    <p className="mt-1 text-xs text-gray-400">
                                                        Coba ubah kata kunci pencarian Anda
                                                    </p>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* DataTable Footer — Info + Pagination */}
                        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 bg-gray-50/30 px-6 py-4 sm:flex-row">
                            <div className="text-sm text-gray-500">
                                {registrations.total > 0 ? (
                                    <>
                                        Menampilkan <span className="font-medium text-gray-700">{registrations.from}</span> sampai{' '}
                                        <span className="font-medium text-gray-700">{registrations.to}</span> dari{' '}
                                        <span className="font-medium text-gray-700">{registrations.total}</span> entri
                                    </>
                                ) : (
                                    'Tidak ada data'
                                )}
                            </div>
                            {registrations.last_page > 1 && (
                                <div className="flex items-center gap-1">
                                    {/* Previous */}
                                    {registrations.current_page > 1 ? (
                                        <Link
                                            href={registrations.prev_page_url}
                                            preserveState
                                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
                                        >
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

                                    {/* Page numbers */}
                                    {registrations.links.slice(1, -1).map((link, i) => {
                                        if (link.label === '...') {
                                            return (
                                                <span key={i} className="px-2 py-2 text-sm text-gray-400">
                                                    ⋯
                                                </span>
                                            );
                                        }
                                        return link.active ? (
                                            <span
                                                key={i}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 text-sm font-semibold text-white shadow-sm"
                                            >
                                                {link.label}
                                            </span>
                                        ) : (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                preserveState
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300"
                                            >
                                                {link.label}
                                            </Link>
                                        );
                                    })}

                                    {/* Next */}
                                    {registrations.current_page < registrations.last_page ? (
                                        <Link
                                            href={registrations.next_page_url}
                                            preserveState
                                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
                                        >
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
            {/* Modal for viewing documents */}
            {selectedRegForDocs && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-gray-900">
                                    Dokumen Siswa: {selectedRegForDocs.student_biodata?.full_name || selectedRegForDocs.user.name}
                                </h3>
                                <p className="text-xs text-gray-400">NISN: {selectedRegForDocs.student_biodata?.nisn || '-'}</p>
                            </div>
                            <button
                                onClick={() => setSelectedRegForDocs(null)}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            >
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
                                        const fileName = doc.file_path.split('/').pop();
                                        const fileIsImage = isImage(doc.file_path);

                                        return (
                                            <div key={doc.id} className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
                                                <div className="relative h-28 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                                                    {fileIsImage ? (
                                                        <img
                                                            src={`/storage/${doc.file_path}`}
                                                            alt={typeLabel}
                                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
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
                                                            Lihat Berkas
                                                        </span>
                                                    </a>
                                                </div>
                                                <div className="p-3">
                                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${typeColor}`}>
                                                        {typeLabel}
                                                    </span>
                                                    <p className="mt-1.5 truncate text-xs text-gray-400" title={fileName}>
                                                        {fileName}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">Siswa belum mengunggah dokumen apapun.</p>
                                </div>
                            )}
                        </div>
                        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 flex justify-end">
                            <button
                                onClick={() => setSelectedRegForDocs(null)}
                                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for registration actions */}
            <Modal show={!!selectedRegForActions} onClose={() => setSelectedRegForActions(null)} maxWidth="2xl">
                {selectedRegForActions && (
                    <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
                        {/* Header */}
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-gray-900">
                                    Pilihan Aksi Pendaftaran
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Pilih tindakan verifikasi & kelulusan untuk siswa ini
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedRegForActions(null)}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Info Card */}
                        <div className="px-6 pt-4 pb-2">
                            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-amber-100 text-xs font-semibold text-orange-700">
                                            {(selectedRegForActions.student_biodata?.full_name || selectedRegForActions.user.name || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">
                                                {selectedRegForActions.student_biodata?.full_name || selectedRegForActions.user.name}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                                                <span>NISN: {selectedRegForActions.student_biodata?.nisn || '-'}</span>
                                                <span>•</span>
                                                <span>{selectedRegForActions.admission_path?.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${(statusConfig[selectedRegForActions.status] || statusConfig.draft).bg}`}>
                                            {(statusConfig[selectedRegForActions.status] || statusConfig.draft).label}
                                        </span>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${(processingStatusConfig[selectedRegForActions.processing_status] || processingStatusConfig.baru).bg}`}>
                                            {(processingStatusConfig[selectedRegForActions.processing_status] || processingStatusConfig.baru).label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions content */}
                        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
                            {/* 1. KELULUSAN ACTIONS */}
                            {((currentUser.role === 'admin' && selectedRegForActions.status !== 'draft') || 
                              (currentUser.role === 'operator' && 
                               selectedRegForActions.assigned_operator_id === currentUser.id && 
                               selectedRegForActions.processing_status === 'selesai')) && (
                                <div className="space-y-3">
                                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">Ubah Status Kelulusan</h5>
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        {/* Terima Utama / Naikkan */}
                                        {(selectedRegForActions.status === 'pending' || selectedRegForActions.status === 'reserve') && (
                                            <button
                                                onClick={() => handleStatusChange(selectedRegForActions, 'accepted')}
                                                className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 px-4 py-3 text-center text-white shadow-sm hover:from-emerald-600 hover:to-green-700 transition-all duration-200 active:scale-[0.98]"
                                            >
                                                <svg className="mb-1 h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-xs font-bold">
                                                    {selectedRegForActions.status === 'reserve' ? 'Naikkan Utama' : 'Diterima Utama'}
                                                </span>
                                            </button>
                                        )}

                                        {/* Cadangan */}
                                        {selectedRegForActions.status === 'pending' && (
                                            <button
                                                onClick={() => handleStatusChange(selectedRegForActions, 'reserve')}
                                                className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 px-4 py-3 text-center text-white shadow-sm hover:from-amber-600 hover:to-orange-600 transition-all duration-200 active:scale-[0.98]"
                                            >
                                                <svg className="mb-1 h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                <span className="text-xs font-bold">Cadangan</span>
                                            </button>
                                        )}

                                        {/* Tolak */}
                                        {(selectedRegForActions.status === 'pending' || selectedRegForActions.status === 'reserve') && (
                                            <button
                                                onClick={() => handleStatusChange(selectedRegForActions, 'rejected')}
                                                className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 px-4 py-3 text-center text-white shadow-sm hover:from-red-600 hover:to-rose-700 transition-all duration-200 active:scale-[0.98]"
                                            >
                                                <svg className="mb-1 h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-xs font-bold">Ditolak</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* 2. OPERATOR PROCESS ACTIONS */}
                            {((currentUser.role === 'operator' && selectedRegForActions.processing_status === 'diproses' && selectedRegForActions.assigned_operator_id === currentUser.id) ||
                              (currentUser.role === 'admin' && selectedRegForActions.assigned_operator_id !== null)) && (
                                <div className="space-y-3">
                                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">Proses Verifikasi</h5>
                                    <div className="flex flex-wrap gap-3">
                                        {currentUser.role === 'operator' && selectedRegForActions.processing_status === 'diproses' && (
                                            <button
                                                onClick={() => handleComplete(selectedRegForActions)}
                                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:from-blue-600 hover:to-indigo-700 transition duration-200"
                                            >
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                Selesaikan Verifikasi
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleRelease(selectedRegForActions)}
                                            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition duration-200"
                                        >
                                            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {currentUser.role === 'admin' ? 'Hapus Proses Operator' : 'Lepaskan Penugasan'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* 3. DOKUMEN & BUKTI */}
                            {selectedRegForActions.status !== 'draft' && (
                                <div className="space-y-3">
                                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">Dokumen & Cetak</h5>
                                    <div className="flex flex-wrap gap-3">
                                        <a
                                            href={route('admin.print.registration-proof', selectedRegForActions.id)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-xs font-semibold text-violet-700 shadow-sm hover:bg-violet-100 transition duration-200"
                                        >
                                            <svg className="h-4 w-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                            </svg>
                                            Cetak Bukti Pendaftaran
                                        </a>
                                        
                                        {selectedRegForActions.status === 'accepted' && (
                                            <a
                                                href={route('admin.print.decision-letter', selectedRegForActions.id)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-xs font-semibold text-teal-700 shadow-sm hover:bg-teal-100 transition duration-200"
                                            >
                                                <svg className="h-4 w-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Unduh SK Kelulusan
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* 4. UTILITY (RESET) */}
                            {selectedRegForActions.status !== 'draft' && 
                             ((currentUser.role === 'admin') || 
                              (currentUser.role === 'operator' && selectedRegForActions.assigned_operator_id === currentUser.id)) && (
                                <div className="space-y-3 border-t border-gray-100 pt-6">
                                    <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div>
                                                <h6 className="text-sm font-bold text-red-950">Reset Data & Status Pendaftaran</h6>
                                                <p className="text-xs text-red-700 mt-0.5">
                                                    Tindakan ini akan mengosongkan status kelulusan, nilai verifikasi, dan mengizinkan siswa mengedit kembali berkasnya.
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleReset(selectedRegForActions)}
                                                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-100 px-4 py-2.5 text-xs font-bold text-red-700 shadow-sm transition hover:bg-red-200 active:scale-[0.98]"
                                            >
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
                                                </svg>
                                                Reset Pendaftar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 flex justify-end">
                            <button
                                onClick={() => setSelectedRegForActions(null)}
                                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal for selection scores */}
            <Modal show={!!selectedRegForScores} onClose={() => setSelectedRegForScores(null)} maxWidth="3xl">
                {selectedRegForScores && (
                    <form onSubmit={handleSaveScores} className="overflow-hidden rounded-2xl bg-white shadow-xl">
                        {/* Header */}
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Input Nilai Seleksi
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Siswa: {selectedRegForScores.student_biodata?.full_name || selectedRegForScores.user.name} — Jalur: {selectedRegForScores.admission_path?.name}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedRegForScores(null)}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Scores Table */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {!subjects || subjects.length === 0 ? (
                                <div className="rounded-xl bg-gray-50 py-10 text-center text-sm text-gray-400">
                                    Belum ada mata pelajaran yang tersedia untuk tahun ajaran ini.
                                </div>
                            ) : (
                                <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-gray-50/50">
                                            <tr>
                                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Mata Pelajaran</th>
                                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nilai Ijazah</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {scoresData.map((score, index) => {
                                                const subject = (subjects || []).find((s) => s.id === score.subject_id);
                                                return (
                                                    <tr key={score.subject_id} className="transition-colors hover:bg-gray-50/50">
                                                        <td className="px-5 py-3 text-sm font-medium text-gray-900">
                                                            <div className="flex items-center gap-2">
                                                                <span>{subject?.name || `Mapel #${score.subject_id}`}</span>
                                                                {subject && (
                                                                    subject.is_active ? (
                                                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                                            Aktif
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                                            Nonaktif
                                                                        </span>
                                                                    )
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-3">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                max="100"
                                                                value={score.ijazah_score}
                                                                onChange={(e) => handleScoreChange(index, 'ijazah_score', e.target.value)}
                                                                className="block w-28 rounded-lg border border-gray-200 bg-white py-1.5 px-3 text-sm font-medium text-gray-700 shadow-sm transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                                                                placeholder="0-100"
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setSelectedRegForScores(null)}
                                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            {subjects && subjects.length > 0 && (
                                <button
                                    type="submit"
                                    disabled={isSavingScores}
                                    className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-emerald-100 hover:from-emerald-600 hover:to-green-700 hover:shadow-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSavingScores ? 'Menyimpan...' : 'Simpan Nilai'}
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
