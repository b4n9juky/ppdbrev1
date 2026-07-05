import { Head, Link, router } from '@inertiajs/react';
import { FileText, CheckCircle, XCircle, Clock, Users, UserCheck, ArrowRight, Search, RotateCcw, FileSpreadsheet, Download } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Pagination from '@/Components/Pagination';

const statusConfig = {
    draft: { label: 'Draft', bg: 'bg-gray-100 text-gray-700 ring-gray-300' },
    pending: { label: 'Menunggu', bg: 'bg-blue-50 text-blue-700 ring-blue-300' },
    accepted: { label: 'Diterima', bg: 'bg-emerald-50 text-emerald-700 ring-emerald-300' },
    reserve: { label: 'Cadangan', bg: 'bg-amber-50 text-amber-700 ring-amber-300' },
    rejected: { label: 'Ditolak', bg: 'bg-red-50 text-red-700 ring-red-300' },
};

const perPageOptions = [10, 15, 25, 50, 100];

export default function AnnouncementTab({ registrations, paths, stats, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [pathFilter, setPathFilter] = useState(filters.path || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const debounceRef = useRef(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get(route('admin.workspace'), {
                announcement_search: search,
                announcement_path: pathFilter,
                announcement_status: statusFilter,
                announcement_per_page: filters.per_page,
            }, { preserveState: true, preserveScroll: true });
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [search, pathFilter, statusFilter]);

    function handleStatusChange(registration, status) {
        const name = registration.student_biodata?.full_name || registration.user.name;
        const label = statusConfig[status]?.label || status;
        if (confirm(`Ubah status "${name}" menjadi "${label}"?`)) {
            router.patch(route('admin.registrations.status.update', registration.id), { status }, {
                preserveScroll: true,
            });
        }
    }

    function handleReset(registration) {
        const name = registration.student_biodata?.full_name || registration.user.name;
        if (confirm(`Reset pendaftar "${name}"? Pendaftar akan dikembalikan ke antrian operator dengan status menunggu, biodata dan berkas akan tetap tersimpan.`)) {
            router.patch(route('admin.registrations.reset', registration.id), {}, {
                preserveScroll: true,
            });
        }
    }

    function handleCancelSelection(registration) {
        const name = registration.student_biodata?.full_name || registration.user.name;
        if (confirm(`Batalkan seleksi "${name}"? Pendaftar akan kembali ke status menunggu.`)) {
            router.patch(route('admin.registrations.cancel-selection', registration.id), {}, {
                preserveScroll: true,
            });
        }
    }

    function handlePerPage(value) {
        router.get(route('admin.workspace'), {
            ...filters, announcement_per_page: value, page: 1,
        }, { preserveState: true, preserveScroll: true });
    }

    const statCards = [
        { label: 'Total Pendaftar', value: stats.total, icon: Users, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50' },
        { label: 'Diterima', value: stats.accepted, icon: UserCheck, color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50' },
        { label: 'Cadangan', value: stats.reserve, icon: Clock, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50' },
        { label: 'Ditolak', value: stats.rejected, icon: XCircle, color: 'from-red-500 to-rose-600', bg: 'bg-red-50' },
        { label: 'Menunggu', value: stats.pending, icon: CheckCircle, color: 'from-sky-500 to-blue-600', bg: 'bg-sky-50' },
    ];

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {statCards.map((card) => (
                    <div key={card.label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{card.label}</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{card.value}</p>
                            </div>
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}>
                                <card.icon className={`h-5 w-5 bg-gradient-to-br ${card.color} bg-clip-text text-transparent`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quota Monitor per Path */}
            {paths.length > 0 && (
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-3">
                        <h3 className="text-sm font-bold text-gray-900">Monitoring Kuota per Jalur</h3>
                    </div>
                    <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                        {paths.map((path) => {
                            const pct = path.quota > 0 ? Math.round((path.total_registered / path.quota) * 100) : 0;
                            const barColor = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500';
                            return (
                                <div key={path.id} className="rounded-xl border border-gray-100 bg-gray-50/30 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-gray-900">{path.name}</span>
                                        <span className="text-xs font-medium text-gray-500">{path.total_registered}/{path.quota}</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                                        <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} />
                                    </div>
                                    <div className="mt-1 text-right text-[10px] font-medium text-gray-400">
                                        Sisa: {path.available_quota}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                {/* Filter bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-white px-6 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama, NISN..."
                                className="w-60 rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 shadow-sm transition placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                            />
                        </div>
                        <select
                            value={pathFilter}
                            onChange={(e) => setPathFilter(e.target.value)}
                            className="rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-gray-700 shadow-sm transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                        >
                            <option value="">Semua Jalur</option>
                            {paths.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-gray-700 shadow-sm transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                        >
                            <option value="">Semua Status</option>
                            <option value="pending">Menunggu</option>
                            <option value="accepted">Diterima</option>
                            <option value="reserve">Cadangan</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                        <a
                            href={route('admin.registrations.export-accepted', {
                                announcement_search: search,
                                announcement_path: pathFilter,
                                announcement_status: statusFilter,
                            })}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-100 hover:text-emerald-800 focus:ring-2 focus:ring-emerald-100 focus:outline-none active:scale-[0.98]"
                        >
                            <FileSpreadsheet className="h-4 w-4" />
                            Ekspor Excel
                        </a>
                        <a
                            href={route('admin.registrations.download-all-documents')}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-100 hover:text-blue-800 focus:ring-2 focus:ring-blue-100 focus:outline-none active:scale-[0.98]"
                        >
                            <Download className="h-4 w-4" />
                            Download Berkas
                        </a>
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

                {/* Table Body */}
                <div className="overflow-x-auto min-h-[300px]">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead>
                            <tr className="bg-gray-50/80">
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">#</th>
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nama</th>
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">NISN</th>
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Jalur</th>
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Total Nilai</th>
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {registrations.data.map((reg, idx) => {
                                const st = statusConfig[reg.status] || statusConfig.draft;
                                const isPending = reg.status === 'pending';
                                const isReserve = reg.status === 'reserve';
                                const isAccepted = reg.status === 'accepted';
                                const isRejected = reg.status === 'rejected';
                                return (
                                    <tr key={reg.id} className="transition-colors hover:bg-gray-50/50">
                                        <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-400">
                                            {registrations.from + idx}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 text-xs font-semibold text-amber-700">
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
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${st.bg}`}>
                                                {st.label}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {isPending && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusChange(reg, 'accepted')}
                                                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:from-emerald-600 hover:to-green-700 transition-all duration-200 active:scale-[0.98]"
                                                        >
                                                            <UserCheck className="h-3.5 w-3.5" />
                                                            Diterima
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(reg, 'reserve')}
                                                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:from-amber-600 hover:to-orange-600 transition-all duration-200 active:scale-[0.98]"
                                                        >
                                                            <Clock className="h-3.5 w-3.5" />
                                                            Cadangan
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(reg, 'rejected')}
                                                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:from-red-600 hover:to-rose-700 transition-all duration-200 active:scale-[0.98]"
                                                        >
                                                            <XCircle className="h-3.5 w-3.5" />
                                                            Ditolak
                                                        </button>
                                                    </>
                                                )}
                                                {isReserve && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusChange(reg, 'accepted')}
                                                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:from-emerald-600 hover:to-green-700 transition-all duration-200 active:scale-[0.98]"
                                                        >
                                                            <ArrowRight className="h-3.5 w-3.5" />
                                                            Naikkan Utama
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(reg, 'rejected')}
                                                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:from-red-600 hover:to-rose-700 transition-all duration-200 active:scale-[0.98]"
                                                        >
                                                            <XCircle className="h-3.5 w-3.5" />
                                                            Ditolak
                                                        </button>
                                                    </>
                                                )}
                                                {isAccepted && (
                                                    <a
                                                        href={route('admin.print.decision-letter', reg.id)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 shadow-xs transition-all hover:bg-teal-100 hover:shadow-sm active:translate-y-px"
                                                    >
                                                        <FileText className="h-3.5 w-3.5" />
                                                        SK Kelulusan
                                                    </a>
                                                )}
                                                {(isAccepted || isReserve || isRejected) && (
                                                    <>
                                                        <button
                                                            onClick={() => handleCancelSelection(reg)}
                                                            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-xs transition-all hover:bg-gray-100 hover:shadow-sm active:translate-y-px"
                                                        >
                                                            <XCircle className="h-3.5 w-3.5" />
                                                            Batal
                                                        </button>
                                                        <button
                                                            onClick={() => handleReset(reg)}
                                                            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-xs transition-all hover:bg-gray-100 hover:shadow-sm active:translate-y-px"
                                                        >
                                                            <RotateCcw className="h-3.5 w-3.5" />
                                                            Reset
                                                        </button>
                                                    </>
                                                )}
                                                {!isPending && !isReserve && !isAccepted && !isRejected && (
                                                    <span className="text-xs text-gray-400 italic">-</span>
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
                                            <FileText className="h-7 w-7 text-gray-300" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {search || pathFilter || statusFilter ? 'Tidak ada hasil ditemukan' : 'Belum ada pendaftar'}
                                        </p>
                                        {(search || pathFilter || statusFilter) && (
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
                    <Pagination meta={registrations} color="emerald" />
                </div>
            </div>
        </div>
    );
}
