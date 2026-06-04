import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Switch from '@/Components/Switch';

export default function Index({ years }) {
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        passing_score: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (editing) {
            put(route('admin.academic-years.update', editing), {
                preserveScroll: true,
                onSuccess: () => { reset(); setEditing(null); },
            });
        } else {
            post(route('admin.academic-years.store'), {
                preserveScroll: true,
                onSuccess: () => reset(),
            });
        }
    }

    function handleEdit(year) {
        setEditing(year.id);
        setData({
            name: year.name,
            passing_score: year.passing_score ?? '',
        });
    }

    function handleDelete(id) {
        if (confirm('Hapus tahun ajaran ini?')) {
            router.delete(route('admin.academic-years.destroy', id));
        }
    }

    function handleToggleActive(year) {
        router.patch(route('admin.academic-years.toggle-active', year.id), {}, {
            preserveScroll: true,
        });
    }

    function handleCancel() {
        reset();
        setEditing(null);
    }

    const activeYear = years.find((y) => y.is_active);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Tahun Ajaran</h2>
                        <p className="text-sm text-gray-500">Kelola tahun ajaran dan buka/tutup pendaftaran</p>
                    </div>
                </div>
            }
        >
            <Head title="Tahun Ajaran" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Active Year Status */}
                    <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={activeYear
                                                ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                                                : 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636'} />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-emerald-100">Status Pendaftaran</p>
                                        <h3 className="text-xl font-bold text-white">
                                            {activeYear
                                                ? `Pendaftaran ${activeYear.name} — ${activeYear.is_active ? 'Dibuka' : 'Ditutup'}`
                                                : 'Belum ada tahun ajaran aktif'}
                                        </h3>
                                    </div>
                                </div>
                                {activeYear && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm ring-1 ring-white/30">
                                        <span className={`h-2 w-2 rounded-full ${activeYear.is_active ? 'bg-emerald-300 animate-pulse' : 'bg-gray-300'}`} />
                                        {activeYear.is_active ? 'Aktif' : 'Tidak Aktif'}
                                    </span>
                                )}
                            </div>
                        </div>
                        {activeYear && (
                            <div className="flex items-center gap-3 border-t border-gray-100 px-6 py-3">
                                <div className="flex-1 text-sm text-gray-500">
                                    Tahun ajaran aktif: <span className="font-medium text-gray-800">{activeYear.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">{activeYear.is_active ? 'Tutup Pendaftaran' : 'Buka Pendaftaran'}</span>
                                    <Switch
                                        checked={activeYear.is_active}
                                        onChange={() => handleToggleActive(activeYear)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Add / Edit Form */}
                    <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100/50 px-6 py-4">
                            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                                <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={editing ? 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' : 'M12 6v6m0 0v6m0-6h6m-6 0H6'} />
                                </svg>
                                {editing ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran Baru'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="px-6 py-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Nama Tahun Ajaran</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                                        placeholder="Contoh: 2026/2027"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>
                                <div className="w-full sm:w-48">
                                    <label className="block text-sm font-medium text-gray-700">Nilai Minimal Kelulusan</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.passing_score}
                                        onChange={(e) => setData('passing_score', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                                        placeholder="Contoh: 75.00"
                                    />
                                    {errors.passing_score && <p className="mt-1 text-sm text-red-600">{errors.passing_score}</p>}
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={processing} className="shrink-0 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-sm shadow-emerald-200">
                                        {editing ? 'Update' : 'Simpan'}
                                    </Button>
                                    {editing && (
                                        <Button type="button" variant="outline" onClick={handleCancel} className="shrink-0 border-gray-200 text-gray-600 hover:bg-gray-50">
                                            Batal
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Years Table */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                            <h3 className="text-base font-semibold text-gray-900">Daftar Tahun Ajaran</h3>
                        </div>
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Tahun Ajaran</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nilai Minimal</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Pendaftaran</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {years.map((year) => (
                                    <tr key={year.id} className="transition-colors hover:bg-gray-50/50">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {year.is_active && (
                                                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                                                )}
                                                <span className={`text-sm font-medium ${year.is_active ? 'text-gray-900' : 'text-gray-500'}`}>
                                                    {year.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 font-medium">
                                            {year.passing_score}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${year.is_active ? 'bg-emerald-50 text-emerald-700 ring-emerald-300' : 'bg-gray-100 text-gray-700 ring-gray-300'}`}>
                                                {year.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <Switch
                                                checked={year.is_active}
                                                onChange={() => handleToggleActive(year)}
                                            />
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                            <button onClick={() => handleEdit(year)} className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-100 hover:border-emerald-300">
                                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(year.id)} className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium shadow-sm transition ml-1 ${year.is_active ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed' : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-300'}`} disabled={year.is_active}>
                                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {years.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400">
                                            Belum ada tahun ajaran
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
