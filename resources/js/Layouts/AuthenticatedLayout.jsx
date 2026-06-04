import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Toast from '@/Components/Toast';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const icons = {
    'Tahun Ajaran': 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    'Pengaturan Madrasah': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    'Jalur Pendaftaran': 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z',
    'Mata Pelajaran': 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    'Jadwal Kegiatan': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    'Persyaratan & Alur': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    'Pop Up Banner': 'M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M10.875 12h2.25m-2.25 0a1.125 1.125 0 0 1-1.125 1.125M13.125 12c.621 0 1.125.504 1.125 1.125m-2.25 0v1.5c0 .621.504 1.125 1.125 1.125m-3.75-7.5h7.5',
};

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const adminNav = [
        { type: 'link', name: 'Dashboard', href: route('dashboard'), routeName: 'dashboard' },
        { type: 'group', name: 'Setting', children: [
            { name: 'Tahun Ajaran', href: route('admin.academic-years.index'), routeName: 'admin.academic-years.*' },
            { name: 'Pengaturan Madrasah', href: route('admin.madrasah-settings.edit'), routeName: 'admin.madrasah-settings.edit' },
            { name: 'Jalur Pendaftaran', href: route('admin.admission-paths.index'), routeName: 'admin.admission-paths.*' },
            { name: 'Mata Pelajaran', href: route('admin.subjects.index'), routeName: 'admin.subjects.*' },
            { name: 'Jadwal Kegiatan', href: route('admin.activity-schedules.index'), routeName: 'admin.activity-schedules.*' },
            { name: 'Persyaratan & Alur', href: route('admin.activity-requirements.index'), routeName: 'admin.activity-requirements.*' },
            { name: 'Pop Up Banner', href: route('admin.pop-up-banners.index'), routeName: 'admin.pop-up-banners.*' },
        ]},
        { type: 'link', name: 'Pendaftar', href: route('admin.registrations.index'), routeName: 'admin.registrations.*' },
        { type: 'link', name: 'Per Jalur', href: route('admin.registrations.by-path'), routeName: 'admin.registrations.by-path' },
        { type: 'link', name: 'Pengguna', href: route('admin.users.index'), routeName: 'admin.users.*' },
    ];

    const operatorNav = [
        { type: 'link', name: 'Dashboard', href: route('dashboard'), routeName: 'dashboard' },
        { type: 'link', name: 'Pendaftar', href: route('admin.registrations.index'), routeName: 'admin.registrations.*' },
        { type: 'link', name: 'Per Jalur', href: route('admin.registrations.by-path'), routeName: 'admin.registrations.by-path' },
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

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="border-b border-gray-200 bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-1 sm:-my-px sm:ms-10 sm:flex sm:items-center">
                                {navItems.map((item) => {
                                    if (item.type === 'link') {
                                        return (
                                            <NavLink
                                                key={item.routeName}
                                                href={item.href}
                                                active={route().current(item.routeName)}
                                            >
                                                {item.name}
                                            </NavLink>
                                        );
                                    }

                                    if (item.type === 'group') {
                                        const active = isSettingActive(item.children);
                                        return (
                                            <div key={item.name} className="group relative">
                                                <button
                                                    className={`inline-flex items-center gap-1 border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition ${
                                                        active
                                                            ? 'border-emerald-500 text-gray-900'
                                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                                    }`}
                                                >
                                                    {item.name}
                                                    <svg className={`h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                                <div className="invisible absolute left-0 z-50 mt-1 w-56 translate-y-1 rounded-2xl bg-white/95 shadow-xl shadow-gray-200/50 ring-1 ring-gray-100 backdrop-blur-sm transition-all duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 opacity-0">
                                                    <div className="overflow-hidden rounded-2xl py-1.5">
                                                        {item.children.map((child) => {
                                                            const childActive = route().current(child.routeName);
                                                            return (
                                                                <Link
                                                                    key={child.routeName}
                                                                    href={child.href}
                                                                    className={`flex items-center gap-3 border-l-2 px-4 py-2.5 text-sm transition ${
                                                                        childActive
                                                                            ? 'border-emerald-500 bg-emerald-50 font-semibold text-emerald-700'
                                                                            : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                                                                    }`}
                                                                >
                                                                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                                                                        childActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                                                                    }`}>
                                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icons[child.name] || 'M12 6v6m0 0v6m0-6h6m-6 0H6'} />
                                                                        </svg>
                                                                    </span>
                                                                    {child.name}
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
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
                                            >
                                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-xs font-bold text-white">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                {user.name}
                                                <svg
                                                    className="h-4 w-4 text-gray-400"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
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
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Nav */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        {navItems.map((item) => {
                            if (item.type === 'link') {
                                return (
                                    <ResponsiveNavLink key={item.routeName} href={item.href} active={route().current(item.routeName)}>
                                        {item.name}
                                    </ResponsiveNavLink>
                                );
                            }

                            if (item.type === 'group') {
                                const active = isSettingActive(item.children);
                                return (
                                    <div key={item.name}>
                                        <button
                                            onClick={() => setSettingsOpen(!settingsOpen)}
                                            className={`flex w-full items-center justify-between border-l-4 px-4 py-2 text-base font-medium transition ${
                                                active
                                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                    : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
                                            }`}
                                        >
                                            {item.name}
                                            <svg
                                                className={`h-4 w-4 transition-transform duration-200 ${settingsOpen ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        <div
                                            className={`overflow-hidden transition-all duration-200 ${
                                                settingsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                        >
                                            {item.children.map((child) => {
                                                const childActive = route().current(child.routeName);
                                                return (
                                                    <Link
                                                        key={child.routeName}
                                                        href={child.href}
                                                        onClick={() => setShowingNavigationDropdown(false)}
                                                        className={`flex items-center gap-3 border-l-[6px] py-2 pe-4 ps-10 text-sm transition ${
                                                            childActive
                                                                ? 'border-emerald-500 bg-emerald-50 font-semibold text-emerald-700'
                                                                : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
                                                        }`}
                                                    >
                                                        <span className={`flex h-6 w-6 items-center justify-center rounded-md ${
                                                            childActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                                                        }`}>
                                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icons[child.name]} />
                                                            </svg>
                                                        </span>
                                                        {child.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            }

                            return null;
                        })}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">{user.name}</div>
                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">Log Out</ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="border-b border-gray-100 bg-white shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
            <Toast />
        </div>
    );
}
