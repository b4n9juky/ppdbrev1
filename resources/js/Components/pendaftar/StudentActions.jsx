import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function StudentActions({ registration, user }) {
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);

    if (!registration) return null;

    const isAssignedToMe = registration.assigned_operator_id === user.id;
    const isAssignedToOther = registration.assigned_operator_id && !isAssignedToMe;
    const canClaim = registration.processing_status === 'baru';
    const isProcessing = registration.processing_status === 'diproses' && isAssignedToMe;
    const isCompleted = registration.processing_status === 'selesai';

    function handleClaim() {
        router.post(route('admin.registrations.claim', registration.id), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    }

    function handleVerify() {
        router.post(route('admin.registrations.verify', registration.id), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    }

    function handleReject() {
        router.post(route('admin.registrations.reject-file', registration.id), {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => setShowRejectConfirm(false),
        });
    }

    function handleRelease() {
        router.post(route('admin.registrations.release', registration.id), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    }

    return (
        <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 mb-1">Aksi</p>

            {canClaim && (
                <button
                    onClick={handleClaim}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:from-blue-600 hover:to-indigo-700 hover:shadow-md active:translate-y-px"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Ambil Pendaftar
                </button>
            )}

            {isAssignedToOther && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-center">
                    <p className="text-xs font-medium text-amber-800">
                        Sedang diproses oleh {registration.assigned_operator?.name || 'operator lain'}
                    </p>
                </div>
            )}

            {isProcessing && (
                <div className="space-y-2">
                    <button
                        onClick={handleVerify}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:from-emerald-600 hover:to-green-700 hover:shadow-md active:translate-y-px"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Verifikasi
                    </button>

                    <button
                        onClick={() => setShowRejectConfirm(true)}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 shadow-sm transition-all hover:bg-red-100 active:translate-y-px"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Tolak Berkas
                    </button>

                    <button
                        onClick={handleRelease}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 active:translate-y-px"
                    >
                        Lepaskan
                    </button>
                </div>
            )}

            {isCompleted && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center">
                    <p className="text-xs font-medium text-emerald-800">Proses verifikasi selesai</p>
                </div>
            )}

            {showRejectConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-base font-bold text-gray-900 mb-2">Tolak Berkas</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Apakah Anda yakin ingin menolak berkas pendaftar ini?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowRejectConfirm(false)}
                                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleReject}
                                className="rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:from-red-600 hover:to-rose-700"
                            >
                                Ya, Tolak
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
