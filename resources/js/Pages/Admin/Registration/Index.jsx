import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import QuotaMonitor from '@/Components/admin/QuotaMonitor';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

const statusConfig = {
    draft: { label: 'Draft', bg: 'bg-gray-100 text-gray-700 ring-gray-300' },
    pending: { label: 'Menunggu', bg: 'bg-blue-50 text-blue-700 ring-blue-300' },
    accepted: { label: 'Diterima', bg: 'bg-emerald-50 text-emerald-700 ring-emerald-300' },
    reserve: { label: 'Cadangan', bg: 'bg-amber-50 text-amber-700 ring-amber-300' },
    rejected: { label: 'Ditolak', bg: 'bg-red-50 text-red-700 ring-red-300' },
};

const perPageOptions = [10, 15, 25, 50, 100];

export default function Index({ registrations, paths, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const debounceRef = useRef(null);

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
            }, { preserveScroll: true });
        }
    }

    function handleReset(registration) {
        if (confirm(`Reset pendaftar "${registration.student_biodata?.full_name || registration.user.name}"? Semua nilai akan dihapus dan siswa dapat mengupdate data kembali.`)) {
            router.patch(route('admin.registrations.reset', registration.id), {}, {
                preserveScroll: true,
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
                        <div className="overflow-x-auto">
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
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
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
                                                <td className="whitespace-nowrap px-5 py-4 text-right text-sm">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {reg.status === 'pending' && (
                                                            <>
                                                                <button onClick={() => handleStatusChange(reg, 'accepted')} className="rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:shadow-md hover:from-emerald-600 hover:to-green-600">Terima Utama</button>
                                                                <button onClick={() => handleStatusChange(reg, 'reserve')} className="rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:shadow-md hover:from-amber-600 hover:to-yellow-600">Cadangan</button>
                                                                <button onClick={() => handleStatusChange(reg, 'rejected')} className="rounded-lg bg-gradient-to-r from-red-500 to-rose-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:shadow-md hover:from-red-600 hover:to-rose-600">Tolak</button>
                                                            </>
                                                        )}
                                                        {reg.status === 'reserve' && (
                                                            <>
                                                                <button onClick={() => handleStatusChange(reg, 'accepted')} className="rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:shadow-md hover:from-emerald-600 hover:to-green-600">Naikkan</button>
                                                                <button onClick={() => handleStatusChange(reg, 'rejected')} className="rounded-lg bg-gradient-to-r from-red-500 to-rose-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:shadow-md hover:from-red-600 hover:to-rose-600">Tolak</button>
                                                            </>
                                                        )}
                                                        {reg.status === 'draft' && (
                                                            <span className="text-xs text-gray-400">Belum dikirim</span>
                                                        )}
                                                        {(reg.status === 'accepted' || reg.status === 'rejected') && (
                                                            <span className="text-xs text-gray-400">Final</span>
                                                        )}
                                                        {reg.status !== 'draft' && (
                                                            <button onClick={() => handleReset(reg)} className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 shadow-sm transition hover:bg-amber-100 hover:border-amber-300">
                                                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                                Reset
                                                            </button>
                                                        )}
                                                        <Link href={route('admin.registrations.scores.edit', reg.id)} className="inline-flex items-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 shadow-sm transition hover:bg-violet-100 hover:border-violet-300">
                                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                                            Nilai
                                                        </Link>
                                                        <Link href={route('admin.print.registration-proof', reg.id)} className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 shadow-sm transition hover:bg-indigo-100 hover:border-indigo-300" target="_blank">
                                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                                            Cetak
                                                        </Link>
                                                        {reg.status === 'accepted' && (
                                                            <Link href={route('admin.print.decision-letter', reg.id)} className="inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 shadow-sm transition hover:bg-teal-100 hover:border-teal-300" target="_blank">
                                                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                SK Lulus
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {registrations.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-16 text-center">
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
        </AuthenticatedLayout>
    );
}
