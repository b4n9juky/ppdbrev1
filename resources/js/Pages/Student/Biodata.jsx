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
        phone_number: bio?.phone_number || '',
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
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#468432] to-[#9AD872] shadow-lg shadow-emerald-100">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Biodata Pendaftar</h2>
                        <p className="text-sm text-gray-500">Lengkapi data diri Anda secara lengkap dan benar</p>
                    </div>
                </div>
            }
        >
            <Head title="Biodata" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    {!registration ? (
                        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-[#9AD872]/20 to-[#468432]/10 opacity-30" />
                            <div className="relative">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFEF91]/30 to-[#9AD872]/20 shadow-inner">
                                    <svg className="h-10 w-10 text-[#468432]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Belum Mendaftar</h3>
                                <p className="mt-2 text-gray-500 max-w-sm mx-auto">Silakan lakukan pendaftaran terlebih dahulu untuk mengisi data diri.</p>
                                <Link
                                    href="/daftar"
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#468432] to-[#9AD872] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#468432]/10 transition hover:opacity-90"
                                >
                                    Daftar Sekarang
                                </Link>
                            </div>
                        </div>
                    ) : isLocked ? (
                        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                            <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-sm text-blue-700 flex items-center gap-3">
                                <svg className="h-5 w-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    Pendaftaran telah dikirim. Status: <span className="font-semibold capitalize">{registration.status}</span>. Data tidak dapat diubah kembali.
                                </div>
                            </div>
                            {bio && (
                                <div className="space-y-6">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div>
                                            <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Nama Lengkap</span>
                                            <span className="mt-1 block text-sm font-medium text-gray-900">{bio.full_name}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">NISN</span>
                                            <span className="mt-1 block text-sm font-medium text-gray-900">{bio.nisn}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Jenis Kelamin</span>
                                            <span className="mt-1 block text-sm font-medium text-gray-900 capitalize">
                                                {bio.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Tempat, Tanggal Lahir</span>
                                            <span className="mt-1 block text-sm font-medium text-gray-900">
                                                {bio.birth_place}, {bio.birth_date ? new Date(bio.birth_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-50 pt-4">
                                        <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Alamat Rumah</span>
                                        <span className="mt-1 block text-sm font-medium text-gray-900">{bio.address}</span>
                                    </div>
                                    <div className="border-t border-gray-50 pt-4">
                                        <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Nomor Kontak / WA</span>
                                        <span className="mt-1 block text-sm font-medium text-gray-900">{bio.phone_number || '-'}</span>
                                    </div>
                                    <div className="border-t border-gray-50 pt-4">
                                        <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Asal Sekolah</span>
                                        <span className="mt-1 block text-sm font-medium text-gray-900">{bio.previous_school}</span>
                                    </div>
                                    <div className="flex justify-start border-t border-gray-50 pt-6">
                                        <Link
                                            href={route('student.dashboard')}
                                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#468432] transition hover:text-[#468432]/80"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                            </svg>
                                            Kembali ke Dashboard
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                            <h3 className="mb-6 text-lg font-bold text-gray-800 border-b border-gray-50 pb-3">Edit Data Diri</h3>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700">NISN</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={data.nisn}
                                            onChange={(e) => setData('nisn', e.target.value.replace(/\D/g, ''))}
                                            className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-[#468432] focus:ring-[#468432] text-sm"
                                        />
                                        {errors.nisn && <p className="mt-1 text-xs text-red-600">{errors.nisn}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            value={data.full_name}
                                            onChange={(e) => setData('full_name', e.target.value)}
                                            className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-[#468432] focus:ring-[#468432] text-sm"
                                        />
                                        {errors.full_name && <p className="mt-1 text-xs text-red-600">{errors.full_name}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700">Jenis Kelamin</label>
                                        <select
                                            value={data.gender}
                                            onChange={(e) => setData('gender', e.target.value)}
                                            className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-[#468432] focus:ring-[#468432] text-sm"
                                        >
                                            <option value="">Pilih</option>
                                            <option value="male">Laki-laki</option>
                                            <option value="female">Perempuan</option>
                                        </select>
                                        {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700">Tempat Lahir</label>
                                        <input
                                            type="text"
                                            value={data.birth_place}
                                            onChange={(e) => setData('birth_place', e.target.value)}
                                            className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-[#468432] focus:ring-[#468432] text-sm"
                                        />
                                        {errors.birth_place && <p className="mt-1 text-xs text-red-600">{errors.birth_place}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700">Tanggal Lahir</label>
                                        <input
                                            type="date"
                                            value={data.birth_date}
                                            onChange={(e) => setData('birth_date', e.target.value)}
                                            className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-[#468432] focus:ring-[#468432] text-sm"
                                        />
                                        {errors.birth_date && <p className="mt-1 text-xs text-red-600">{errors.birth_date}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Alamat</label>
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        rows={3}
                                        className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-[#468432] focus:ring-[#468432] text-sm"
                                    />
                                    {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Nomor Kontak / WhatsApp</label>
                                    <input
                                        type="text"
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value.replace(/[^0-9]/g, ''))}
                                        maxLength={13}
                                        className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-[#468432] focus:ring-[#468432] text-sm"
                                        placeholder="Contoh: 081234567890"
                                    />
                                    {errors.phone_number && <p className="mt-1 text-xs text-red-600">{errors.phone_number}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Asal Sekolah</label>
                                    <input
                                        type="text"
                                        value={data.previous_school}
                                        onChange={(e) => setData('previous_school', e.target.value)}
                                        className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-[#468432] focus:ring-[#468432] text-sm"
                                    />
                                    {errors.previous_school && <p className="mt-1 text-xs text-red-600">{errors.previous_school}</p>}
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-50 pt-5">
                                    <Link
                                        href={route('student.dashboard')}
                                        className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-700"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Kembali
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#468432] to-[#9AD872] px-6 py-2.5 text-sm font-bold text-white shadow-sm shadow-[#468432]/10 hover:opacity-95 transition disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
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
