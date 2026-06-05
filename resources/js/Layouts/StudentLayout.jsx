import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import Toast from '@/Components/Toast';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const icons = {
    'Dashboard': 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    'Biodata': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    'Nilai': 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    'Dokumen': 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    'Cetak Bukti': 'M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z',
};

export default function StudentLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { madrasah_setting } = usePage().props;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const studentNav = [
        { name: 'Dashboard', href: route('student.dashboard'), routeName: 'student.dashboard' },
        { name: 'Biodata', href: route('student.biodata'), routeName: 'student.biodata' },
        { name: 'Nilai', href: route('student.scores.edit'), routeName: 'student.scores.*' },
        { name: 'Dokumen', href: route('student.documents'), routeName: 'student.documents' },
        { name: 'Cetak Bukti', href: route('student.print.proof'), routeName: 'student.print.*' },
    ];

    // Close sidebar on mobile navigation change
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
                className={`fixed top-0 bottom-0 left-0 z-40 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-950 w-64 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } ${
                    sidebarCollapsed ? 'md:-translate-x-full' : 'md:translate-x-0'
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
                            <ApplicationLogo className="block h-9 w-auto fill-current text-[#9AD872]" />
                        )}
                        <span className="text-white font-bold text-sm tracking-wide transition-opacity duration-200 truncate">
                            {madrasah_setting?.madrasah_name || 'SISWA PPDB'}
                        </span>
                    </Link>
                </div>

                {/* User Profile Panel */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-850">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#468432] to-[#9AD872] text-white font-bold text-sm shadow-md">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-white truncate leading-snug">{user.name}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#9AD872]" />
                            <span className="text-[11px] font-medium text-slate-400 truncate">
                                Calon Siswa
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
                        MENU SISWA
                    </div>
                    {studentNav.map((item) => {
                        const active = route().current(item.routeName);
                        const isPrint = item.name === 'Cetak Bukti';
                        const NavTag = isPrint ? 'a' : Link;
                        return (
                            <NavTag
                                key={item.routeName}
                                href={item.href}
                                target={isPrint ? "_blank" : undefined}
                                rel={isPrint ? "noopener noreferrer" : undefined}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                                    active 
                                        ? 'bg-[#468432] text-white font-medium shadow-md shadow-[#468432]/25' 
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                            >
                                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icons[item.name]} />
                                </svg>
                                <span>{item.name}</span>
                            </NavTag>
                        );
                    })}
                </nav>

                {/* Footer Brand Info */}
                <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 text-center">
                    PPDB SISWA v1.0.0
                </div>
            </aside>

            {/* Content Wrapper */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
                sidebarCollapsed ? 'md:pl-0' : 'md:pl-64'
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
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#468432] text-[10px] font-bold text-white shadow-sm">
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
                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
                    <div className="animate-fade-in">
                        {children}
                    </div>
                </main>

                {/* Footer (AdminLTE style) */}
                <footer className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
                    <div>
                        <strong>Copyright &copy; 2026 <span className="text-[#468432]">PPDB Madrasah</span>.</strong> All rights reserved.
                    </div>
                    <div className="mt-1 sm:mt-0 font-medium">
                        Version 1.0.0
                    </div>
                </footer>
            </div>
            
            <Toast />
        </div>
    );
}
