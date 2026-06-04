import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Form({ user }) {
    const isEditing = !!user;

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'student',
        password: '',
        password_confirmation: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.users.update', user.id), { preserveScroll: true });
        } else {
            post(route('admin.users.store'), { preserveScroll: true });
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg shadow-purple-200">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Pengguna' : 'Tambah Pengguna'}</h2>
                        <p className="text-sm text-gray-500">{isEditing ? 'Ubah data pengguna' : 'Buat akun pengguna baru'}</p>
                    </div>
                </div>
            }
        >
            <Head title={isEditing ? 'Edit Pengguna' : 'Tambah Pengguna'} />

            <div className="py-8">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-purple-400 focus:ring-purple-400"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-purple-400 focus:ring-purple-400"
                                    required
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-purple-400 focus:ring-purple-400"
                                >
                                    <option value="student">Siswa</option>
                                    <option value="kepala_madrasah">Kepala Madrasah</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                            </div>

                            {!isEditing && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Password</label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-purple-400 focus:ring-purple-400"
                                            required={!isEditing}
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
                                            required={!isEditing}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                                <Link
                                    href={route('admin.users.index')}
                                    className="text-sm font-medium text-gray-500 hover:text-gray-700"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm shadow-purple-200 transition hover:from-purple-700 hover:to-violet-700 hover:shadow-md disabled:opacity-50"
                                >
                                    {isEditing ? 'Simpan Perubahan' : 'Tambah Pengguna'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
