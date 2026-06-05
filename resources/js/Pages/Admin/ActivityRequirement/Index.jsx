import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RichEditor from '@/Components/RichEditor';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ requirements, activeYear, academicYears }) {
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        academic_year_id: activeYear?.id || '',
        title: '',
        description: '',
        order: 0,
    });

    function startCreate() {
        setEditing(null);
        reset();
    }

    function startEdit(req) {
        setEditing(req.id);
        setData({
            academic_year_id: req.academic_year_id,
            title: req.title,
            description: req.description,
            order: req.order,
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        const options = { preserveScroll: true, onSuccess: () => { setEditing(null); reset(); } };
        if (editing) {
            put(route('admin.activity-requirements.update', editing), options);
        } else {
            post(route('admin.activity-requirements.store'), options);
        }
    }

    function handleDelete(id) {
        if (confirm('Hapus item ini?')) {
            router.delete(route('admin.activity-requirements.destroy', id), { preserveScroll: true });
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Persyaratan & Alur</h2>
                        <p className="text-sm text-gray-500">Atur syarat pendaftaran dan alur PPDB</p>
                    </div>
                </div>
            }
        >
            <Head title="Persyaratan & Alur" />

            <div className="py-8">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-semibold text-gray-900">
                                    {editing ? 'Edit Item' : 'Tambah Item Baru'}
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
                                    <label className="block text-sm font-medium text-gray-700">Judul</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                                        placeholder="Contoh: Syarat Pendaftaran, Alur Pendaftaran"
                                        required
                                    />
                                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                    <p className="mt-0.5 text-xs text-gray-400 font-normal">Gunakan editor untuk memformat deskripsi persyaratan atau alur.</p>
                                    <div className="mt-2">
                                        <RichEditor
                                            value={data.description}
                                            onChange={(html) => setData('description', html)}
                                            placeholder="Isi deskripsi persyaratan atau alur..."
                                        />
                                    </div>
                                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                </div>

                                <div className="flex gap-5">
                                    <div className="w-40">
                                        <label className="block text-sm font-medium text-gray-700">Urutan</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.order}
                                            onChange={(e) => setData('order', e.target.value)}
                                            className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Tahun Ajaran</label>
                                        <select
                                            value={data.academic_year_id}
                                            onChange={(e) => setData('academic_year_id', e.target.value)}
                                            className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                                        >
                                            {academicYears.map((y) => (
                                                <option key={y.id} value={y.id}>
                                                    {y.name} {y.is_active ? '(Aktif)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.academic_year_id && <p className="mt-1 text-sm text-red-600">{errors.academic_year_id}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:from-emerald-700 hover:to-teal-700 hover:shadow-md disabled:opacity-50"
                                >
                                    {editing ? 'Simpan Perubahan' : 'Tambah Item'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                            <h3 className="text-base font-semibold text-gray-900">Daftar Persyaratan & Alur</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">#</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Judul</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Deskripsi</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Tahun Ajaran</th>
                                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {requirements.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                                                Belum ada data persyaratan.
                                            </td>
                                        </tr>
                                    ) : (
                                        requirements.map((req, i) => (
                                            <tr key={req.id} className="transition-colors hover:bg-gray-50/50">
                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-400">{req.order}</td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                                                        {req.title}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-500 max-w-xs truncate" title={req.description ? req.description.replace(/<[^>]*>/g, '') : ''}>
                                                    {req.description ? req.description.replace(/<[^>]*>/g, '') : ''}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                                                    {req.academic_year?.name}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => startEdit(req)} className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-100 hover:border-emerald-300">
                                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                            Edit
                                                        </button>
                                                        <button onClick={() => handleDelete(req.id)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 shadow-sm transition hover:bg-red-100 hover:border-red-300">
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
