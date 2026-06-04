import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Dropdown from '@/Components/Dropdown';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';

const statusConfig = {
    draft: { label: 'Draft', bg: 'bg-gray-100 text-gray-700 ring-gray-300' },
    pending: { label: 'Menunggu', bg: 'bg-blue-50 text-blue-700 ring-blue-300' },
    accepted: { label: 'Diterima', bg: 'bg-emerald-50 text-emerald-700 ring-emerald-300' },
    reserve: { label: 'Cadangan', bg: 'bg-amber-50 text-amber-700 ring-amber-300' },
    rejected: { label: 'Ditolak', bg: 'bg-red-50 text-red-700 ring-red-300' },
};

const pathGradients = [
    'from-emerald-600 to-green-600',
    'from-violet-500 to-purple-600',
    'from-blue-500 to-indigo-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-cyan-500 to-teal-600',
];

const perPageOptions = [10, 15, 25, 50, 100];

export default function ByPath({ paths }) {
    const { auth } = usePage().props;
    const currentUser = auth.user;

    // Per-path table state: search, perPage, currentPage, sortField, sortDir
    const [tableState, setTableState] = useState(() => {
        const state = {};
        paths.forEach((p) => {
            state[p.id] = { search: '', perPage: 10, currentPage: 1, sortField: null, sortDir: 'asc' };
        });
        return state;
    });

    function updatePathState(pathId, updates) {
        setTableState((prev) => ({
            ...prev,
            [pathId]: { ...prev[pathId], ...updates },
        }));
    }

    function handleStatusChange(registration, status) {
        const name = registration.student_biodata?.full_name || registration.user.name;
        if (confirm(`Ubah status "${name}" menjadi "${statusConfig[status]?.label}"?`)) {
            router.patch(route('admin.registrations.status.update', registration.id), { status }, { preserveScroll: true });
        }
    }

    function handleReset(registration) {
        const name = registration.student_biodata?.full_name || registration.user.name;
        if (confirm(`Reset "${name}"? Semua nilai akan dihapus.`)) {
            router.patch(route('admin.registrations.reset', registration.id), {}, { preserveScroll: true });
        }
    }

    function renderActions(reg) {
        return (
            <div className="flex items-center justify-end gap-1.5">
                <Link
                    href={route('admin.registrations.scores.edit', reg.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 shadow-sm transition hover:bg-violet-100 hover:border-violet-300"
                >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Nilai
                </Link>
                <Link
                    href={route('admin.print.registration-proof', reg.id)}
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 shadow-sm transition hover:bg-indigo-100 hover:border-indigo-300"
                >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Cetak
                </Link>
                {reg.status === 'accepted' && (
                    <Link
                        href={route('admin.print.decision-letter', reg.id)}
                        target="_blank"
                        className="inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 shadow-sm transition hover:bg-teal-100 hover:border-teal-300"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        SK
                    </Link>
                )}
                {reg.status !== 'draft' && (
                    (() => {
                        const canChangeStatus = currentUser.role === 'admin' || 
                            (currentUser.role === 'operator' && reg.assigned_operator_id === currentUser.id && reg.processing_status === 'selesai');
                        const canReset = currentUser.role === 'admin' ||
                            (currentUser.role === 'operator' && reg.assigned_operator_id === currentUser.id);

                        if (!canChangeStatus && !canReset) return null;

                        return (
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition hover:bg-gray-100 hover:border-gray-300">
                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                            </svg>
                                            Aksi
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        {canChangeStatus && reg.status === 'pending' && (
                                            <>
                                                <Dropdown.Button onClick={() => handleStatusChange(reg, 'accepted')}>Terima Utama</Dropdown.Button>
                                                <Dropdown.Button onClick={() => handleStatusChange(reg, 'reserve')}>Cadangan</Dropdown.Button>
                                                <Dropdown.Button onClick={() => handleStatusChange(reg, 'rejected')}>Tolak</Dropdown.Button>
                                            </>
                                        )}
                                        {canChangeStatus && reg.status === 'reserve' && (
                                            <>
                                                <Dropdown.Button onClick={() => handleStatusChange(reg, 'accepted')}>Naikkan</Dropdown.Button>
                                                <Dropdown.Button onClick={() => handleStatusChange(reg, 'rejected')}>Tolak</Dropdown.Button>
                                            </>
                                        )}
                                        {canReset && reg.status !== 'draft' && (
                                            <>
                                                {canChangeStatus && <div className="border-t border-gray-100" />}
                                                <Dropdown.Button onClick={() => handleReset(reg)}>Reset ke Draft</Dropdown.Button>
                                            </>
                                        )}
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        );
                    })()
                )}
            </div>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-200">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Pendaftar Per Jalur</h2>
                        <p className="text-sm text-gray-500">Lihat pendaftar yang dikelompokkan berdasarkan jalur pendaftaran</p>
                    </div>
                </div>
            }
        >
            <Head title="Pendaftar Per Jalur" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {paths.length === 0 ? (
                        <div className="rounded-2xl border border-gray-100 bg-white p-16 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <p className="text-lg font-medium text-gray-900">Belum Ada Jalur Aktif</p>
                            <p className="mt-1 text-sm text-gray-500">Aktifkan jalur pendaftaran terlebih dahulu.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {paths.map((path, idx) => {
                                const gradient = pathGradients[idx % pathGradients.length];
                                const pct = path.quota > 0 ? Math.round(((path.quota - path.available_quota) / path.quota) * 100) : 0;

                                return (
                                    <PathTable
                                        key={path.id}
                                        path={path}
                                        gradient={gradient}
                                        pct={pct}
                                        state={tableState[path.id]}
                                        onUpdateState={(updates) => updatePathState(path.id, updates)}
                                        renderActions={renderActions}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function PathTable({ path, gradient, pct, state, onUpdateState, renderActions }) {
    const { search, perPage, currentPage, sortField, sortDir } = state;

    // Client-side filter + sort + paginate
    const filtered = useMemo(() => {
        let data = [...path.registrations];

        // Search
        if (search) {
            const q = search.toLowerCase();
            data = data.filter((reg) => {
                const name = (reg.student_biodata?.full_name || reg.user?.name || '').toLowerCase();
                const nisn = (reg.student_biodata?.nisn || '').toLowerCase();
                const status = (statusConfig[reg.status]?.label || reg.status || '').toLowerCase();
                return name.includes(q) || nisn.includes(q) || status.includes(q);
            });
        }

        // Sort
        if (sortField) {
            data.sort((a, b) => {
                let va, vb;
                if (sortField === 'name') {
                    va = (a.student_biodata?.full_name || a.user?.name || '').toLowerCase();
                    vb = (b.student_biodata?.full_name || b.user?.name || '').toLowerCase();
                } else if (sortField === 'total_score') {
                    va = a.total_score ?? -Infinity;
                    vb = b.total_score ?? -Infinity;
                } else if (sortField === 'status') {
                    va = a.status || '';
                    vb = b.status || '';
                }
                if (va < vb) return sortDir === 'asc' ? -1 : 1;
                if (va > vb) return sortDir === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return data;
    }, [path.registrations, search, sortField, sortDir]);

    const totalFiltered = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / perPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIdx = (safeCurrentPage - 1) * perPage;
    const paged = filtered.slice(startIdx, startIdx + perPage);
    const from = totalFiltered > 0 ? startIdx + 1 : 0;
    const to = Math.min(startIdx + perPage, totalFiltered);

    function handleSort(field) {
        if (sortField === field) {
            onUpdateState({ sortDir: sortDir === 'asc' ? 'desc' : 'asc' });
        } else {
            onUpdateState({ sortField: field, sortDir: 'asc' });
        }
    }

    function goToPage(p) {
        onUpdateState({ currentPage: Math.max(1, Math.min(p, totalPages)) });
    }

    // Generate visible page numbers
    function getPageNumbers() {
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, safeCurrentPage - Math.floor(maxVisible / 2));
        let endPage = startPage + maxVisible - 1;
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) pages.push('...');
        }
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    }

    const SortIcon = ({ field }) => {
        if (sortField !== field) {
            return (
                <svg className="h-3.5 w-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }
        return sortDir === 'asc' ? (
            <svg className="h-3.5 w-3.5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="h-3.5 w-3.5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            {/* Path header */}
            <div className={`bg-gradient-to-r ${gradient} px-6 py-5`}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">{path.name}</h3>
                            {path.description && (
                                <p className="text-sm text-white/80">{path.description}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {path.quota - path.available_quota} / {path.quota} Terisi
                        </span>
                        <span className="text-xs text-white/70">
                            Sisa kuota: {path.available_quota}
                        </span>
                    </div>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/30">
                    <div
                        className="h-full rounded-full bg-white transition-all duration-500"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                </div>
            </div>

            {path.registrations.length === 0 ? (
                <div className="flex flex-col items-center px-6 py-12 text-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                        <svg className="h-7 w-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-900">Belum Ada Pendaftar</p>
                    <p className="mt-1 text-xs text-gray-400">Belum ada pendaftar untuk jalur ini.</p>
                </div>
            ) : (
                <>
                    {/* DataTable controls */}
                    <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <label className="text-sm text-gray-600 whitespace-nowrap">Tampilkan</label>
                                <select
                                    value={perPage}
                                    onChange={(e) => onUpdateState({ perPage: Number(e.target.value), currentPage: 1 })}
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
                                    onChange={(e) => onUpdateState({ search: e.target.value, currentPage: 1 })}
                                    placeholder="Cari nama, NISN, status..."
                                    className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 shadow-sm transition placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none sm:w-64"
                                />
                                {search && (
                                    <button
                                        onClick={() => onUpdateState({ search: '', currentPage: 1 })}
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
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        <button onClick={() => handleSort('name')} className="group flex items-center gap-1.5 transition hover:text-gray-700">
                                            Nama
                                            <SortIcon field="name" />
                                        </button>
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">NISN</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        <button onClick={() => handleSort('total_score')} className="group flex items-center gap-1.5 transition hover:text-gray-700">
                                            Nilai
                                            <SortIcon field="total_score" />
                                        </button>
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        <button onClick={() => handleSort('status')} className="group flex items-center gap-1.5 transition hover:text-gray-700">
                                            Status
                                            <SortIcon field="status" />
                                        </button>
                                    </th>
                                    <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paged.map((reg) => {
                                    const st = statusConfig[reg.status] || statusConfig.draft;
                                    const initial = (reg.student_biodata?.full_name || reg.user?.name || '?').charAt(0).toUpperCase();

                                    return (
                                        <tr key={reg.id} className="transition-colors hover:bg-gray-50/50">
                                            <td className="whitespace-nowrap px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-50 text-xs font-semibold text-gray-600 ring-2 ring-white shadow-sm">
                                                        {initial}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {reg.student_biodata?.full_name || reg.user?.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-500">
                                                {reg.student_biodata?.nisn || '-'}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-3.5">
                                                {reg.total_score !== null ? (
                                                    <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                        {reg.total_score}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-3.5">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${st.bg}`}>
                                                    {st.label}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-3.5 text-right text-sm">
                                                {renderActions(reg)}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {paged.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <p className="text-sm font-medium text-gray-900">Tidak ada hasil ditemukan</p>
                                            <p className="mt-1 text-xs text-gray-400">Coba ubah kata kunci pencarian</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* DataTable footer */}
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/30 px-6 py-3 sm:flex-row">
                        <div className="text-sm text-gray-500">
                            {totalFiltered > 0 ? (
                                <>
                                    Menampilkan <span className="font-medium text-gray-700">{from}</span> sampai{' '}
                                    <span className="font-medium text-gray-700">{to}</span> dari{' '}
                                    <span className="font-medium text-gray-700">{totalFiltered}</span> entri
                                    {search && (
                                        <span className="text-gray-400"> (difilter dari {path.registrations.length} total)</span>
                                    )}
                                </>
                            ) : (
                                'Tidak ada data'
                            )}
                        </div>
                        {totalPages > 1 && (
                            <div className="flex items-center gap-1">
                                {/* Previous */}
                                <button
                                    onClick={() => goToPage(safeCurrentPage - 1)}
                                    disabled={safeCurrentPage <= 1}
                                    className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium shadow-sm transition ${
                                        safeCurrentPage <= 1
                                            ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Prev
                                </button>

                                {/* Page numbers */}
                                {getPageNumbers().map((page, i) => {
                                    if (page === '...') {
                                        return (
                                            <span key={`dots-${i}`} className="px-1.5 py-1.5 text-sm text-gray-400">
                                                ⋯
                                            </span>
                                        );
                                    }
                                    return page === safeCurrentPage ? (
                                        <span
                                            key={page}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 text-sm font-semibold text-white shadow-sm"
                                        >
                                            {page}
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                {/* Next */}
                                <button
                                    onClick={() => goToPage(safeCurrentPage + 1)}
                                    disabled={safeCurrentPage >= totalPages}
                                    className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium shadow-sm transition ${
                                        safeCurrentPage >= totalPages
                                            ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    Next
                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
