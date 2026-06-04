import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const roleConfig = {
    admin: { label: 'Admin', bg: 'bg-purple-50 text-purple-700 ring-purple-300' },
    operator: { label: 'Operator', bg: 'bg-indigo-50 text-indigo-700 ring-indigo-300' },
    kepala_madrasah: { label: 'Kepala Madrasah', bg: 'bg-emerald-50 text-emerald-700 ring-emerald-300' },
    student: { label: 'Siswa', bg: 'bg-blue-50 text-blue-700 ring-blue-300' },
};

export default function Index({ users, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [resetModal, setResetModal] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
        password_confirmation: '',
    });

    function handleSearch(e) {
        e.preventDefault();
        router.get(route('admin.users.index'), { search }, { preserveState: true });
    }

    function openReset(user) {
        setResetModal(user);
        reset();
    }

    function handleReset(e) {
        e.preventDefault();
        post(route('admin.users.reset-password', resetModal.id), {
            preserveScroll: true,
            onSuccess: () => {
                setResetModal(null);
                reset();
            },
        });
    }

    function handleDelete(user) {
        if (user.id === users.auth?.id) return;
        if (confirm(`Hapus pengguna "${user.name}"?`)) {
            router.delete(route('admin.users.destroy', user.id), { preserveScroll: true });
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg shadow-purple-200">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Pengguna</h2>
                        <p className="text-sm text-gray-500">Kelola akun pengguna sistem</p>
                    </div>
                </div>
            }
        >
            <Head title="Pengguna" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                            <h3 className="text-base font-semibold text-gray-900">Semua Pengguna</h3>
                            <div className="flex items-center gap-3">
                                <form onSubmit={handleSearch} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari nama atau email..."
                                        className="block w-56 rounded-xl border-gray-200 text-sm shadow-sm transition focus:border-purple-400 focus:ring-purple-400"
                                    />
                                    <button
                                        type="submit"
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-200 hover:border-gray-300"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                        Cari
                                    </button>
                                </form>
                                <Link
                                    href={route('admin.users.create')}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-purple-200 transition hover:from-purple-700 hover:to-violet-700 hover:shadow-md"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    Tambah Pengguna
                                </Link>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Pengguna</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Role</th>
                                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {users.data.map((user) => {
                                        const rc = roleConfig[user.role] || roleConfig.student;
                                        return (
                                            <tr key={user.id} className="transition-colors hover:bg-gray-50/50">
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-violet-100 text-sm font-bold text-purple-700">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">{user.email}</td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${rc.bg}`}>
                                                        {rc.label}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={route('admin.users.edit', user.id)} className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-100 hover:border-emerald-300">
                                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                            Edit
                                                        </Link>
                                                        <button onClick={() => openReset(user)} className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 shadow-sm transition hover:bg-amber-100 hover:border-amber-300">
                                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                            Reset Sandi
                                                        </button>
                                                        {user.id !== users.auth?.id && (
                                                            <button onClick={() => handleDelete(user)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 shadow-sm transition hover:bg-red-100 hover:border-red-300">
                                                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                                Hapus
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {users.data.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400">
                                                Tidak ada pengguna ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {users.total > users.per_page && (
                            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                                <div className="text-sm text-gray-500">
                                    Menampilkan {users.from}–{users.to} dari {users.total}
                                </div>
                                <div className="flex gap-1">
                                    {users.links.map((link, i) => {
                                        if (!link.url || link.label === '...') {
                                            return <span key={i} className="px-2 py-1 text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: link.label }} />;
                                        }
                                        return (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${link.active ? 'bg-purple-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                                preserveState
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reset Password Modal */}
            {resetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
                            <button onClick={() => setResetModal(null)} className="text-gray-400 hover:text-gray-600">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className="mb-4 text-sm text-gray-500">
                            Masukkan password baru untuk <span className="font-medium text-gray-700">{resetModal.name}</span>
                        </p>
                        <form onSubmit={handleReset} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password Baru</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-purple-400 focus:ring-purple-400"
                                    required
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-purple-400 focus:ring-purple-400"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setResetModal(null)}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-200 hover:border-gray-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-purple-700 hover:to-violet-700 disabled:opacity-50"
                                >
                                    Simpan Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
