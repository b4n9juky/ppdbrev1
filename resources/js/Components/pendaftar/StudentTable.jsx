import { useEffect, useRef, useState } from 'react';
import { Link, router } from '@inertiajs/react';

const processingStatusConfig = {
    baru: { label: 'Baru', bg: 'bg-gray-100 text-gray-700 ring-gray-300' },
    diproses: { label: 'Diproses', bg: 'bg-amber-100 text-amber-700 ring-amber-300' },
    selesai: { label: 'Selesai', bg: 'bg-emerald-100 text-emerald-800 ring-emerald-300' },
};

const perPageOptions = [10, 15, 25, 50, 100];

function SortIcon({ field, filters }) {
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
}

export default function StudentTable({ registrations, filters, selectedId, onSelect }) {
    const [search, setSearch] = useState(filters.search || '');
    const debounceRef = useRef(null);
    const selectedRowRef = useRef(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(route('admin.registrations.index'), {
                    ...filters,
                    search,
                    page: 1,
                    selected_id: null,
                }, { preserveState: true, preserveScroll: true });
            }
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [search]);

    useEffect(() => {
        if (selectedRowRef.current) {
            selectedRowRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }, [selectedId]);

    function handleSort(field) {
        const direction = filters.sort === field && filters.direction === 'asc' ? 'desc' : 'asc';
        router.get(route('admin.registrations.index'), {
            ...filters,
            sort: field,
            direction,
            selected_id: null,
        }, { preserveState: true });
    }

    function handlePerPage(value) {
        router.get(route('admin.registrations.index'), {
            ...filters,
            per_page: value,
            page: 1,
            selected_id: null,
        }, { preserveState: true, preserveScroll: true });
    }

    function handleFilterStatus(status) {
        router.get(route('admin.registrations.index'), {
            ...filters,
            processing_status: status,
            page: 1,
            selected_id: null,
        }, { preserveState: true });
    }

    const registrationsData = registrations?.data || registrations || [];

    return (
        <div className="flex flex-col h-full">
            {/* Filter tabs */}
            <div className="flex gap-1.5 p-3 border-b border-gray-100 bg-gray-50/30">
                {[
                    { key: 'all', label: 'Semua' },
                    { key: 'baru', label: 'Belum Diproses' },
                    { key: 'my_processing', label: 'Proses Saya' },
                ].map((tab) => {
                    const isActive = (filters.processing_status || 'all') === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => handleFilterStatus(tab.key)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                isActive
                                    ? 'bg-emerald-500 text-white shadow-sm'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Search and per-page */}
            <div className="flex items-center gap-2 p-3 border-b border-gray-100">
                <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                        <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama, NISN..."
                        className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                <select
                    value={filters.per_page || 15}
                    onChange={(e) => handlePerPage(e.target.value)}
                    className="rounded-lg border border-gray-200 bg-white py-1.5 pl-2 pr-6 text-xs font-medium text-gray-600 shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                >
                    {perPageOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50/80 sticky top-0 z-10">
                            <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500 w-10">Foto</th>
                            <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                <button onClick={() => handleSort('created_at')} className="flex items-center gap-1 hover:text-gray-700">
                                    Nama
                                    <SortIcon field="created_at" filters={filters} />
                                </button>
                            </th>
                            <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">NISN</th>
                            <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Jalur</th>
                            <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Berkas</th>
                            <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Seleksi</th>
                            <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Operator</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {registrationsData.length > 0 ? (
                            registrationsData.map((reg) => {
                                const ps = processingStatusConfig[reg.processing_status] || processingStatusConfig.baru;
                                const isSelected = selectedId === reg.id;
                                const photo = reg.student_documents?.find(d => d.document_type === 'foto');
                                return (
                                    <tr
                                        key={reg.id}
                                        ref={isSelected ? selectedRowRef : null}
                                        onClick={() => onSelect(reg.id)}
                                        className={`cursor-pointer transition-all ${
                                            isSelected
                                                ? 'bg-emerald-50 border-l-2 border-l-emerald-500 shadow-sm'
                                                : 'hover:bg-gray-50/50 border-l-2 border-l-transparent'
                                        }`}
                                    >
                                        <td className="px-3 py-2.5">
                                            {photo ? (
                                                <img
                                                    src={`/storage/${photo.file_path}`}
                                                    alt=""
                                                    className="h-8 w-8 rounded-lg object-cover shadow-sm ring-1 ring-gray-200"
                                                />
                                            ) : (
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-[9px] font-semibold text-gray-400 border border-dashed border-gray-300">
                                                    -
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <p className="text-sm font-medium text-gray-900 truncate max-w-[160px]">
                                                {reg.student_biodata?.full_name || reg.user?.name || '-'}
                                            </p>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <span className="text-xs text-gray-500 font-mono">
                                                {reg.student_biodata?.nisn || '-'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <span className="text-xs text-gray-600">
                                                {reg.admission_path?.name || '-'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${ps.bg}`}>
                                                {ps.label}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${
                                                reg.status === 'pending' || !reg.status || reg.status === 'draft'
                                                    ? 'bg-gray-100 text-gray-600 ring-gray-300'
                                                    : reg.status === 'accepted'
                                                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-300'
                                                        : reg.status === 'reserve'
                                                            ? 'bg-amber-50 text-amber-700 ring-amber-300'
                                                            : 'bg-red-50 text-red-700 ring-red-300'
                                            }`}>
                                                {reg.status === 'accepted' ? 'Lulus'
                                                    : reg.status === 'reserve' ? 'Cadangan'
                                                        : reg.status === 'rejected' ? 'Tidak Lulus'
                                                            : 'Belum Dinilai'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <span className="text-xs text-gray-500 truncate max-w-[100px] block">
                                                {reg.assigned_operator?.name || '-'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-16 text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
                                        <svg className="h-6 w-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {search ? 'Tidak ada hasil' : 'Belum ada pendaftar'}
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {registrations && registrations.last_page > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/30 px-3 py-2">
                    <span className="text-[10px] text-gray-500">
                        {registrations.from}-{registrations.to} dari {registrations.total}
                    </span>
                    <div className="flex items-center gap-1">
                        {registrations.current_page > 1 && (
                            <Link
                                href={registrations.prev_page_url}
                                preserveState
                                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-2 py-1 text-[10px] font-medium text-gray-600 shadow-sm hover:bg-gray-50"
                            >
                                Prev
                            </Link>
                        )}
                        {registrations.links.slice(1, -1).map((link, i) => {
                            if (link.label === '...') {
                                return <span key={i} className="px-1 text-[10px] text-gray-400">...</span>;
                            }
                            return link.active ? (
                                <span key={i} className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 text-[10px] font-semibold text-white">
                                    {link.label}
                                </span>
                            ) : (
                                <Link
                                    key={i}
                                    href={link.url}
                                    preserveState
                                    className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-gray-200 bg-white text-[10px] font-medium text-gray-600 hover:bg-gray-50"
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        {registrations.current_page < registrations.last_page && (
                            <Link
                                href={registrations.next_page_url}
                                preserveState
                                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-2 py-1 text-[10px] font-medium text-gray-600 shadow-sm hover:bg-gray-50"
                            >
                                Next
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
