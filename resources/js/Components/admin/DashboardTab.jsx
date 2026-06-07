import { Users, Clock, CheckCircle, XCircle, UserCheck, FileText, Activity } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { Link } from '@inertiajs/react';

const statCards = [
    { key: 'total', label: 'Total Pendaftar', icon: Users, color: 'from-slate-600 to-slate-500', bg: 'bg-slate-100' },
    { key: 'baru', label: 'Pending Verification', icon: Clock, color: 'from-blue-600 to-blue-500', bg: 'bg-blue-100' },
    { key: 'diproses', label: 'In Progress', icon: Activity, color: 'from-amber-600 to-amber-500', bg: 'bg-amber-100' },
    { key: 'selesai', label: 'Verified', icon: CheckCircle, color: 'from-emerald-600 to-emerald-500', bg: 'bg-emerald-100' },
    { key: 'accepted', label: 'Passed', icon: UserCheck, color: 'from-green-600 to-teal-500', bg: 'bg-green-100' },
    { key: 'rejected', label: 'Failed', icon: XCircle, color: 'from-red-600 to-rose-500', bg: 'bg-red-100' },
];

const processingStatusBadge = {
    baru: 'bg-blue-50 text-blue-700 ring-blue-300',
    diproses: 'bg-amber-50 text-amber-700 ring-amber-300',
    selesai: 'bg-emerald-50 text-emerald-700 ring-emerald-300',
};

const processingStatusLabels = {
    baru: 'Pending',
    diproses: 'In Progress',
    selesai: 'Verified',
};

export default function DashboardTab({ stats, paths, operatorActivity, recentActivities, activeYear }) {
    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {statCards.map((card) => {
                    const count = stats[card.key] || 0;
                    return (
                        <div key={card.key} className="group relative overflow-hidden rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5">
                            <div className={`absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-br ${card.color} opacity-5 transition-all group-hover:scale-150 group-hover:opacity-10`} />
                            <div className="relative">
                                <div className={`mb-3 inline-flex rounded-lg bg-gradient-to-br ${card.color} p-2.5 shadow-sm`}>
                                    <card.icon className="h-5 w-5 text-white" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{count}</p>
                                <p className="mt-0.5 text-sm text-gray-500">{card.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Active Year Status */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className={`px-6 py-5 ${activeYear?.is_active ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gradient-to-r from-gray-500 to-slate-500'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                <FileText className="h-6 w-6 text-white" />
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
                    </div>
                </div>
            </div>

            {/* Quota Monitoring */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">Monitoring Kuota</h3>
                        <p className="text-sm text-gray-500">Status kapasitas jalur pendaftaran</p>
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {paths.map((path) => {
                        const pct = path.quota > 0 ? Math.round((path.total_registered / path.quota) * 100) : 0;
                        const isFull = pct >= 100;
                        const isWarning = pct >= 80 && !isFull;
                        const barColor = isFull ? 'bg-gradient-to-r from-red-500 to-red-400' : isWarning ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 'bg-gradient-to-r from-emerald-500 to-emerald-400';
                        const cardBorder = isFull ? 'border-red-200' : isWarning ? 'border-yellow-200' : 'border-emerald-200';
                        const iconBg = isFull ? 'bg-red-100 text-red-600' : isWarning ? 'bg-yellow-100 text-yellow-600' : 'bg-emerald-100 text-emerald-600';

                        return (
                            <div key={path.id} className={`group rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${cardBorder}`}>
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg} transition-colors`}>
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{path.name}</h3>
                                            <p className="text-xs text-gray-400">Jalur Pendaftaran</p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${isFull ? 'bg-red-50 text-red-700' : isWarning ? 'bg-yellow-50 text-yellow-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                        {path.total_registered}
                                        <span className="text-xs font-normal text-gray-400">/ {path.quota}</span>
                                    </span>
                                </div>
                                <div className="relative mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-100">
                                    <div className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">
                                        Sisa: <span className="font-medium text-gray-700">{path.available_quota}</span>
                                    </span>
                                    <span className={`font-medium ${isFull ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-emerald-600'}`}>{pct}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Operator Activity */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                    <h3 className="text-base font-semibold text-gray-900">Operator Activity</h3>
                    <p className="text-sm text-gray-500">Performa operator dalam memproses pendaftar</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead>
                            <tr className="bg-gray-50/80">
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Operator Name</th>
                                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Applicants Processed</th>
                                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Applicants Verified</th>
                                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Last Activity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {operatorActivity.map((op) => (
                                <tr key={op.id} className="transition-colors hover:bg-gray-50/50">
                                    <td className="whitespace-nowrap px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-green-100 text-xs font-semibold text-emerald-700">
                                                {op.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{op.name}</span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-4 text-center">
                                        <span className="text-sm font-semibold text-gray-900">{op.processed}</span>
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                                            <CheckCircle className="h-3.5 w-3.5" />
                                            {op.verified}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-4 text-right text-sm text-gray-400">
                                        {op.last_activity ? formatDateTime(op.last_activity) : '-'}
                                    </td>
                                </tr>
                            ))}
                            {operatorActivity.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-400">
                                        Belum ada data operator
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Activities */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                    <h3 className="text-base font-semibold text-gray-900">Recent Activities</h3>
                    <p className="text-sm text-gray-500">Aktivitas terbaru dalam sistem</p>
                </div>
                <div className="divide-y divide-gray-50">
                    {recentActivities.map((act) => (
                        <div key={act.id} className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-gray-50/50">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-purple-100 text-xs font-semibold text-violet-700">
                                {(act.user_name || '?').charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-gray-900">
                                    <span className="font-semibold">{act.user_name}</span>
                                    {' '}{act.description || act.action}
                                </p>
                                <p className="mt-0.5 text-xs text-gray-400">{formatDateTime(act.created_at)}</p>
                            </div>
                        </div>
                    ))}
                    {recentActivities.length === 0 && (
                        <div className="px-6 py-12 text-center text-sm text-gray-400">
                            Belum ada aktivitas
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
