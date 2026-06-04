import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const barColors = [
    'from-emerald-500 to-green-500',
    'from-violet-500 to-purple-500',
    'from-blue-500 to-indigo-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-500',
    'from-cyan-500 to-teal-500',
];

export default function Dashboard({ totalRegistrations, statusCounts, perPath, recentRegistrations, activeYear }) {
    const statusBadge = (status) => {
        const map = {
            draft: 'bg-gray-100 text-gray-700',
            pending: 'bg-blue-50 text-blue-700',
            accepted: 'bg-emerald-50 text-emerald-700',
            reserve: 'bg-amber-50 text-amber-700',
            rejected: 'bg-red-50 text-red-700',
        };
        return map[status] || 'bg-gray-100 text-gray-700';
    };

    const statusLabels = {
        draft: 'Draft',
        pending: 'Menunggu',
        accepted: 'Diterima',
        reserve: 'Cadangan',
        rejected: 'Ditolak',
    };

    const statCards = [
        { label: 'Total Pendaftar', value: totalRegistrations, gradient: 'from-blue-500 to-indigo-600', lightBg: 'bg-blue-50', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
        { label: 'Diterima', value: statusCounts.accepted || 0, gradient: 'from-emerald-500 to-green-600', lightBg: 'bg-emerald-50', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        { label: 'Cadangan', value: statusCounts.reserve || 0, gradient: 'from-amber-500 to-orange-600', lightBg: 'bg-amber-50', icon: 'M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { label: 'Ditolak', value: statusCounts.rejected || 0, gradient: 'from-red-500 to-rose-600', lightBg: 'bg-red-50', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
    ];

    const maxTotal = Math.max(...perPath.map((p) => p.total), 1);
    const maxQuota = Math.max(...perPath.map((p) => p.quota), 1);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-200">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Dashboard Kepala Madrasah</h2>
                        <p className="text-sm text-gray-500">
                            {activeYear ? `Tahun Ajaran ${activeYear.name}` : 'Belum ada tahun ajaran aktif'}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard Kepala Madrasah" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stat Cards */}
                    <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {statCards.map((card) => (
                            <div
                                key={card.label}
                                className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md"
                            >
                                <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${card.gradient} opacity-[0.06]`} />
                                <div className="relative">
                                    <div className={`mb-3 inline-flex rounded-xl ${card.lightBg} p-3`}>
                                        <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon} />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">{card.label}</p>
                                    <p className="mt-1 text-3xl font-bold text-gray-900">{card.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mb-8 grid gap-6 lg:grid-cols-5">
                        {/* Bar Chart */}
                        <div className="lg:col-span-3 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                                <h3 className="text-base font-semibold text-gray-900">Pendaftar Per Jalur</h3>
                                <p className="text-sm text-gray-500">Jumlah pendaftar berdasarkan jalur pendaftaran</p>
                            </div>
                            <div className="space-y-5 p-6">
                                {perPath.length === 0 ? (
                                    <p className="py-8 text-center text-sm text-gray-400">Belum ada jalur pendaftaran aktif.</p>
                                ) : (
                                    perPath.map((path, idx) => {
                                        const barGradient = barColors[idx % barColors.length];
                                        const pctOfMax = (path.total / maxTotal) * 100;
                                        const quotaPct = path.quota > 0 ? Math.round((path.quota - path.available_quota) / path.quota * 100) : 0;

                                        return (
                                            <div key={path.name}>
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-900">{path.name}</span>
                                                    <span className="text-sm text-gray-500">
                                                        {path.total} pendaftar
                                                        {path.quota > 0 && (
                                                            <span className="ml-1 text-gray-400">/ kuota {path.quota}</span>
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="relative h-10 w-full overflow-hidden rounded-xl bg-gray-100">
                                                    <div
                                                        className={`h-full rounded-xl bg-gradient-to-r ${barGradient} transition-all duration-500`}
                                                        style={{ width: `${Math.max(pctOfMax, 2)}%` }}
                                                    />
                                                    {path.quota > 0 && (
                                                        <div
                                                            className="absolute bottom-0 top-0 w-0.5 bg-gray-400/60"
                                                            style={{ left: `${(path.quota / maxQuota) * 100}%` }}
                                                        >
                                                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-gray-400">
                                                                kuota
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-1 flex gap-4 text-[11px] text-gray-400">
                                                    <span className="inline-flex items-center gap-1">
                                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                        {path.accepted} diterima
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                                                        {path.reserve} cadangan
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <span className="h-2 w-2 rounded-full bg-red-500" />
                                                        {path.rejected} ditolak
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                                                        {path.pending} menunggu
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Donut-style pie chart (CSS circles) */}
                        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                                <h3 className="text-base font-semibold text-gray-900">Komposisi Status</h3>
                                <p className="text-sm text-gray-500">Sebaran status pendaftaran</p>
                            </div>
                            <div className="flex flex-col items-center p-6">
                                {totalRegistrations === 0 ? (
                                    <p className="py-8 text-sm text-gray-400">Belum ada pendaftar.</p>
                                ) : (
                                    <>
                                        <div className="relative mb-8 flex h-44 w-44 items-center justify-center">
                                            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                                {(() => {
                                                    const items = [
                                                        { key: 'accepted', color: '#10b981', value: statusCounts.accepted || 0 },
                                                        { key: 'reserve', color: '#f59e0b', value: statusCounts.reserve || 0 },
                                                        { key: 'rejected', color: '#ef4444', value: statusCounts.rejected || 0 },
                                                        { key: 'pending', color: '#3b82f6', value: statusCounts.pending || 0 },
                                                        { key: 'draft', color: '#9ca3af', value: statusCounts.draft || 0 },
                                                    ];
                                                    const total = items.reduce((s, i) => s + i.value, 0) || 1;
                                                    let offset = 0;
                                                    return items
                                                        .filter((i) => i.value > 0)
                                                        .map((item) => {
                                                            const pct = item.value / total;
                                                            const circumference = 2 * Math.PI * 15.915;
                                                            const dashLength = pct * circumference;
                                                            const dashOffset = -offset * circumference;
                                                            offset += pct;
                                                            return (
                                                                <circle
                                                                    key={item.key}
                                                                    cx="18"
                                                                    cy="18"
                                                                    r="15.915"
                                                                    fill="none"
                                                                    stroke={item.color}
                                                                    strokeWidth="3"
                                                                    strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                                                                    strokeDashoffset={dashOffset}
                                                                    className="transition-all duration-500"
                                                                />
                                                            );
                                                        });
                                                })()}
                                            </svg>
                                            <div className="absolute flex flex-col items-center">
                                                <span className="text-2xl font-bold text-gray-900">{totalRegistrations}</span>
                                                <span className="text-[11px] text-gray-400">Total</span>
                                            </div>
                                        </div>
                                        <div className="flex w-full flex-wrap justify-center gap-x-5 gap-y-2">
                                            {[
                                                { key: 'accepted', label: 'Diterima', color: 'bg-emerald-500', value: statusCounts.accepted || 0 },
                                                { key: 'reserve', label: 'Cadangan', color: 'bg-amber-500', value: statusCounts.reserve || 0 },
                                                { key: 'rejected', label: 'Ditolak', color: 'bg-red-500', value: statusCounts.rejected || 0 },
                                                { key: 'pending', label: 'Menunggu', color: 'bg-blue-500', value: statusCounts.pending || 0 },
                                                { key: 'draft', label: 'Draft', color: 'bg-gray-400', value: statusCounts.draft || 0 },
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-center gap-2">
                                                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                                                    <span className="text-xs text-gray-500">{item.label}</span>
                                                    <span className="text-xs font-medium text-gray-700">{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Registrations */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                            <h3 className="text-base font-semibold text-gray-900">Pendaftar Terbaru</h3>
                            <p className="text-sm text-gray-500">5 pendaftar terakhir</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nama</th>
                                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Jalur</th>
                                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentRegistrations.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-400">Belum ada pendaftar.</td>
                                        </tr>
                                    ) : (
                                        recentRegistrations.map((reg) => (
                                            <tr key={reg.id} className="transition-colors hover:bg-gray-50/50">
                                                <td className="whitespace-nowrap px-5 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-50 text-xs font-bold text-gray-600">
                                                            {(reg.student_biodata?.full_name || reg.user?.name || '?').charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {reg.student_biodata?.full_name || reg.user?.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-500">{reg.admission_path?.name}</td>
                                                <td className="whitespace-nowrap px-5 py-3.5">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(reg.status)}`}>
                                                        {statusLabels[reg.status] || reg.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
