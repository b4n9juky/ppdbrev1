import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import QuotaMonitor from '@/Components/admin/QuotaMonitor';
import { Head, Link } from '@inertiajs/react';
import { formatDateTime } from '@/lib/utils';

const statusBadge = {
    draft: 'bg-gray-100 text-gray-700 ring-gray-300',
    pending: 'bg-blue-50 text-blue-700 ring-blue-300',
    accepted: 'bg-emerald-50 text-emerald-700 ring-emerald-300',
    reserve: 'bg-amber-50 text-amber-700 ring-amber-300',
    rejected: 'bg-red-50 text-red-700 ring-red-300',
};

const statusLabels = {
    draft: 'Draft',
    pending: 'Menunggu',
    accepted: 'Diterima',
    reserve: 'Cadangan',
    rejected: 'Ditolak',
};

const statCards = [
    { key: 'total', label: 'Total Pendaftar', color: 'from-slate-600 to-slate-500', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { key: 'pending', label: 'Menunggu', color: 'from-blue-600 to-blue-500', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'accepted', label: 'Diterima', color: 'from-emerald-600 to-emerald-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'reserve', label: 'Cadangan', color: 'from-amber-600 to-amber-500', icon: 'M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'rejected', label: 'Ditolak', color: 'from-red-600 to-red-500', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
];

const menuCards = [
    { name: 'Tahun Ajaran', desc: 'Buka/tutup pendaftaran', href: route('admin.academic-years.index'), gradient: 'from-emerald-500 to-teal-500', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Jalur Pendaftaran', desc: 'Kelola jalur dan kuota', href: route('admin.admission-paths.index'), gradient: 'from-violet-500 to-purple-500', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { name: 'Mata Pelajaran', desc: 'Kelola mapel ujian', href: route('admin.subjects.index'), gradient: 'from-sky-500 to-cyan-500', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'Pengaturan Madrasah', desc: 'Profil dan berkas madrasah', href: route('admin.madrasah-settings.edit'), gradient: 'from-emerald-500 to-green-500', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { name: 'Pendaftar', desc: 'Verifikasi dan kelulusan', href: route('admin.registrations.index'), gradient: 'from-orange-500 to-amber-500', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
];

export default function Dashboard({ paths, totalRegistrations, statusCounts, recentRegistrations, activeYear }) {
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
                        <h2 className="text-xl font-bold text-gray-900">Dashboard Admin</h2>
                        <p className="text-sm text-gray-500">Panel monitoring PPDB</p>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard Admin" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="mb-8">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            {statCards.map((card, i) => {
                                const count = card.key === 'total' ? totalRegistrations : (statusCounts?.[card.key] || 0);
                                return (
                                    <div
                                        key={card.key}
                                        className="group relative overflow-hidden rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                                    >
                                        <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-br opacity-5 transition-all group-hover:scale-150 group-hover:opacity-10"
                                            style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                                        />
                                        <div className="relative">
                                            <div className={`mb-3 inline-flex rounded-lg bg-gradient-to-br ${card.color} p-2.5 shadow-sm`}>
                                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon} />
                                                </svg>
                                            </div>
                                            <p className="text-2xl font-bold text-gray-900">{count}</p>
                                            <p className="mt-0.5 text-sm text-gray-500">{card.label}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Registration Status */}
                    <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className={`px-6 py-5 ${activeYear?.is_active ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gradient-to-r from-gray-500 to-slate-500'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/80">Status Pendaftaran</p>
                                        <h3 className="text-lg font-bold text-white">
                                            {activeYear
                                                ? `${activeYear.name} — ${activeYear.is_active ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'}`
                                                : 'Belum ada tahun ajaran aktif'}
                                        </h3>
                                    </div>
                                </div>
                                <Link
                                    href={route('admin.academic-years.index')}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/30 ring-1 ring-white/30"
                                >
                                    Atur
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quota Monitoring */}
                    <div className="mb-8">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Monitoring Kuota</h3>
                                <p className="text-sm text-gray-500">Status kapasitas jalur pendaftaran</p>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {paths.map((path) => (
                                <QuotaMonitor key={path.id} path={path} />
                            ))}
                        </div>
                    </div>

                    {/* Recent Registrations */}
                    {recentRegistrations.length > 0 && (
                        <div className="mb-8">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">Pendaftar Terbaru</h3>
                                    <p className="text-sm text-gray-500">{recentRegistrations.length} pendaftar terakhir</p>
                                </div>
                                <Link
                                    href={route('admin.registrations.index')}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
                                >
                                    Lihat Semua
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nama</th>
                                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Jalur</th>
                                            <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                            <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Tanggal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {recentRegistrations.map((r, idx) => (
                                            <tr key={r.id} className="transition-colors hover:bg-gray-50/50">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-green-100 text-xs font-semibold text-emerald-700">
                                                            {(r.student_biodata?.full_name || r.user?.name || '?').charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-800">
                                                            {r.student_biodata?.full_name || r.user?.name || '-'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-500">{r.admission_path?.name || '-'}</td>
                                                <td className="px-5 py-4 text-center">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusBadge[r.status] || 'bg-gray-100 text-gray-700 ring-gray-300'}`}>
                                                        {statusLabels[r.status] || r.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right text-sm text-gray-400">{formatDateTime(r.created_at)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Menu Cards */}
                    <div>
                        <div className="mb-4">
                            <h3 className="text-base font-semibold text-gray-900">Menu Cepat</h3>
                            <p className="text-sm text-gray-500">Akses fitur pengelolaan PPDB</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {menuCards.map((card) => (
                                <Link
                                    key={card.name}
                                    href={card.href}
                                    className="group relative overflow-hidden rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                                >
                                    <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${card.gradient} opacity-5 transition-all duration-300 group-hover:scale-150 group-hover:opacity-10`} />
                                    <div className="relative">
                                        <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${card.gradient} p-3 shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:scale-105`}>
                                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon} />
                                            </svg>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 transition-colors group-hover:text-emerald-600">{card.name}</h4>
                                        <p className="mt-1 text-sm text-gray-500">{card.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
