import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Search, Award, Trophy, School, CheckCircle } from 'lucide-react';
import Toast from '@/Components/Toast';
import Pagination from '@/Components/Pagination';

const perPageOptions = [10, 25, 50, 100];

export default function Index({ madrasah, activeYear, paths = [], registrations, filters }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [activePathId, setActivePathId] = useState(filters.path || (paths.length > 0 ? paths[0].id : ''));
    const debounceRef = useRef(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get(route('announcement'), {
                path: activePathId,
                search,
                per_page: filters.per_page,
            }, { preserveState: true, preserveScroll: true });
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [search, activePathId]);

    function handlePathChange(pathId) {
        setActivePathId(pathId);
        setSearch('');
    }

    function handlePerPage(value) {
        router.get(route('announcement'), {
            path: activePathId,
            search,
            per_page: value,
        }, { preserveState: true, preserveScroll: true });
    }

    const isFirstLoad = !registrations.data;
    const meta = registrations?.meta || registrations;
    const data = registrations?.data || [];

    return (
        <>
            <Head title="Pengumuman Hasil Seleksi" />

            <div className="flex min-h-screen flex-col bg-gradient-to-br from-green-50 via-white to-emerald-50">
                {/* Header */}
                <header className="border-b border-green-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            {madrasah?.logo_path ? (
                                <img
                                    src={`/storage/${madrasah.logo_path}`}
                                    className="h-10 w-10 rounded-lg object-contain"
                                    alt="Logo"
                                />
                            ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-white font-bold text-lg">
                                    M
                                </div>
                            )}
                            <div>
                                <h1 className="text-lg font-bold text-green-800">
                                    {madrasah?.madrasah_name || 'PPDB Madrasah Aliyah'}
                                </h1>
                                <p className="text-xs text-green-600">Penerimaan Peserta Didik Baru</p>
                            </div>
                        </div>

                        <nav className="flex items-center gap-5">
                            <Link
                                href={route('welcome')}
                                className="text-sm font-medium text-green-700 transition hover:text-green-800"
                            >
                                Beranda
                            </Link>
                            <Link
                                href={route('announcement')}
                                className="text-sm font-bold text-green-800 border-b-2 border-green-650 pb-0.5"
                            >
                                Pengumuman
                            </Link>
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-medium text-green-700 transition hover:text-green-800"
                                    >
                                        Masuk
                                    </Link>
                                    {activeYear && (
                                        <Link
                                            href={route('register')}
                                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                                        >
                                            Daftar Akun
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="flex-1">
                    {/* Hero Section */}
                    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/10">
                            Hasil Kelulusan Seleksi PPDB
                        </span>
                        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-green-950 sm:text-4xl">
                            Pengumuman Kelulusan Calon Siswa
                        </h2>
                        <p className="mt-2 text-base text-green-700 max-w-2xl mx-auto">
                            Tahun Ajaran {activeYear?.name || '-'}. Selamat kepada seluruh calon peserta didik yang dinyatakan lulus seleksi.
                        </p>
                    </section>

                    {/* Table and Filter Card */}
                    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-green-150/10">
                            
                            {/* Path Tabs Navigation */}
                            {paths.length > 0 ? (
                                <div className="flex flex-wrap gap-2 border-b border-gray-100 bg-gray-50/50 p-4">
                                    {paths.map((path) => {
                                        const isActive = activePathId === path.id;
                                        return (
                                            <button
                                                key={path.id}
                                                onClick={() => handlePathChange(path.id)}
                                                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                                                    isActive
                                                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md shadow-emerald-150'
                                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                                }`}
                                            >
                                                <Award className="h-4 w-4" />
                                                {path.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    Tidak ada jalur pendaftaran aktif.
                                </div>
                            )}

                            {/* Search and per_page bar */}
                            {paths.length > 0 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 bg-white px-6 py-4">
                                    <div className="relative w-full sm:w-80">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Cari nama, NISN..."
                                            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 shadow-sm transition placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <label className="whitespace-nowrap text-sm text-gray-600">Tampilkan</label>
                                        <select
                                            value={filters.per_page || 25}
                                            onChange={(e) => handlePerPage(e.target.value)}
                                            className="rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-gray-700 shadow-sm transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                                        >
                                            {perPageOptions.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Total: <span className="text-emerald-600 font-bold text-sm">{meta?.total ?? 0}</span> siswa
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Main Table */}
                            {paths.length > 0 && (
                                <div className="overflow-x-auto min-h-[300px]">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead>
                                            <tr className="bg-gray-50/50">
                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 w-20">Peringkat</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">No. Pendaftaran</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">NISN</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nama Lengkap</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Asal Sekolah</th>
                                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Total Nilai</th>
                                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 bg-white">
                                            {(data.length > 0 ? data : []).map((reg, idx) => {
                                                const rank = (meta.current_page - 1) * (filters.per_page || 25) + idx + 1;
                                                return (
                                                    <tr key={reg.id} className="transition-colors hover:bg-gray-50/30">
                                                        <td className="whitespace-nowrap px-6 py-4">
                                                            {rank <= 3 ? (
                                                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-white font-extrabold text-sm shadow-sm">
                                                                    <Trophy className="h-4 w-4 mr-0.5" />
                                                                    {rank}
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-bold text-xs">
                                                                    {rank}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-mono font-bold text-gray-700">
                                                            #{reg.id}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-600">
                                                            {reg.nisn}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-green-150 text-xs font-bold text-emerald-800">
                                                                    {(reg.name || '?').charAt(0).toUpperCase()}
                                                                </div>
                                                                <span className="text-sm font-bold text-gray-900">
                                                                    {reg.name}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                            <div className="flex items-center gap-1.5">
                                                                <School className="h-4 w-4 text-gray-400 shrink-0" />
                                                                <span>{reg.previous_school}</span>
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-extrabold text-green-700">
                                                            {reg.total_score ?? '-'}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-center">
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                                <CheckCircle className="h-3 w-3 text-emerald-600" />
                                                                Diterima
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {data.length === 0 && (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-16 text-center">
                                                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                                                            <Award className="h-7 w-7 text-gray-300" />
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {filters.search ? 'Tidak ada hasil seleksi ditemukan' : 'Belum ada pendaftar yang dinyatakan lulus'}
                                                        </p>
                                                        {filters.search && (
                                                            <p className="mt-1 text-xs text-gray-400">Coba ubah kata kunci pencarian Anda</p>
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination and per_page */}
                            {data.length > 0 && (
                                <Pagination meta={meta} color="emerald" />
                            )}
                        </div>
                    </section>
                </main>

                <footer className="border-t border-green-100 bg-white py-8 text-center text-sm text-green-600 mt-auto">
                    &copy; {new Date().getFullYear()} PPDB {madrasah?.madrasah_name || 'Madrasah Aliyah'}. All rights reserved.
                </footer>
            </div>
            <Toast />
        </>
    );
}
