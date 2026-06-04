import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ banners }) {
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        image: null,
        is_active: true,
    });

    function startCreate() {
        setEditing(null);
        reset();
    }

    function startEdit(banner) {
        setEditing(banner.id);
        setData({
            title: banner.title,
            image: null,
            is_active: banner.is_active,
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        const options = { preserveScroll: true, onSuccess: () => { setEditing(null); reset(); } };
        if (editing) {
            put(route('admin.pop-up-banners.update', editing), options);
        } else {
            post(route('admin.pop-up-banners.store'), options);
        }
    }

    function handleDelete(id) {
        if (confirm('Hapus banner ini?')) {
            router.delete(route('admin.pop-up-banners.destroy', id), { preserveScroll: true });
        }
    }

    function handleToggle(id) {
        router.patch(route('admin.pop-up-banners.toggle-active', id), { preserveScroll: true });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M10.875 12h2.25m-2.25 0a1.125 1.125 0 0 1-1.125 1.125M13.125 12c.621 0 1.125.504 1.125 1.125m-2.25 0v1.5c0 .621.504 1.125 1.125 1.125m-3.75-7.5h7.5" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Pop Up Banner</h2>
                        <p className="text-sm text-gray-500">Atur banner pop up untuk landing page</p>
                    </div>
                </div>
            }
        >
            <Head title="Pop Up Banner" />

            <div className="py-8">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-semibold text-gray-900">
                                    {editing ? 'Edit Banner' : 'Tambah Banner Baru'}
                                </h3>
                                {editing && (
                                    <button onClick={startCreate} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition hover:bg-gray-100 hover:border-gray-300">
                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        Batal
                                    </button>
                                )}
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Judul Banner</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                                        placeholder="Contoh: Selamat Datang di PPDB"
                                        required
                                    />
                                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Gambar Banner</label>
                                    <p className="mt-0.5 text-xs text-gray-400">PNG/JPG, maks 2MB</p>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg"
                                        onChange={(e) => setData('image', e.target.files[0])}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
                                    />
                                    {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                                </div>

                                <div className="flex items-center gap-2.5">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="rounded-lg border-gray-300 text-emerald-600 shadow-sm focus:ring-emerald-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Aktif</span>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:from-emerald-700 hover:to-teal-700 hover:shadow-md disabled:opacity-50"
                                >
                                    {editing ? 'Simpan Perubahan' : 'Tambah Banner'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                            <h3 className="text-base font-semibold text-gray-900">Daftar Banner</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Judul</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Gambar</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {banners.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400">
                                                Belum ada banner.
                                            </td>
                                        </tr>
                                    ) : (
                                        banners.map((banner) => (
                                            <tr key={banner.id} className="transition-colors hover:bg-gray-50/50">
                                                <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-900">
                                                    {banner.title}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    {banner.image ? (
                                                        <img
                                                            src={`/storage/${banner.image}`}
                                                            className="h-12 w-20 rounded-lg border border-gray-200 object-cover"
                                                            alt={banner.title}
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${banner.is_active ? 'bg-emerald-50 text-emerald-700 ring-emerald-300' : 'bg-gray-100 text-gray-500 ring-gray-300'}`}>
                                                        {banner.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleToggle(banner.id)}
                                                            className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium shadow-sm transition ${
                                                                banner.is_active
                                                                    ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-300'
                                                                    : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300'
                                                            }`}
                                                        >
                                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={banner.is_active ? 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636' : 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'} /></svg>
                                                            {banner.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                        </button>
                                                        <button onClick={() => startEdit(banner)} className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-100 hover:border-emerald-300">
                                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                            Edit
                                                        </button>
                                                        <button onClick={() => handleDelete(banner.id)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 shadow-sm transition hover:bg-red-100 hover:border-red-300">
                                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
