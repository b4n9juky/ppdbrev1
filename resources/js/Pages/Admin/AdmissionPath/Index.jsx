import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ paths }) {
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
        quota: '',
        is_active: true,
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (editing) {
            put(route('admin.admission-paths.update', editing), {
                preserveScroll: true,
                onSuccess: () => { reset(); setEditing(null); },
            });
        } else {
            post(route('admin.admission-paths.store'), {
                preserveScroll: true,
                onSuccess: () => reset(),
            });
        }
    }

    function handleEdit(path) {
        setEditing(path.id);
        setData({
            name: path.name,
            description: path.description || '',
            quota: path.quota,
            is_active: path.is_active,
        });
    }

    function handleDelete(id) {
        if (confirm('Hapus jalur pendaftaran ini?')) {
            router.delete(route('admin.admission-paths.destroy', id));
        }
    }

    function handleCancel() {
        reset();
        setEditing(null);
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Jalur Pendaftaran</h2>
                        <p className="text-sm text-gray-500">Kelola jalur dan kuota pendaftaran</p>
                    </div>
                </div>
            }
        >
            <Head title="Jalur Pendaftaran" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-4">
                            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                                <svg className="h-5 w-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={editing ? 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' : 'M12 6v6m0 0v6m0-6h6m-6 0H6'} />
                                </svg>
                                {editing ? 'Edit Jalur' : 'Tambah Jalur Baru'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="px-6 py-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nama Jalur</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Kuota</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.quota}
                                        onChange={(e) => setData('quota', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                                    />
                                    {errors.quota && <p className="mt-1 text-sm text-red-600">{errors.quota}</p>}
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={2}
                                    className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded border-gray-300 text-emerald-600 shadow-sm focus:ring-emerald-500"
                                />
                                <label htmlFor="is_active" className="text-sm text-gray-700">Aktif</label>
                            </div>
                            <div className="mt-5 flex gap-2">
                                <Button type="submit" disabled={processing} className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-sm shadow-emerald-200">
                                    {editing ? 'Update' : 'Simpan'}
                                </Button>
                                {editing && (
                                    <Button type="button" variant="outline" onClick={handleCancel} className="border-gray-200 text-gray-600 hover:bg-gray-50">
                                        Batal
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                            <h3 className="text-base font-semibold text-gray-900">Daftar Jalur</h3>
                        </div>
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nama</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Kuota</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paths.map((path) => (
                                    <tr key={path.id} className="transition-colors hover:bg-gray-50/50">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{path.name}</div>
                                            {path.description && (
                                                <div className="text-sm text-gray-500">{path.description}</div>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{path.quota}</td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${path.is_active ? 'bg-emerald-50 text-emerald-700 ring-emerald-300' : 'bg-gray-100 text-gray-700 ring-gray-300'}`}>
                                                {path.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                            <button onClick={() => handleEdit(path)} className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-100 hover:border-emerald-300">
                                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(path.id)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 shadow-sm transition hover:bg-red-100 hover:border-red-300 ml-1">
                                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {paths.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400">
                                            Belum ada jalur pendaftaran
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
