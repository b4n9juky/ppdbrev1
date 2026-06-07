import { Search, Eye, FileText, Users } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import ApplicantDetailDrawer from '@/Components/admin/ApplicantDetailDrawer';

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
    accepted: 'Accepted',
    reserve: 'Reserve',
    rejected: 'Rejected',
};

const processingLabels = {
    baru: 'Pending',
    diproses: 'In Progress',
    selesai: 'Verified',
};

const processingBadge = {
    baru: 'bg-blue-50 text-blue-700 ring-blue-300',
    diproses: 'bg-amber-50 text-amber-700 ring-amber-300',
    selesai: 'bg-emerald-50 text-emerald-700 ring-emerald-300',
};

const perPageOptions = [10, 15, 25, 50, 100];

export default function MonitoringTab({ registrations, operators, filters, activeYear, paths }) {
    const [search, setSearch] = useState(filters.search || '');
    const [pathFilter, setPathFilter] = useState(filters.path || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [processingFilter, setProcessingFilter] = useState(filters.processing || '');
    const [operatorFilter, setOperatorFilter] = useState(filters.operator || '');
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get(route('admin.workspace'), {
                search,
                path: pathFilter,
                status: statusFilter,
                processing: processingFilter,
                operator: operatorFilter,
                per_page: filters.per_page,
            }, { preserveState: true, preserveScroll: true });
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [search, pathFilter, statusFilter, processingFilter, operatorFilter]);

    function handlePerPage(value) {
        router.get(route('admin.workspace'), {
            ...filters, per_page: value, page: 1,
        }, { preserveState: true, preserveScroll: true });
    }

    return (
        <>
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                {/* Filter Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                            onChange={(e) => { setPathFilter(e.target.value); }}
                            className="rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-gray-700 shadow-sm transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                        >
                            <option value="">Semua Jalur</option>
                            {paths.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <select
                            value={processingFilter}
                            onChange={(e) => setProcessingFilter(e.target.value)}
                            className="rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-gray-700 shadow-sm transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                        >
                            <option value="">Verifikasi</option>
                            <option value="baru">Pending</option>
                            <option value="diproses">In Progress</option>
                            <option value="selesai">Verified</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-gray-700 shadow-sm transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                        >
                            <option value="">Status Seleksi</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Passed</option>
                            <option value="reserve">Reserve</option>
                            <option value="rejected">Failed</option>
                        </select>
                        <select
                            value={operatorFilter}
                            onChange={(e) => setOperatorFilter(e.target.value)}
                            className="rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-gray-700 shadow-sm transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                        >
                            <option value="">Semua Operator</option>
                            {operators.map((op) => (
                                <option key={op.id} value={op.id}>{op.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="whitespace-nowrap text-sm text-gray-600">Tampilkan</label>
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
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Name</th>
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Registration Path</th>
                                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Verification</th>
                                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Selection</th>
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Assigned Operator</th>
                                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Registered</th>
                                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {registrations.data.map((reg, idx) => {
                                const st = statusBadge[reg.status] || statusBadge.draft;
                                const ps = processingBadge[reg.processing_status] || processingBadge.baru;
                                return (
                                    <tr key={reg.id} className="transition-colors hover:bg-gray-50/50">
                                        <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-400">
                                            {registrations.from + idx}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-purple-100 text-xs font-semibold text-violet-700">
                                                    {(reg.student_biodata?.full_name || reg.user?.name || '?').charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {reg.student_biodata?.full_name || reg.user?.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                                            {reg.admission_path?.name || '-'}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 text-center">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${ps}`}>
                                                {processingLabels[reg.processing_status] || reg.processing_status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 text-center">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${st}`}>
                                                {statusLabels[reg.status] || reg.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                                            {reg.assigned_operator?.name || '-'}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 text-right text-sm text-gray-400">
                                            {new Date(reg.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 text-center">
                                            <button
                                                onClick={() => setSelectedApplicant(reg)}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {registrations.data.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-16 text-center">
                                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                                            <FileText className="h-7 w-7 text-gray-300" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {search || pathFilter || statusFilter || processingFilter || operatorFilter ? 'Tidak ada hasil ditemukan' : 'Belum ada pendaftar'}
                                        </p>
                                        {(search || pathFilter || statusFilter || processingFilter || operatorFilter) && (
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
                                    return <span key={i} className="px-2 py-2 text-sm text-gray-400">...</span>;
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

            {/* Detail Drawer */}
            <ApplicantDetailDrawer
                applicant={selectedApplicant}
                onClose={() => setSelectedApplicant(null)}
            />
        </>
    );
}
