import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link, router } from '@inertiajs/react';

const statusConfig = {
    draft: { label: 'Belum Dikirim', bg: 'bg-yellow-50 text-yellow-700 ring-yellow-300', icon: 'M12 9v2m0 4h.01' },
    pending: { label: 'Menunggu Verifikasi', bg: 'bg-blue-50 text-blue-700 ring-blue-300', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    accepted: { label: 'Diterima', bg: 'bg-emerald-50 text-emerald-700 ring-emerald-300', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    reserve: { label: 'Cadangan', bg: 'bg-amber-50 text-amber-700 ring-amber-300', icon: 'M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    rejected: { label: 'Ditolak', bg: 'bg-red-50 text-red-700 ring-red-300', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
};

const featureCards = [
    {
        name: 'Biodata',
        desc: 'Lengkapi data diri',
        href: route('student.biodata'),
        gradient: 'from-blue-500 to-indigo-500',
        lightBg: 'bg-blue-50',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        getStatus: (bio) => bio ? { text: 'Lengkap', class: 'text-emerald-600 bg-emerald-50' } : { text: 'Belum diisi', class: 'text-gray-400 bg-gray-50' },
    },
    {
        name: 'Nilai',
        desc: 'Input nilai ijazah',
        href: route('student.scores.edit'),
        gradient: 'from-violet-500 to-purple-500',
        lightBg: 'bg-violet-50',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        getStatus: (_, scores) => scores.length > 0 ? { text: `${scores.length} mapel`, class: 'text-emerald-600 bg-emerald-50' } : { text: 'Belum diisi', class: 'text-gray-400 bg-gray-50' },
    },
    {
        name: 'Dokumen',
        desc: 'Upload berkas',
        href: route('student.documents'),
        gradient: 'from-emerald-500 to-green-500',
        lightBg: 'bg-emerald-50',
        icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
        getStatus: (_, __, docs) => docs.length > 0 ? { text: `${docs.length} file`, class: 'text-emerald-600 bg-emerald-50' } : { text: 'Belum diupload', class: 'text-gray-400 bg-gray-50' },
    },
    {
        name: 'Cetak Bukti',
        desc: 'Cetak pendaftaran',
        href: route('student.print.proof'),
        gradient: 'from-orange-500 to-amber-500',
        lightBg: 'bg-orange-50',
        icon: 'M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z',
        getStatus: () => ({ text: 'Cetak', class: 'text-gray-400 bg-gray-50' }),
    },
];

const summaryItems = [
    { label: 'Jalur Pendaftaran', key: 'admission_path.name' },
    { label: 'NISN', key: 'student_biodata.nisn' },
    { label: 'Nama Lengkap', key: 'student_biodata.full_name' },
    { label: 'Asal Sekolah', key: 'student_biodata.previous_school' },
];

export default function Dashboard({ activeYear, registration, madrasah }) {
    const bio = registration?.student_biodata;
    const docs = registration?.student_documents || [];
    const scores = registration?.subject_scores || [];
    const status = registration ? statusConfig[registration.status] || statusConfig.draft : null;

    return (
        <StudentLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-200">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Dashboard Siswa</h2>
                        <p className="text-sm text-gray-500">Panel pendaftaran PPDB</p>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard Siswa" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {!registration ? (
                        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 opacity-30" />
                            <div className="relative">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 shadow-inner">
                                    <svg className="h-10 w-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Belum Mendaftar</h3>
                                <p className="mt-2 text-gray-500 max-w-md mx-auto">
                                    {activeYear
                                        ? 'Anda belum melakukan pendaftaran untuk tahun ajaran ini.'
                                        : 'Pendaftaran belum dibuka.'}
                                </p>
                                {activeYear && (
                        <Link
                            href={route('student.registration.show')}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-red-600 hover:to-red-700"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Daftar Sekarang
                        </Link>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Status Card */}
                            <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                                <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">
                                                    {madrasah?.madrasah_name || 'PPDB MA'}
                                                </h3>
                                                <p className="text-sm text-emerald-100">
                                                    {registration.academic_year?.name}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium ring-1 ring-inset ${status?.bg || 'bg-gray-100 text-gray-700 ring-gray-300'}`}>
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={status?.icon || 'M12 9v2m0 4h.01'} />
                                            </svg>
                                            {status?.label || registration.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100 lg:grid-cols-4">
                                    {[
                                        { label: 'Jalur', value: registration.admission_path?.name || '-' },
                                        { label: 'Status', value: status?.label || registration.status },
                                        { label: 'Nilai Total', value: registration.total_score ?? '-' },
                                        { label: 'Dokumen', value: docs.length > 0 ? `${docs.length} file` : '0' },
                                    ].map((item) => (
                                        <div key={item.label} className="px-6 py-4 text-center">
                                            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{item.label}</p>
                                            <p className="mt-1 text-sm font-semibold text-gray-800">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {registration.status === 'draft' && bio && (
                                <div className="mb-8 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                                                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-amber-900">Perlu Dikirim Ulang</h3>
                                                <p className="text-sm text-amber-700">Data Anda masih tersimpan. Kirim ulang untuk melanjutkan proses seleksi.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (!confirm('Kirim ulang pendaftaran? Pastikan data sudah benar.')) return;
                                                router.post(route('student.registration.finalize'), {}, {
                                                    preserveScroll: true,
                                                });
                                            }}
                                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-amber-200 transition hover:from-amber-700 hover:to-orange-700 hover:shadow-md"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Kirim Ulang
                                        </button>
                                        <Link
                                            href="/daftar"
                                            className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 underline underline-offset-2 transition hover:text-amber-800"
                                        >
                                            Review & Edit
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Feature Cards */}
                            <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                {featureCards.map((card) => {
                                    const st = card.getStatus(bio, scores, docs);
                                    return (
                                        <Link
                                            key={card.name}
                                            href={card.href}
                                            className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                                        >
                                            <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-[0.06] transition-all duration-300 group-hover:scale-150 group-hover:opacity-10`} />
                                            <div className="relative">
                                                <div className={`mb-4 inline-flex rounded-xl ${card.lightBg} p-3.5 shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:scale-105`}>
                                                    <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon} />
                                                    </svg>
                                                </div>
                                                <h4 className="text-base font-semibold text-gray-900 transition-colors group-hover:text-emerald-600">{card.name}</h4>
                                                <p className="mt-1 text-sm text-gray-500">{card.desc}</p>
                                                <span className={`mt-3 inline-block rounded-md px-2.5 py-1 text-xs font-medium ${st.class} transition-colors`}>
                                                    {st.text}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Summary */}
                            {registration.status !== 'draft' && (
                                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                                    <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                                        <h3 className="text-base font-semibold text-gray-900">Ringkasan Pendaftaran</h3>
                                    </div>
                                    <div className="divide-y divide-gray-50 px-6 py-4">
                                        {summaryItems.map((item) => {
                                            const keys = item.key.split('.');
                                            let value = registration;
                                            keys.forEach((k) => { value = value?.[k]; });
                                            return (
                                                <div key={item.key} className="flex items-center justify-between py-2.5">
                                                    <span className="text-sm text-gray-500">{item.label}</span>
                                                    <span className="text-sm font-medium text-gray-800">{value || '-'}</span>
                                                </div>
                                            );
                                        })}
                                        {registration.total_score !== null && (
                                            <div className="flex items-center justify-between py-2.5">
                                                <span className="text-sm text-gray-500">Nilai Total</span>
                                                <span className="text-sm font-semibold text-emerald-600">{registration.total_score}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}
