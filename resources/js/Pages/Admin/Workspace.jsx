import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { LayoutDashboard, Search, Award, Megaphone } from 'lucide-react';
import DashboardTab from '@/Components/admin/DashboardTab';
import MonitoringTab from '@/Components/admin/MonitoringTab';
import SelectionTab from '@/Components/admin/SelectionTab';
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
                        <SelectionTab selectionData={selectionData} />
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
