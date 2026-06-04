import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RichEditor from '@/Components/RichEditor';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Switch from '@/Components/Switch';

export default function Index({ schedules, activeYear, academicYears }) {
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        academic_year_id: activeYear?.id || '',
        activity_name: '',
        start_date: '',
        end_date: '',
        requirements: '',
        order: 0,
        is_active: true,
    });

    function startCreate() {
        setEditing(null);
        reset();
    }

    function startEdit(schedule) {
        setEditing(schedule.id);
        setData({
            academic_year_id: schedule.academic_year_id,
            activity_name: schedule.activity_name,
            start_date: schedule.start_date,
            end_date: schedule.end_date,
            requirements: schedule.requirements,
            order: schedule.order,
            is_active: schedule.is_active,
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        const options = { preserveScroll: true, onSuccess: () => { setEditing(null); reset(); } };
        if (editing) {
            put(route('admin.activity-schedules.update', editing), options);
        } else {
            post(route('admin.activity-schedules.store'), options);
        }
    }

    function handleDelete(id) {
        if (confirm('Hapus jadwal kegiatan ini?')) {
            router.delete(route('admin.activity-schedules.destroy', id), { preserveScroll: true });
        }
    }

    function handleToggleActive(schedule) {
        router.put(route('admin.activity-schedules.update', schedule.id), {
            academic_year_id: schedule.academic_year_id,
            activity_name: schedule.activity_name,
            start_date: schedule.start_date,
            end_date: schedule.end_date,
            requirements: schedule.requirements,
            order: schedule.order,
            is_active: !schedule.is_active,
        }, {
            preserveScroll: true,
        });
    }

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
                        <h2 className="text-xl font-bold text-gray-900">Jadwal Kegiatan</h2>
                        <p className="text-sm text-gray-500">Atur jadwal dan persyaratan PPDB</p>
                    </div>
                </div>
            }
        >
            <Head title="Jadwal Kegiatan" />

            <div className="py-8">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-semibold text-gray-900">
                                    {editing ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
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
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Nama Kegiatan</label>
                                    <input
                                        type="text"
                                        value={data.activity_name}
                                        onChange={(e) => setData('activity_name', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                                        placeholder="Contoh: Pembukaan Pendaftaran"
                                        required
                                    />
                                    {errors.activity_name && <p className="mt-1 text-sm text-red-600">{errors.activity_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                                        required
                                    />
                                    {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tanggal Selesai</label>
                                    <input
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                                        required
                                    />
                                    {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Persyaratan Pendaftaran</label>
                                    <p className="mt-0.5 text-xs text-gray-400">Gunakan editor untuk memformat persyaratan.</p>
                                    <div className="mt-2">
                                        <RichEditor
                                            value={data.requirements}
                                            onChange={(html) => setData('requirements', html)}
                                        />
                                    </div>
                                    {errors.requirements && <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Urutan Tampil</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.order}
                                        onChange={(e) => setData('order', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                                    />
                                </div>

                                <div className="flex items-end">
                                    <div className="flex items-center gap-2.5">
                                        <Switch
                                            checked={data.is_active}
                                            onChange={(checked) => setData('is_active', checked)}
                                        />
                                        <span className="text-sm font-medium text-gray-700">Aktif</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:from-emerald-700 hover:to-teal-700 hover:shadow-md disabled:opacity-50"
                                >
                                    {editing ? 'Simpan Perubahan' : 'Tambah Jadwal'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                            <h3 className="text-base font-semibold text-gray-900">Daftar Kegiatan</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">#</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Kegiatan</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Tanggal</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Tahun Ajaran</th>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {schedules.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                                                Belum ada jadwal kegiatan.
                                            </td>
                                        </tr>
                                    ) : (
                                        schedules.map((s, i) => (
                                            <tr key={s.id} className="transition-colors hover:bg-gray-50/50">
                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-400">{s.order}</td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <span className="text-sm font-medium text-gray-900">{s.activity_name}</span>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                                                    {s.start_date} — {s.end_date}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                                                    {s.academic_year?.name}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <Switch
                                                        checked={s.is_active}
                                                        onChange={() => handleToggleActive(s)}
                                                    />
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => startEdit(s)} className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-100 hover:border-emerald-300">
                                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                            Edit
                                                        </button>
                                                        <button onClick={() => handleDelete(s.id)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 shadow-sm transition hover:bg-red-100 hover:border-red-300">
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
