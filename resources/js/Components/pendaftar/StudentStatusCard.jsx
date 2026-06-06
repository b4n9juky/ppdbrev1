const statusConfig = {
    draft: { label: 'Draft', bg: 'bg-gray-100 text-gray-700 ring-gray-300' },
    pending: { label: 'Menunggu', bg: 'bg-blue-50 text-blue-700 ring-blue-300' },
    accepted: { label: 'Diterima', bg: 'bg-emerald-50 text-emerald-700 ring-emerald-300' },
    reserve: { label: 'Cadangan', bg: 'bg-amber-50 text-amber-700 ring-amber-300' },
    rejected: { label: 'Ditolak', bg: 'bg-red-50 text-red-700 ring-red-300' },
};

const processingStatusConfig = {
    baru: { label: 'Belum Diverifikasi', bg: 'bg-gray-100 text-gray-700 ring-gray-300' },
    diproses: { label: 'Sedang Diproses', bg: 'bg-amber-100 text-amber-700 ring-amber-300' },
    selesai: { label: 'Terverifikasi', bg: 'bg-emerald-100 text-emerald-800 ring-emerald-300' },
};

export default function StudentStatusCard({ registration }) {
    if (!registration) return null;

    const st = statusConfig[registration.status] || statusConfig.draft;
    const ps = processingStatusConfig[registration.processing_status] || processingStatusConfig.baru;

    return (
        <div className="space-y-3">
            <div>
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Status Berkas</p>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${ps.bg}`}>
                    {ps.label}
                </span>
            </div>
            <div>
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Status Seleksi</p>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${st.bg}`}>
                    {st.label}
                </span>
            </div>
        </div>
    );
}
