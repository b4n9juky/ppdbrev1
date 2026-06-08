import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ setting }) {
    const { data, setData, post, processing, errors } = useForm({
        madrasah_name: setting.madrasah_name || '',
        address: setting.address || '',
        contact: setting.contact || '',
        headmaster_name: setting.headmaster_name || '',
        headmaster_nip: setting.headmaster_nip || '',
        kop_surat: null,
        signature: null,
        stamp: null,
        logo: null,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('admin.madrasah-settings.update'), {
            preserveScroll: true,
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-200">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Pengaturan Madrasah</h2>
                        <p className="text-sm text-gray-500">Profil dan berkas madrasah</p>
                    </div>
                </div>
            }
        >
            <Head title="Pengaturan Madrasah" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                        <div className="border-b border-gray-100 pb-6">
                            <h3 className="text-base font-semibold text-gray-900">Informasi Madrasah</h3>
                            <p className="mt-1 text-sm text-gray-500">Data profil madrasah untuk kop surat dan dokumen resmi.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nama Madrasah</label>
                            <input
                                type="text"
                                value={data.madrasah_name}
                                onChange={(e) => setData('madrasah_name', e.target.value)}
                                className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                            />
                            {errors.madrasah_name && <p className="mt-1 text-sm text-red-600">{errors.madrasah_name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Alamat</label>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                rows={3}
                                className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kontak</label>
                            <input
                                type="text"
                                value={data.contact}
                                onChange={(e) => setData('contact', e.target.value)}
                                className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                            />
                            {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <h3 className="mb-4 text-base font-semibold text-gray-900">Kepala Madrasah</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nama Kepala Madrasah</label>
                                    <input
                                        type="text"
                                        value={data.headmaster_name}
                                        onChange={(e) => setData('headmaster_name', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                                    />
                                    {errors.headmaster_name && <p className="mt-1 text-sm text-red-600">{errors.headmaster_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">NIP Kepala Madrasah</label>
                                    <input
                                        type="text"
                                        value={data.headmaster_nip}
                                        onChange={(e) => setData('headmaster_nip', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                                    />
                                    {errors.headmaster_nip && <p className="mt-1 text-sm text-red-600">{errors.headmaster_nip}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <h3 className="mb-4 text-base font-semibold text-gray-900">Berkas Dokumen</h3>
                            <div className="grid gap-6 sm:grid-cols-4">
                                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-4">
                                    <label className="block text-sm font-medium text-gray-700">Kop Surat</label>
                                    <p className="mb-2 text-xs text-gray-400">PNG/JPG, maks 2MB</p>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg"
                                        onChange={(e) => setData('kop_surat', e.target.files[0])}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
                                    />
                                    {errors.kop_surat && <p className="mt-1 text-sm text-red-600">{errors.kop_surat}</p>}
                                    {setting.kop_surat_path && (
                                        <div className="mt-2">
                                            <img
                                                src={`/storage/${setting.kop_surat_path}`}
                                                className="max-h-16 w-full rounded-lg border border-gray-200 object-contain bg-white"
                                                alt="Kop Surat preview"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-4">
                                    <label className="block text-sm font-medium text-gray-700">Tanda Tangan</label>
                                    <p className="mb-2 text-xs text-gray-400">PNG/JPG, maks 2MB</p>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg"
                                        onChange={(e) => setData('signature', e.target.files[0])}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
                                    />
                                    {errors.signature && <p className="mt-1 text-sm text-red-600">{errors.signature}</p>}
                                    {setting.signature_path && (
                                        <div className="mt-2">
                                            <img
                                                src={`/storage/${setting.signature_path}`}
                                                className="h-12 w-12 rounded-lg border border-gray-200 object-contain bg-white"
                                                alt="Tanda Tangan preview"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-4">
                                    <label className="block text-sm font-medium text-gray-700">Stempel</label>
                                    <p className="mb-2 text-xs text-gray-400">PNG/JPG, maks 2MB</p>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg"
                                        onChange={(e) => setData('stamp', e.target.files[0])}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
                                    />
                                    {errors.stamp && <p className="mt-1 text-sm text-red-600">{errors.stamp}</p>}
                                    {setting.stamp_path && (
                                        <div className="mt-2">
                                            <img
                                                src={`/storage/${setting.stamp_path}`}
                                                className="h-12 w-12 rounded-lg border border-gray-200 object-contain bg-white"
                                                alt="Stempel preview"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-4">
                                    <label className="block text-sm font-medium text-gray-700">Logo Madrasah</label>
                                    <p className="mb-2 text-xs text-gray-400">PNG/JPG, maks 2MB</p>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg"
                                        onChange={(e) => setData('logo', e.target.files[0])}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
                                    />
                                    {errors.logo && <p className="mt-1 text-sm text-red-600">{errors.logo}</p>}
                                    {setting.logo_path && (
                                        <div className="mt-2">
                                            <img
                                                src={`/storage/${setting.logo_path}`}
                                                className="h-12 w-12 rounded-lg border border-gray-200 object-contain"
                                                alt="Logo preview"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end border-t border-gray-100 pt-6">
                            <Button type="submit" disabled={processing} className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-sm shadow-emerald-200">
                                Simpan Pengaturan
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
