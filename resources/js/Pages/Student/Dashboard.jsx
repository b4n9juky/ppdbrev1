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

const docTypeLabels = {
    ijazah: 'Ijazah',
    ktp_ortu: 'KTP Orang Tua',
    kk: 'Kartu Keluarga',
    prestasi: 'Sertifikat Prestasi',
    other: 'Lainnya',
};

const docTypeColors = {
    ijazah: 'bg-blue-50 text-blue-700 ring-blue-200',
    ktp_ortu: 'bg-amber-50 text-amber-700 ring-amber-200',
    kk: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    prestasi: 'bg-violet-50 text-violet-700 ring-violet-200',
    other: 'bg-gray-50 text-gray-600 ring-gray-200',
};

function isImage(filePath) {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
}

const summaryItems = [
    { label: 'Jalur Pendaftaran', key: 'admission_path.name' },
    { label: 'NISN', key: 'student_biodata.nisn' },
    { label: 'Nama Lengkap', key: 'student_biodata.full_name' },
    { label: 'Asal Sekolah', key: 'student_biodata.previous_school' },
];

export default function Dashboard({ activeYear, registration, madrasah, documentTypes = [] }) {
    const bio = registration?.student_biodata;
    const docs = registration?.student_documents || [];
    const scores = registration?.subject_scores || [];
    const status = registration 
        ? (registration.processing_status === 'selesai' && registration.status === 'pending'
            ? { label: 'Terverifikasi', bg: 'bg-emerald-50 text-emerald-700 ring-emerald-300', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
            : statusConfig[registration.status] || statusConfig.draft)
        : null;

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
                                    const isPrint = card.name === 'Cetak Bukti';
                                    const CardTag = isPrint ? 'a' : Link;
                                    return (
                                        <CardTag
                                            key={card.name}
                                            href={card.href}
                                            target={isPrint ? "_blank" : undefined}
                                            rel={isPrint ? "noopener noreferrer" : undefined}
                                            className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 block text-left"
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
                                        </CardTag>
                                    );
                                })}
                            </div>

                            {/* Summary */}
                            {registration.status !== 'draft' && (
                                <div className="space-y-6">
                                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
                                            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                                <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Ringkasan Pendaftaran
                                            </h3>
                                            {registration.total_score !== null && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/10">
                                                    Nilai Total: {registration.total_score}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-6 space-y-6">
                                            {/* Grid Informasi Utama */}
                                            <div className="grid gap-6 sm:grid-cols-2">
                                                <div className="space-y-4">
                                                    <div>
                                                        <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Jalur Pendaftaran</span>
                                                        <span className="mt-1 block text-sm font-semibold text-gray-900">{registration.admission_path?.name || '-'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Nama Lengkap</span>
                                                        <span className="mt-1 block text-sm font-medium text-gray-900">{bio?.full_name || '-'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">NISN</span>
                                                        <span className="mt-1 block text-sm font-medium text-gray-900">{bio?.nisn || '-'}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Asal Sekolah</span>
                                                        <span className="mt-1 block text-sm font-medium text-gray-900">{bio?.previous_school || '-'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Jenis Kelamin</span>
                                                        <span className="mt-1 block text-sm font-medium text-gray-900 capitalize">
                                                            {bio?.gender === 'male' ? 'Laki-laki' : bio?.gender === 'female' ? 'Perempuan' : '-'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Tempat, Tanggal Lahir</span>
                                                        <span className="mt-1 block text-sm font-medium text-gray-900 font-sans">
                                                            {bio?.birth_place ? `${bio.birth_place}, ` : ''}
                                                            {bio?.birth_date ? new Date(bio.birth_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Alamat & Kontak */}
                                            <div className="grid gap-6 sm:grid-cols-2 border-t border-gray-50 pt-4">
                                                {bio?.address && (
                                                    <div>
                                                        <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Alamat Rumah</span>
                                                        <span className="mt-1 block text-sm font-medium text-gray-900">{bio.address}</span>
                                                    </div>
                                                )}
                                                {bio?.phone_number && (
                                                    <div>
                                                        <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Nomor Kontak / WA</span>
                                                        <span className="mt-1 block text-sm font-medium text-gray-900">{bio.phone_number}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Dokumen Section */}
                                            <div className="border-t border-gray-50 pt-4">
                                                <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Dokumen Terunggah ({docs.length})</span>
                                                {docs.length > 0 ? (
                                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                        {docs.map((doc) => {
                                                            const typeColor = docTypeColors[doc.document_type] || docTypeColors.other;
                                                            const typeLabel = documentTypes.find(dt => dt.code === doc.document_type)?.name || docTypeLabels[doc.document_type] || doc.document_type.replace('_', ' ');
                                                            const fileName = doc.file_path.split('/').pop();
                                                            const fileIsImage = isImage(doc.file_path);

                                                            return (
                                                                <div key={doc.id} className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
                                                                    <div className="relative h-24 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                                                                        {fileIsImage ? (
                                                                            <img
                                                                                src={`/storage/${doc.file_path}`}
                                                                                alt={typeLabel}
                                                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                                            />
                                                                        ) : (
                                                                            <div className="flex flex-col items-center gap-1">
                                                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                                                                                    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                                    </svg>
                                                                                </div>
                                                                                <span className="text-[9px] font-semibold text-gray-500">PDF</span>
                                                                            </div>
                                                                        )}
                                                                        <a
                                                                            href={`/storage/${doc.file_path}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/30"
                                                                        >
                                                                            <span className="inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-[10px] font-medium text-gray-700 shadow-sm opacity-0 transition-all group-hover:opacity-100 backdrop-blur-sm">
                                                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                                </svg>
                                                                                Lihat
                                                                            </span>
                                                                        </a>
                                                                    </div>
                                                                    <div className="p-2.5">
                                                                        <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold ring-1 ring-inset ${typeColor}`}>
                                                                            {typeLabel}
                                                                        </span>
                                                                        <p className="mt-0.5 truncate text-[10px] text-gray-400" title={fileName}>
                                                                            {fileName}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">Belum ada berkas terunggah.</span>
                                                )}
                                            </div>
                                        </div>
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
