import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Biodata({ registration, activeYear }) {
    const isLocked = registration && registration.status !== 'draft';
    const bio = registration?.student_biodata;

    const { data, setData, post, processing, errors } = useForm({
        nisn: bio?.nisn || '',
        full_name: bio?.full_name || '',
        gender: bio?.gender || '',
        birth_place: bio?.birth_place || '',
        birth_date: bio?.birth_date?.split('T')[0] || '',
        address: bio?.address || '',
        previous_school: bio?.previous_school || '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('student.registration.biodata'), {
            preserveScroll: true,
        });
    }

    return (
        <StudentLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Biodata Pendaftar
                </h2>
            }
        >
            <Head title="Biodata" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    {!registration ? (
                        <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-800">Belum Mendaftar</h3>
                            <p className="mt-2 text-gray-500">Silakan daftar terlebih dahulu.</p>
                            <Link
                                href="/daftar"
                                className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
                            >
                                Daftar Sekarang
                            </Link>
                        </div>
                    ) : isLocked ? (
                        <div className="rounded-xl border bg-white p-8 shadow-sm">
                            <div className="mb-6 rounded-lg bg-blue-50 p-4 text-center text-blue-700">
                                Pendaftaran telah dikirim. Status:{' '}
                                <span className="font-semibold capitalize">{registration.status}</span>.
                                Data tidak dapat diubah.
                            </div>
                            {bio && (
                                <div className="space-y-3">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <p className="text-sm text-gray-500">NISN</p>
                                            <p className="font-medium text-gray-800">{bio.nisn}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Nama Lengkap</p>
                                            <p className="font-medium text-gray-800">{bio.full_name}</p>
                                        </div>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Jenis Kelamin</p>
                                            <p className="font-medium text-gray-800 capitalize">{bio.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Tempat Lahir</p>
                                            <p className="font-medium text-gray-800">{bio.birth_place}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Tanggal Lahir</p>
                                            <p className="font-medium text-gray-800">{bio.birth_date}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Alamat</p>
                                        <p className="font-medium text-gray-800">{bio.address}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Asal Sekolah</p>
                                        <p className="font-medium text-gray-800">{bio.previous_school}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-xl border bg-white p-8 shadow-sm">
                            <h3 className="mb-6 text-xl font-semibold text-gray-800">Data Diri</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">NISN</label>
                                        <input
                                            type="text"
                                            value={data.nisn}
                                            onChange={(e) => setData('nisn', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                        {errors.nisn && <p className="mt-1 text-sm text-red-600">{errors.nisn}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            value={data.full_name}
                                            onChange={(e) => setData('full_name', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                        {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                                        <select
                                            value={data.gender}
                                            onChange={(e) => setData('gender', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        >
                                            <option value="">Pilih</option>
                                            <option value="male">Laki-laki</option>
                                            <option value="female">Perempuan</option>
                                        </select>
                                        {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tempat Lahir</label>
                                        <input
                                            type="text"
                                            value={data.birth_place}
                                            onChange={(e) => setData('birth_place', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                        {errors.birth_place && <p className="mt-1 text-sm text-red-600">{errors.birth_place}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                                        <input
                                            type="date"
                                            value={data.birth_date}
                                            onChange={(e) => setData('birth_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                        {errors.birth_date && <p className="mt-1 text-sm text-red-600">{errors.birth_date}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Alamat</label>
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Asal Sekolah</label>
                                    <input
                                        type="text"
                                        value={data.previous_school}
                                        onChange={(e) => setData('previous_school', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                    {errors.previous_school && <p className="mt-1 text-sm text-red-600">{errors.previous_school}</p>}
                                </div>

                                <div className="flex items-center justify-between">
                                    <Link
                                        href={route('student.dashboard')}
                                        className="text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        &larr; Kembali ke Dashboard
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-lg bg-green-600 px-6 py-2 text-white transition hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}
