import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ScrollToTop from '@/Components/ScrollToTop';
import Toast from '@/Components/Toast';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const icons = {
    'Dashboard': 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    'Setting': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    'Tahun Ajaran': 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    'Pengaturan Madrasah': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    'Jalur Pendaftaran': 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z',
    'Mata Pelajaran': 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    'Jadwal Kegiatan': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    'Persyaratan & Alur': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    'Pop Up Banner': 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    'Pendaftar': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    'Verifikasi': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    'Pengumuman': 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z',
    'Workspace': 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
    'Per Jalur': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    'Pengguna': 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    'Tipe Dokumen': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    'Backup & Restore': 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4'
};

export default function AuthenticatedLayout({ header, children, wide = false }) {
    const user = usePage().props.auth.user;
    const { madrasah_setting } = usePage().props;

    // Manage sidebar responsive states
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const adminNav = [
        { type: 'link', name: 'Dashboard', href: route('dashboard'), routeName: 'dashboard' },
        { type: 'link', name: 'Workspace', href: route('admin.workspace'), routeName: 'admin.workspace' },
        {
            type: 'group', name: 'Setting', children: [
                { name: 'Tahun Ajaran', href: route('admin.academic-years.index'), routeName: 'admin.academic-years.*' },
                { name: 'Pengaturan Madrasah', href: route('admin.madrasah-settings.edit'), routeName: 'admin.madrasah-settings.edit' },
                { name: 'Jalur Pendaftaran', href: route('admin.admission-paths.index'), routeName: 'admin.admission-paths.*' },
                { name: 'Mata Pelajaran', href: route('admin.subjects.index'), routeName: 'admin.subjects.*' },
                { name: 'Jadwal Kegiatan', href: route('admin.activity-schedules.index'), routeName: 'admin.activity-schedules.*' },
                { name: 'Persyaratan & Alur', href: route('admin.activity-requirements.index'), routeName: 'admin.activity-requirements.*' },
                { name: 'Pop Up Banner', href: route('admin.pop-up-banners.index'), routeName: 'admin.pop-up-banners.*' },
                { name: 'Tipe Dokumen', href: route('admin.document-types.index'), routeName: 'admin.document-types.*' },
                { name: 'Backup & Restore', href: route('admin.backups.index'), routeName: 'admin.backups.*' },
                { type: 'link', name: 'Pengguna', href: route('admin.users.index'), routeName: 'admin.users.*' }
            ]
        }

    ];

    const operatorNav = [
        { type: 'link', name: 'Dashboard', href: route('operator.dashboard'), routeName: 'operator.dashboard' },
        { type: 'link', name: 'Pendaftar', href: route('operator.registrations.index'), routeName: 'operator.registrations.*' },
    ];

    const kepsekNav = [
        { type: 'link', name: 'Dashboard', href: route('dashboard'), routeName: 'dashboard' },
    ];

    const navItems = user.role === 'admin'
        ? adminNav
        : user.role === 'operator'
            ? operatorNav
            : user.role === 'kepala_madrasah'
                ? kepsekNav
                : [];

    const isSettingActive = (children) => children.some((c) => route().current(c.routeName));

    const [settingsOpen, setSettingsOpen] = useState(() => {
        const hasSettingActive = adminNav.find(n => n.name === 'Setting')?.children.some(c => route().current(c.routeName));
        return !!hasSettingActive;
    });

    // Close sidebar overlay on mobile navigation change
    useEffect(() => {
        setSidebarOpen(false);
    }, [route().current()]);

    const toggleSidebar = () => {
        if (window.innerWidth >= 768) {
            setSidebarCollapsed(!sidebarCollapsed);
        } else {
            setSidebarOpen(!sidebarOpen);
        }
    };

    const userRoleLabels = {
        admin: 'Administrator',
        operator: 'Operator PPDB',
        kepala_madrasah: 'Kepala Madrasah'
    };

    return (
        <div className="min-h-screen bg-[#f4f6f9] font-sans antialiased text-gray-800 flex">
            {/* Mobile Sidebar Backdrop overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
                />
            )}

            {/* Sidebar (AdminLTE style dark panel) */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-40 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-950 w-64 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } ${sidebarCollapsed ? 'md:-translate-x-full' : 'md:translate-x-0'
                    }`}
            >
                {/* Brand Header */}
                <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-800 bg-slate-950/40">
                    <Link href="/" className="flex items-center gap-3 shrink-0 min-w-0">
                        {madrasah_setting?.logo_path ? (
                            <img
                                src={`/storage/${madrasah_setting.logo_path}`}
                                alt={madrasah_setting.madrasah_name || 'Logo'}
                                className="h-9 w-9 rounded-lg object-contain shrink-0"
                            />
                        ) : (
                            <ApplicationLogo className="block h-9 w-auto fill-current text-emerald-500" />
                        )}
                        <span className="text-white font-bold text-sm tracking-wide transition-opacity duration-200 truncate">
                            {madrasah_setting?.madrasah_name || 'PPDB REV'}
                        </span>
                    </Link>
                </div>

                {/* User Profile Panel */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-850">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-sm shadow-md">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-white truncate leading-snug">{user.name}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[11px] font-medium text-slate-400 truncate">
                                {userRoleLabels[user.role] || user.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
                        MENU UTAMA
                    </div>
                    {navItems.map((item) => {
                        if (item.type === 'link') {
                            const active = route().current(item.routeName);
                            return (
                                <Link
                                    key={item.routeName}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${active
                                        ? 'bg-emerald-600 text-white font-medium shadow-md shadow-emerald-950/20'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`}
                                >
                                    <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icons[item.name]} />
                                    </svg>
                                    <span>{item.name}</span>
                                </Link>
                            );
                        }

                        if (item.type === 'group') {
                            const active = isSettingActive(item.children);
                            return (
                                <div key={item.name} className="space-y-1">
                                    <button
                                        onClick={() => setSettingsOpen(!settingsOpen)}
                                        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${active
                                            ? 'text-white bg-slate-800/40 font-medium'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icons[item.name]} />
                                            </svg>
                                            <span>{item.name}</span>
                                        </div>
                                        <svg
                                            className={`h-3.5 w-3.5 transition-transform duration-200 ${settingsOpen ? 'rotate-180' : ''}`}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div
                                        className={`pl-4 overflow-hidden transition-all duration-300 ${settingsOpen ? 'max-h-[400px] opacity-100 mt-1' : 'max-h-0 opacity-0 pointer-events-none'
                                            }`}
                                    >
                                        <div className="border-l border-slate-800 pl-2 space-y-0.5 py-1">
                                            {item.children.map((child) => {
                                                const childActive = route().current(child.routeName);
                                                return (
                                                    <Link
                                                        key={child.routeName}
                                                        href={child.href}
                                                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs transition ${childActive
                                                            ? 'text-emerald-400 bg-emerald-500/10 font-semibold'
                                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                                            }`}
                                                    >
                                                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icons[child.name] || 'M12 6v6m0 0v6m0-6h6m-6 0H6'} />
                                                        </svg>
                                                        <span>{child.name}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}
                </nav>

                {/* Footer Brand Info */}
                <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 text-center">
                    PPDB REV v1.0.0
                </div>
            </aside>

            {/* Content Wrapper */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'md:pl-0' : 'md:pl-64'
                }`}>
                {/* Top Header Navbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4">
                        {/* Sidebar Toggle Button */}
                        <button
                            onClick={toggleSidebar}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Right Navbar Dropdown (User action) */}
                    <div className="flex items-center gap-3">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none"
                                >
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden sm:inline">{user.name}</span>
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>
                                    Profile Settings
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                >
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Content Header Title */}
                {header && (
                    <div className="bg-white border-b border-gray-100 py-5 px-4 sm:px-6 shadow-sm">
                        <div className="max-w-7xl mx-auto">
                            {header}
                        </div>
                    </div>
                )}

                {/* Main Content Body */}
                <main className={`flex-1 w-full mx-auto px-4 sm:px-6 py-6 ${wide ? 'max-w-full' : 'max-w-7xl'}`}>
                    <div className="animate-fade-in">
                        {children}
                    </div>
                </main>

                {/* Footer (AdminLTE style) */}
                <footer className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
                    <div>
                        <strong>Copyright &copy; 2026 <span className="text-emerald-600">PPDB Rev</span>.</strong> All rights reserved.
                    </div>
                    <div className="mt-1 sm:mt-0 font-medium">
                        Version 1.0.0
                    </div>
                </footer>
            </div>

            <Toast />
            <ScrollToTop />
        </div>
    );
}
