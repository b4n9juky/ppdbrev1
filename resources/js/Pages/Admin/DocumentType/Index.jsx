import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Switch from '@/Components/Switch';

export default function Index({ types = [] }) {
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        code: '',
        name: '',
        is_required: false,
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (editing) {
            put(route('admin.document-types.update', editing), {
                preserveScroll: true,
                onSuccess: () => { reset(); setEditing(null); },
            });
        } else {
            post(route('admin.document-types.store'), {
                preserveScroll: true,
                onSuccess: () => reset(),
            });
        }
    }

    function handleEdit(type) {
        setEditing(type.id);
        setData({
            code: type.code,
            name: type.name,
            is_required: !!type.is_required,
        });
    }

    function handleDelete(id) {
        if (confirm('Hapus tipe dokumen ini?')) {
            router.delete(route('admin.document-types.destroy', id));
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Tipe Dokumen</h2>
                        <p className="text-sm text-gray-500">Kelola jenis dokumen pendaftaran dan status kewajibannya</p>
                    </div>
                </div>
            }
        >
            <Head title="Tipe Dokumen" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Add / Edit Form */}
                    <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100/50 px-6 py-4">
                            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                                <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={editing ? 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' : 'M12 6v6m0 0v6m0-6h6m-6 0H6'} />
                                </svg>
                                {editing ? 'Edit Tipe Dokumen' : 'Tambah Tipe Dokumen Baru'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="px-6 py-5">
                            <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Kode Dokumen</label>
                                    <input
                                        type="text"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400 text-sm"
                                        placeholder="Contoh: pas_foto"
                                    />
                                    {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nama Dokumen</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400 text-sm"
                                        placeholder="Contoh: Pas Foto"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>
                                <div className="flex items-center justify-between sm:justify-start gap-4 h-10 border sm:border-0 rounded-xl px-3 sm:px-0 border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700">Wajib Diunggah</span>
                                        <Switch
                                            checked={data.is_required}
                                            onChange={(val) => setData('is_required', val)}
                                        />
                                    </div>
                                    <div className="flex gap-2 ml-auto sm:ml-4">
                                        <Button type="submit" disabled={processing} className="shrink-0 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-sm shadow-emerald-200 text-sm">
                                            {editing ? 'Update' : 'Simpan'}
                                        </Button>
                                        {editing && (
                                            <Button type="button" variant="outline" onClick={handleCancel} className="shrink-0 border-gray-200 text-gray-600 hover:bg-gray-50 text-sm">
                                                Batal
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <p className="mt-1 text-[11px] text-gray-400">Kode dokumen hanya boleh berisi huruf kecil, angka, dan underscore (contoh: pas_foto, kk, ktp_ortu).</p>
                        </form>
                    </div>

                    {/* Types Table */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                            <h3 className="text-base font-semibold text-gray-900">Daftar Tipe Dokumen</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Kode</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nama Tipe Dokumen</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status Kewajiban</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {types.map((type) => (
                                        <tr key={type.id} className="transition-colors hover:bg-gray-50/50">
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-600">
                                                {type.code}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-800">
                                                {type.name}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                                                    type.is_required 
                                                        ? 'bg-rose-50 text-rose-700 ring-rose-300' 
                                                        : 'bg-gray-100 text-gray-700 ring-gray-300'
                                                }`}>
                                                    {type.is_required ? 'Wajib' : 'Opsional'}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                <button onClick={() => handleEdit(type)} className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-100 hover:border-emerald-300">
                                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(type.id)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 shadow-sm transition hover:bg-red-100 hover:border-red-300 ml-1">
                                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {types.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400">
                                                Belum ada tipe dokumen
                                            </td>
                                        </tr>
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
