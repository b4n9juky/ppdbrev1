import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StudentTable from '@/Components/pendaftar/StudentTable';
import StudentPreviewPanel from '@/Components/pendaftar/StudentPreviewPanel';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { formatDateTime } from '@/lib/utils';

const STORAGE_KEY = 'ppdb_operator_split_left';
const MIN_PERCENT = 20;
const MAX_PERCENT = 65;
const DEFAULT_PERCENT = 35;

function getStoredPercent() {
    try {
        const val = localStorage.getItem(STORAGE_KEY);
        if (val !== null) {
            const num = parseFloat(val);
            if (!num || isNaN(num) || num < MIN_PERCENT || num > MAX_PERCENT) return DEFAULT_PERCENT;
            return num;
        }
    } catch {}
    return DEFAULT_PERCENT;
}

function setStoredPercent(val) {
    try { localStorage.setItem(STORAGE_KEY, String(val)); } catch {}
}

export default function OperatorIndex({ registrations, selectedRegistration, paths, filters, subjects = [], documentTypes = [], myActivities }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [leftPercent, setLeftPercent] = useState(getStoredPercent);
    const leftPercentRef = useRef(leftPercent);
    const containerRef = useRef(null);
    const dragging = useRef(false);
    const [activeTab, setActiveTab] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('tab') || 'workspace';
    });

    useEffect(() => {
        leftPercentRef.current = leftPercent;
    }, [leftPercent]);

    useEffect(() => {
        if (selectedRegistration) {
            setMobileDrawerOpen(true);
        }
    }, [selectedRegistration?.id]);

    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        dragging.current = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        const onMouseMove = (e) => {
            if (!dragging.current || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const containerWidth = rect.width;
            if (containerWidth <= 0) return;

            let px = e.clientX - rect.left;
            px = Math.max(px, containerWidth * (MIN_PERCENT / 100));
            px = Math.min(px, containerWidth * (MAX_PERCENT / 100));

            const pct = Math.round((px / containerWidth) * 100);
            setLeftPercent(pct);
            leftPercentRef.current = pct;
        };

        const onMouseUp = () => {
            dragging.current = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            setStoredPercent(leftPercentRef.current);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }, []);

    function handleSelect(studentId) {
        router.get(route('operator.registrations.index'), {
            ...filters,
            selected_id: studentId,
            tab: activeTab,
        }, { preserveState: true, preserveScroll: true });
    }

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
                        <h2 className="text-xl font-bold text-gray-900">Operator Workspace</h2>
                        <p className="text-sm text-gray-500">Proses verifikasi berkas dan pantau riwayat kerja Anda</p>
                    </div>
                </div>
            }
        >
            <Head title="Workspace Operator" />

            {/* Tab Navigation */}
            <div className="mb-6 flex gap-1 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-sm max-w-md">
                <button
                    onClick={() => {
                        setActiveTab('workspace');
                        const params = new URLSearchParams(window.location.search);
                        params.set('tab', 'workspace');
                        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
                    }}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                        activeTab === 'workspace'
                            ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-100'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Verifikasi Pendaftar
                </button>
                <button
                    onClick={() => {
                        setActiveTab('history');
                        const params = new URLSearchParams(window.location.search);
                        params.set('tab', 'history');
                        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
                    }}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                        activeTab === 'history'
                            ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-100'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Riwayat Saya
                </button>
            </div>

            {activeTab === 'workspace' ? (
                <>
                    {/* Desktop Layout */}
                    <div
                        ref={containerRef}
                        className="hidden md:flex h-[calc(100vh-14rem)] min-h-[500px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                    >
                        <div
                            className="border-r border-gray-100 flex flex-col shrink-0"
                            style={{ width: `${leftPercent}%`, minWidth: '280px' }}
                        >
                            <StudentTable
                                registrations={registrations}
                                filters={filters}
                                selectedId={filters.selected_id}
                                onSelect={handleSelect}
                                routePrefix="operator"
                            />
                        </div>

                        {/* Drag Handle */}
                        <div
                            onMouseDown={handleMouseDown}
                            className="w-1.5 cursor-col-resize shrink-0 bg-gray-100 hover:bg-emerald-400 active:bg-emerald-500 transition-colors duration-150 relative group"
                        >
                            <div className="absolute inset-y-0 -left-1 -right-1" />
                        </div>

                        <div className="flex-1 overflow-y-auto min-w-0">
                            <StudentPreviewPanel
                                registration={selectedRegistration}
                                user={user}
                                documentTypes={documentTypes}
                                subjects={subjects}
                                routePrefix="operator"
                            />
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden">
                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <StudentTable
                                registrations={registrations}
                                filters={filters}
                                selectedId={filters.selected_id}
                                onSelect={(id) => {
                                    handleSelect(id);
                                    setMobileDrawerOpen(true);
                                }}
                                routePrefix="operator"
                            />
                        </div>

                        {mobileDrawerOpen && selectedRegistration && (
                            <div className="fixed inset-0 z-50 md:hidden">
                                <div
                                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                                    onClick={() => setMobileDrawerOpen(false)}
                                />
                                <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl overflow-y-auto animate-slide-in-right">
                                    <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
                                        <h3 className="text-sm font-bold text-gray-900">
                                            Detail Pendaftar
                                        </h3>
                                        <button
                                            onClick={() => setMobileDrawerOpen(false)}
                                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <StudentPreviewPanel
                                        registration={selectedRegistration}
                                        user={user}
                                        documentTypes={documentTypes}
                                        subjects={subjects}
                                        routePrefix="operator"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                /* Riwayat Saya Log Table */
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-gray-100 px-6 py-5">
                        <h3 className="text-base font-semibold text-gray-900">Riwayat Aktivitas Anda</h3>
                        <p className="text-sm text-gray-500">Log aktivitas penanganan berkas dan verifikasi pendaftar</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead>
                                <tr className="bg-gray-50/80">
                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Aktivitas</th>
                                    <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Tipe Aksi</th>
                                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Waktu</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {myActivities?.data.map((act) => {
                                    const actionBadges = {
                                        claim: 'bg-blue-50 text-blue-700 ring-blue-300',
                                        complete: 'bg-emerald-50 text-emerald-700 ring-emerald-300',
                                        release: 'bg-gray-50 text-gray-600 ring-gray-200',
                                        reset: 'bg-amber-50 text-amber-700 ring-amber-300',
                                        'reject-file': 'bg-red-50 text-red-700 ring-red-300',
                                    };
                                    const actionLabels = {
                                        claim: 'Ambil',
                                        complete: 'Selesai',
                                        release: 'Lepas',
                                        reset: 'Reset ke Draft',
                                        'reject-file': 'Tolak Berkas',
                                    };
                                    const badgeClass = actionBadges[act.action] || 'bg-gray-50 text-gray-600 ring-gray-200';
                                    const label = actionLabels[act.action] || act.action;
                                    return (
                                        <tr key={act.id} className="transition-colors hover:bg-gray-50/50">
                                            <td className="px-5 py-4 text-sm text-gray-900">
                                                {act.description}
                                            </td>
                                            <td className="px-5 py-4 text-center whitespace-nowrap">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${badgeClass}`}>
                                                    {label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right text-sm text-gray-400 whitespace-nowrap">
                                                {formatDateTime(act.created_at)}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {(!myActivities || myActivities.data.length === 0) && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-16 text-center text-sm text-gray-400">
                                            Belum ada riwayat aktivitas
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* History Pagination */}
                    {myActivities?.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/30 px-6 py-4">
                            <div className="text-sm text-gray-500">
                                Menampilkan {myActivities.from}-{myActivities.to} dari {myActivities.total}
                            </div>
                            <div className="flex items-center gap-1">
                                {myActivities.links.slice(1, -1).map((link, i) => {
                                    if (link.label === '...') {
                                        return <span key={i} className="px-2 py-2 text-sm text-gray-400">...</span>;
                                    }
                                    return link.active ? (
                                        <span key={i} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 text-sm font-semibold text-white shadow-sm">{link.label}</span>
                                    ) : (
                                        <Link key={i} href={link.url} preserveState className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900">{link.label}</Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
