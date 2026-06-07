import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { LayoutDashboard, Search, Award, Megaphone } from 'lucide-react';
import DashboardTab from '@/Components/admin/DashboardTab';
import MonitoringTab from '@/Components/admin/MonitoringTab';
import AnnouncementTab from '@/Components/admin/AnnouncementTab';

const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'monitoring', label: 'Monitoring', icon: Search },
    { id: 'selection', label: 'Selection', icon: Award },
    { id: 'announcement', label: 'Announcement', icon: Megaphone },
];

export default function Workspace({
    activeYear,
    dashboardStats,
    paths,
    operatorActivity,
    recentActivities,
    monitoring,
    selectionData,
    announcement,
}) {
    const [activeTab, setActiveTab] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('tab') || 'dashboard';
    });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200">
                        <LayoutDashboard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Admin Workspace</h2>
                        <p className="text-sm text-gray-500">Panel monitoring, seleksi, dan pengumuman PPDB</p>
                    </div>
                </div>
            }
        >
            <Head title="Admin Workspace" />

            <div className="py-6">
                {/* Tab Navigation */}
                <div className="mb-6 flex gap-1 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-sm">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    const params = new URLSearchParams(window.location.search);
                                    params.set('tab', tab.id);
                                    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
                                }}
                                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-200'
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="min-h-[500px]">
                    {activeTab === 'dashboard' && (
                        <DashboardTab
                            stats={dashboardStats}
                            paths={paths}
                            operatorActivity={operatorActivity}
                            recentActivities={recentActivities}
                            activeYear={activeYear}
                        />
                    )}

                    {activeTab === 'monitoring' && (
                        <MonitoringTab
                            registrations={monitoring.registrations}
                            operators={monitoring.operators}
                            filters={monitoring.filters}
                            activeYear={activeYear}
                            paths={paths}
                        />
                    )}

                    {activeTab === 'selection' && (
                        <div className="space-y-6">
                            {/* Selection Dashboard */}
                            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                <h3 className="mb-1 text-base font-semibold text-gray-900">Selection Dashboard</h3>
                                <p className="mb-5 text-sm text-gray-500">Quota dan status per jalur pendaftaran</p>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {selectionData.paths.map((p) => {
                                        const pct = p.quota > 0 ? Math.round((p.accepted / p.quota) * 100) : 0;
                                        const isFull = pct >= 100;
                                        return (
                                            <div key={p.id} className={`rounded-xl border p-4 ${isFull ? 'border-red-200 bg-red-50/30' : 'border-gray-100 bg-gray-50/30'}`}>
                                                <div className="mb-3 flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-gray-900">{p.name}</span>
                                                    <span className={`text-xs font-medium ${isFull ? 'text-red-600' : 'text-gray-500'}`}>
                                                        {p.accepted}/{p.quota}
                                                    </span>
                                                </div>
                                                <div className="mb-1 h-2 rounded-full bg-gray-200">
                                                    <div className={`h-full rounded-full transition-all ${isFull ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                                                </div>
                                                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                                                    <div className="rounded-lg bg-blue-50 p-2">
                                                        <span className="block font-semibold text-blue-700">{p.verified}</span>
                                                        <span className="text-blue-500">Verified</span>
                                                    </div>
                                                    <div className="rounded-lg bg-green-50 p-2">
                                                        <span className="block font-semibold text-green-700">{p.accepted}</span>
                                                        <span className="text-green-500">Accepted</span>
                                                    </div>
                                                    <div className="rounded-lg bg-amber-50 p-2">
                                                        <span className="block font-semibold text-amber-700">{p.remaining}</span>
                                                        <span className="text-amber-500">Remaining</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Ranking Table */}
                            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
                                    <h3 className="text-base font-semibold text-gray-900">Ranking</h3>
                                    <div className="flex items-center gap-3">
                                        <select
                                            value={selectionData.filters.path}
                                            onChange={(e) => {
                                                const params = new URLSearchParams(window.location.search);
                                                params.set('selection_path', e.target.value);
                                                params.delete('selection_status');
                                                params.set('tab', 'selection');
                                                const data = Object.fromEntries(params.entries());
                                                router.get(route('admin.workspace'), data, {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                });
                                            }}
                                            className="rounded-lg border border-gray-200 py-1.5 pl-3 pr-8 text-sm text-gray-700"
                                        >
                                            <option value="">Semua Jalur</option>
                                            {selectionData.paths.map((p) => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={selectionData.filters.status}
                                            onChange={(e) => {
                                                const params = new URLSearchParams(window.location.search);
                                                params.set('selection_status', e.target.value);
                                                params.set('tab', 'selection');
                                                const data = Object.fromEntries(params.entries());
                                                router.get(route('admin.workspace'), data, {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                });
                                            }}
                                            className="rounded-lg border border-gray-200 py-1.5 pl-3 pr-8 text-sm text-gray-700"
                                        >
                                            <option value="">Semua Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="reserve">Reserve</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        <button
                                            onClick={() => {
                                                if (confirm('Generate ranking ini akan menentukan status kelulusan berdasarkan nilai tertinggi. Lanjutkan?')) {
                                                    router.post(route('admin.selection.generate'), {}, {
                                                        preserveScroll: true,
                                                    });
                                                }
                                            }}
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-violet-700 hover:to-purple-700 transition-all active:scale-[0.98]"
                                        >
                                            <Award className="h-4 w-4" />
                                            Generate Ranking
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead>
                                            <tr className="bg-gray-50/80">
                                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Rank</th>
                                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nama</th>
                                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Jalur</th>
                                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Total Nilai</th>
                                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {selectionData.rankings.data.map((reg, idx) => {
                                                const rank = selectionData.rankings.from + idx;
                                                const statusConfig = {
                                                    accepted: 'bg-emerald-50 text-emerald-700 ring-emerald-300',
                                                    reserve: 'bg-amber-50 text-amber-700 ring-amber-300',
                                                    rejected: 'bg-red-50 text-red-700 ring-red-300',
                                                    pending: 'bg-blue-50 text-blue-700 ring-blue-300',
                                                    draft: 'bg-gray-100 text-gray-700 ring-gray-300',
                                                };
                                                const statusLabels = {
                                                    accepted: 'Passed',
                                                    reserve: 'Reserve',
                                                    rejected: 'Failed',
                                                    pending: 'Pending',
                                                    draft: 'Draft',
                                                };
                                                const st = statusConfig[reg.status] || statusConfig.draft;
                                                return (
                                                    <tr key={reg.id} className="transition-colors hover:bg-gray-50/50">
                                                        <td className="whitespace-nowrap px-5 py-4">
                                                            <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                                                                rank <= 3 ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white' : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                                {rank}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-5 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-purple-100 text-xs font-semibold text-violet-700">
                                                                    {(reg.student_biodata?.full_name || reg.user?.name || '?').charAt(0).toUpperCase()}
                                                                </div>
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {reg.student_biodata?.full_name || reg.user?.name}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                                                            {reg.admission_path?.name}
                                                        </td>
                                                        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-900">
                                                            {reg.total_score ?? '-'}
                                                        </td>
                                                        <td className="whitespace-nowrap px-5 py-4">
                                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${st}`}>
                                                                {statusLabels[reg.status] || reg.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {selectionData.rankings.data.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-16 text-center">
                                                        <p className="text-sm font-medium text-gray-900">Belum ada data ranking</p>
                                                        <p className="mt-1 text-xs text-gray-400">Generate ranking untuk melihat hasil seleksi</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Rankings Pagination */}
                                {selectionData.rankings.last_page > 1 && (
                                    <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/30 px-6 py-4">
                                        <div className="text-sm text-gray-500">
                                            Menampilkan {selectionData.rankings.from}-{selectionData.rankings.to} dari {selectionData.rankings.total}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {selectionData.rankings.links.slice(1, -1).map((link, i) => {
                                                if (link.label === '...') {
                                                    return <span key={i} className="px-2 py-2 text-sm text-gray-400">...</span>;
                                                }
                                                return link.active ? (
                                                    <span key={i} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-sm font-semibold text-white shadow-sm">{link.label}</span>
                                                ) : (
                                                    <Link key={i} href={link.url} preserveState className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900">{link.label}</Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'announcement' && (
                        <AnnouncementTab
                            registrations={announcement.registrations}
                            paths={announcement.paths}
                            stats={announcement.stats}
                            filters={announcement.filters}
                        />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
