import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StudentTable from '@/Components/pendaftar/StudentTable';
import StudentPreviewPanel from '@/Components/pendaftar/StudentPreviewPanel';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'ppdb_operator_split_left';
const MIN_PERCENT = 20;
const MAX_PERCENT = 65;
const DEFAULT_PERCENT = 35;

function getStoredPercent() {
    try {
        const val = localStorage.getItem(STORAGE_KEY);
        if (val !== null) {
            const num = parseFloat(val);
            if (!isNaN(num) && num >= MIN_PERCENT && num <= MAX_PERCENT) return num;
        }
    } catch {}
    return DEFAULT_PERCENT;
}

function setStoredPercent(val) {
    try { localStorage.setItem(STORAGE_KEY, String(val)); } catch {}
}

export default function OperatorIndex({ registrations, selectedRegistration, paths, filters, documentTypes = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [leftPercent, setLeftPercent] = useState(getStoredPercent);
    const leftPercentRef = useRef(leftPercent);
    const containerRef = useRef(null);
    const dragging = useRef(false);

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
        router.get(route('admin.registrations.index'), {
            ...filters,
            selected_id: studentId,
        }, { preserveState: true, preserveScroll: true });
    }

    return (
        <AuthenticatedLayout
            wide={true}
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-200">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Data Pendaftar</h2>
                        <p className="text-sm text-gray-500">Verifikasi berkas pendaftar dengan cepat</p>
                    </div>
                </div>
            }
        >
            <Head title="Pendaftar" />

            {/* Desktop Layout */}
            <div
                ref={containerRef}
                className="hidden md:flex h-[calc(100vh-10rem)] min-h-[500px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
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
                            />
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
