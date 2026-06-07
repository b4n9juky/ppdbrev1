import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { formatDateTime } from '@/lib/utils';

export default function Dashboard({ totalQueue, myProcessingCount, myCompletedCount, recentActivities, activeYear }) {
    const actionBadge = (action) => {
        const map = {
            claim: 'bg-blue-50 text-blue-700 ring-blue-600/10',
            verify: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
            'reject-file': 'bg-red-50 text-red-700 ring-red-600/10',
            release: 'bg-gray-50 text-gray-700 ring-gray-600/10',
            reset: 'bg-amber-50 text-amber-700 ring-amber-600/10',
        };
        const label = {
            claim: 'Ambil',
            verify: 'Verifikasi',
            'reject-file': 'Tolak Berkas',
            release: 'Lepas',
            reset: 'Reset',
        };
        return (
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${map[action] || 'bg-gray-50 text-gray-700 ring-gray-600/10'}`}>
                {label[action] || action}
            </span>
        );
    };

    const statCards = [
        {
            label: 'Antrean Pendaftar Baru',
            value: totalQueue,
            gradient: 'from-orange-500 to-amber-600',
            lightBg: 'bg-orange-50 text-orange-600',
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
            desc: 'Pendaftar yang belum diproses'
        },
        {
            label: 'Sedang Saya Proses',
            value: myProcessingCount,
            gradient: 'from-blue-500 to-indigo-600',
            lightBg: 'bg-blue-50 text-blue-600',
            icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
            desc: 'Berkas aktif yang Anda klaim'
        },
        {
            label: 'Selesai Saya Verifikasi',
            value: myCompletedCount,
            gradient: 'from-emerald-500 to-green-600',
            lightBg: 'bg-emerald-50 text-emerald-600',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            desc: 'Total verifikasi yang telah diselesaikan'
        }
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-200">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Dashboard Operator</h2>
                        <p className="text-sm text-gray-500">
                            {activeYear ? `Tahun Ajaran ${activeYear.name}` : 'Belum ada tahun ajaran aktif'}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard Operator" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Welcome Banner */}
                    <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-8 text-white shadow-lg shadow-orange-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold">Selamat Datang di Portal Operator PPDB!</h3>
                            <p className="mt-2 text-orange-50/95 max-w-xl text-sm">
                                Lakukan verifikasi berkas pendaftar, entri nilai seleksi, dan validasi persyaratan pendaftaran siswa baru secara tertib dan teliti.
                            </p>
                        </div>
                        <Link
                            href={route('operator.registrations.index')}
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-orange-600 shadow-md hover:bg-orange-50 transition transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Mulai Verifikasi
                        </Link>
                    </div>

                    {/* Stats Grid */}
                    <div className="mb-8 grid gap-6 sm:grid-cols-3">
                        {statCards.map((card) => (
                            <div
                                key={card.label}
                                className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition duration-300 hover:shadow-md"
                            >
                                <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-[0.06]`} />
                                <div className="relative flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.label}</p>
                                        <p className="mt-2 text-3xl font-extrabold text-gray-900">{card.value}</p>
                                        <p className="mt-1 text-xs text-gray-400">{card.desc}</p>
                                    </div>
                                    <div className={`rounded-xl ${card.lightBg} p-3`}>
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon} />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Activity Table */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-gray-900">Aktivitas Terakhir Saya</h3>
                                <p className="text-xs text-gray-400">5 riwayat verifikasi berkas yang telah Anda kerjakan</p>
                            </div>
                            <Link
                                href={`${route('operator.registrations.index')}?tab=history`}
                                className="text-xs font-bold text-orange-600 hover:text-orange-700 transition"
                            >
                                Lihat Semua
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Pendaftar</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Catatan/Keterangan</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Waktu</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentActivities.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-400">
                                                Belum ada aktivitas verifikasi yang tercatat.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentActivities.map((log) => (
                                            <tr key={log.id} className="transition-colors hover:bg-gray-50/50">
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 text-xs font-bold text-gray-600 border border-gray-200">
                                                            {(log.registration?.student_biodata?.full_name || log.registration?.user?.name || '?').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {log.registration?.student_biodata?.full_name || log.registration?.user?.name}
                                                            </div>
                                                            <div className="text-[10px] text-gray-400">
                                                                NISN: {log.registration?.student_biodata?.nisn || '-'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {actionBadge(log.action)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                    {log.description}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-400 font-mono">
                                                    {formatDateTime(log.created_at)}
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
