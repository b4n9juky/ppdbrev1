import { useState } from 'react';
import Toast from '@/Components/Toast';
import { Head, Link, useForm, router } from '@inertiajs/react';

const steps = ['Pilih Jalur', 'Biodata', 'Upload Dokumen', 'Nilai Ijazah', 'Kirim'];

export default function Registration({ activeYear, registration, paths, madrasah, documentTypes = [], subjects = [] }) {
    const [step, setStep] = useState(() => {
        if (!registration) return 0;
        if (!registration.student_biodata) return 1;
        if (!registration.student_documents?.length) return 2;
        if (!registration.subject_scores?.length) return 3;
        return 4;
    });

    const isLocked = registration && registration.status !== 'draft';

    return (
        <>
            <Head title="Pendaftaran PPDB" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
                <header className="border-b border-gray-200 bg-white/80 shadow-sm backdrop-blur-sm">
                    <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
                        <Link href="/" className="text-lg font-bold text-emerald-700">
                            {madrasah?.madrasah_name || 'PPDB MA'}
                        </Link>
                        <Link href={route('student.dashboard')} className="text-sm text-gray-500 hover:text-gray-700">
                            Dashboard
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-4xl px-4 py-8">
                    {!activeYear ? (
                        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-800">Pendaftaran Ditutup</h2>
                            <p className="mt-2 text-gray-500">Belum ada tahun ajaran aktif.</p>
                        </div>
                    ) : isLocked ? (
                        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                            <div className="mb-6 rounded-xl bg-blue-50 p-4 text-center text-blue-700">
                                Pendaftaran telah dikirim. Status:{' '}
                                <span className="font-semibold capitalize">{registration.status}</span>.
                                Data tidak dapat diubah.
                            </div>
                            <RegistrationSummary registration={registration} />
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                            <StepIndicator steps={steps} current={step} />

                            {step === 0 && (
                                <StepSelectPath
                                    paths={paths}
                                    selectedId={registration?.admission_path_id}
                                    onNext={(id) => {
                                        router.post(route('student.registration.store'), {
                                            admission_path_id: id,
                                        }, { preserveScroll: true, onSuccess: () => setStep(1) });
                                    }}
                                />
                            )}

                            {step === 1 && (
                                <StepBiodata
                                    registration={registration}
                                    onNext={() => setStep(2)}
                                    onBack={() => setStep(0)}
                                />
                            )}

                            {step === 2 && (
                                <StepDocuments
                                    registration={registration}
                                    documentTypes={documentTypes}
                                    onNext={() => setStep(3)}
                                    onBack={() => setStep(1)}
                                />
                            )}

                            {step === 3 && (
                                <StepScores
                                    subjects={subjects}
                                    registration={registration}
                                    onNext={() => setStep(4)}
                                    onBack={() => setStep(2)}
                                />
                            )}

                            {step === 4 && (
                                <StepConfirm
                                    registration={registration}
                                    documentTypes={documentTypes}
                                    onBack={() => setStep(3)}
                                />
                            )}
                        </div>
                    )}
                </main>
                <Toast />
            </div>
        </>
    );
}

function StepIndicator({ steps, current }) {
    return (
        <div className="mb-8 flex items-center justify-center gap-2">
            {steps.map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold shadow-sm transition-all ${
                        i <= current
                            ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-emerald-200'
                            : 'bg-gray-100 text-gray-400'
                    }`}>
                        {i + 1}
                    </div>
                    <span className={`text-sm font-medium ${i <= current ? 'text-emerald-700' : 'text-gray-400'}`}>
                        {label}
                    </span>
                    {i < steps.length - 1 && (
                        <div className={`mx-1 h-0.5 w-10 rounded-full ${i < current ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gray-200'}`} />
                    )}
                </div>
            ))}
        </div>
    );
}

function StepSelectPath({ paths, selectedId, onNext }) {
    const [selected, setSelected] = useState(selectedId || '');

    return (
        <div>
            <h3 className="mb-6 text-xl font-semibold text-gray-800">Pilih Jalur Pendaftaran</h3>
            <div className="grid gap-4 md:grid-cols-2">
                {paths.map((path) => (
                    <button
                        key={path.id}
                        type="button"
                        onClick={() => setSelected(path.id)}
                        className={`rounded-xl border-2 p-6 text-left transition ${
                            selected === path.id
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-green-300'
                        }`}
                    >
                        <h4 className="font-semibold text-gray-800">{path.name}</h4>
                        <p className="mt-1 text-sm text-gray-500">{path.description}</p>
                        <p className="mt-2 text-sm font-medium text-green-600">Kuota: {path.quota}</p>
                    </button>
                ))}
            </div>
            <div className="mt-8 flex justify-end">
                <button
                    disabled={!selected}
                    onClick={() => onNext(selected)}
                    className="rounded-lg bg-green-600 px-6 py-2 text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                    Selanjutnya
                </button>
            </div>
        </div>
    );
}

function StepBiodata({ registration, onNext, onBack }) {
    const { data, setData, post, processing, errors } = useForm({
        nisn: registration?.student_biodata?.nisn || '',
        full_name: registration?.student_biodata?.full_name || '',
        gender: registration?.student_biodata?.gender || '',
        birth_place: registration?.student_biodata?.birth_place || '',
        birth_date: registration?.student_biodata?.birth_date?.split('T')[0] || '',
        address: registration?.student_biodata?.address || '',
        phone_number: registration?.student_biodata?.phone_number || '',
        previous_school: registration?.student_biodata?.previous_school || '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('student.registration.biodata'), {
            preserveScroll: true,
            onSuccess: () => onNext(),
        });
    }

    return (
        <div>
            <h3 className="mb-6 text-xl font-semibold text-gray-800">Data Diri</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">NISN</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={data.nisn}
                            onChange={(e) => setData('nisn', e.target.value.replace(/\D/g, ''))}
                            className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                        />
                        {errors.nisn && <p className="mt-1 text-sm text-red-600">{errors.nisn}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <input
                            type="text"
                            value={data.full_name}
                            onChange={(e) => setData('full_name', e.target.value)}
                            className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
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
                            className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
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
                            className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                        />
                        {errors.birth_place && <p className="mt-1 text-sm text-red-600">{errors.birth_place}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                        <input
                            type="date"
                            value={data.birth_date}
                            onChange={(e) => setData('birth_date', e.target.value)}
                            className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
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
                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nomor Kontak / WhatsApp</label>
                    <input
                        type="text"
                        value={data.phone_number}
                        onChange={(e) => setData('phone_number', e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={13}
                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                        placeholder="Contoh: 081234567890"
                    />
                    {errors.phone_number && <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Asal Sekolah</label>
                    <input
                        type="text"
                        value={data.previous_school}
                        onChange={(e) => setData('previous_school', e.target.value)}
                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400"
                    />
                    {errors.previous_school && <p className="mt-1 text-sm text-red-600">{errors.previous_school}</p>}
                </div>

                <div className="flex items-center justify-between pt-2">
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-800"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#468432] to-[#9AD872] px-8 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:opacity-95 disabled:opacity-50"
                    >
                        Simpan & Selanjutnya
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
}

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

function StepDocuments({ registration, onNext, onBack, documentTypes = [] }) {
    const [documentType, setDocumentType] = useState(() => {
        return documentTypes[0]?.code || 'ijazah';
    });
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    function handleFileChange(e) {
        const f = e.target.files[0] || null;
        setFile(f);
        if (f && f.type.startsWith('image/')) {
            setPreviewUrl(URL.createObjectURL(f));
        } else {
            setPreviewUrl(null);
        }
    }

    function handleUpload(e) {
        e.preventDefault();
        if (!file) return;
        setUploading(true);

        router.post(route('student.registration.document'), {
            document_type: documentType,
            file: file,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setFile(null);
                setPreviewUrl(null);
                setUploading(false);
                setDocumentType(documentTypes[0]?.code || 'ijazah');
                // Reset file input
                const input = document.getElementById('doc-file-input');
                if (input) input.value = '';
            },
        });
    }

    function handleDelete(id) {
        if (confirm('Hapus dokumen ini?')) {
            router.delete(route('student.registration.document.delete', id), {
                preserveScroll: true,
            });
        }
    }

    function isImage(filePath) {
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
    }

    const docs = registration?.student_documents || [];

    return (
        <div>
            <h3 className="mb-6 text-xl font-semibold text-gray-800">Upload Dokumen</h3>

            {/* Upload form — stacked on mobile, inline on desktop */}
            <form onSubmit={handleUpload} className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-3">
                    <h4 className="text-sm font-semibold text-gray-700">Upload Dokumen Baru</h4>
                    <p className="text-xs text-gray-400">Format: PDF, JPG, PNG — Maks 5MB</p>
                </div>
                <div className="p-5 space-y-4">
                    {/* Document type selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Jenis Dokumen</label>
                        <select
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                            className="block w-full rounded-xl border-gray-200 shadow-sm transition focus:border-emerald-400 focus:ring-emerald-400 text-sm"
                        >
                            {documentTypes.map((dt) => (
                                <option key={dt.id || dt.code} value={dt.code}>
                                    {dt.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* File drop zone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">File</label>
                        <label
                            htmlFor="doc-file-input"
                            className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition ${
                                file
                                    ? 'border-emerald-300 bg-emerald-50/50'
                                    : 'border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/30'
                            }`}
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="mb-3 h-24 w-auto rounded-lg object-contain shadow-sm" />
                            ) : (
                                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                            )}
                            {file ? (
                                <div className="text-center">
                                    <p className="text-sm font-medium text-emerald-700">{file.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-600">Klik untuk pilih file</p>
                                    <p className="text-xs text-gray-400 mt-0.5">atau drag & drop file ke sini</p>
                                </div>
                            )}
                            <input
                                id="doc-file-input"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                className="sr-only"
                            />
                        </label>
                    </div>

                    {/* Upload button */}
                    <button
                        type="submit"
                        disabled={!file || uploading}
                        className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 sm:w-auto"
                    >
                        {uploading ? (
                            <span className="inline-flex items-center gap-2">
                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Mengupload...
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Upload Dokumen
                            </span>
                        )}
                    </button>
                </div>
            </form>

            {/* Uploaded documents — responsive card grid */}
            <div className="mb-2">
                <h4 className="text-sm font-semibold text-gray-700">Dokumen Terupload ({docs.length})</h4>
            </div>

            {docs.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {docs.map((doc) => {
                        const typeColor = docTypeColors[doc.document_type] || docTypeColors.other;
                        const typeLabel = documentTypes.find(dt => dt.code === doc.document_type)?.name || docTypeLabels[doc.document_type] || doc.document_type.replace('_', ' ');
                        const fileName = doc.file_path.split('/').pop();
                        const fileIsImage = isImage(doc.file_path);

                        return (
                            <div
                                key={doc.id}
                                className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
                            >
                                {/* Preview area */}
                                <div className="relative h-40 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                                    {fileIsImage ? (
                                        <img
                                            src={`/storage/${doc.file_path}`}
                                            alt={typeLabel}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
                                                <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <span className="text-xs font-medium text-gray-500">PDF</span>
                                        </div>
                                    )}

                                    {/* View overlay on hover */}
                                    <a
                                        href={`/storage/${doc.file_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/30"
                                    >
                                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm opacity-0 transition-all group-hover:opacity-100 backdrop-blur-sm">
                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            Lihat
                                        </span>
                                    </a>
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${typeColor}`}>
                                                {typeLabel}
                                            </span>
                                            <p className="mt-1.5 truncate text-xs text-gray-400" title={fileName}>
                                                {fileName}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(doc.id)}
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100 hover:text-red-700"
                                            title="Hapus dokumen"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-gray-200 py-10">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                        <svg className="h-7 w-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Belum ada dokumen</p>
                    <p className="mt-0.5 text-xs text-gray-400">Upload dokumen pendaftaran di atas</p>
                </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-8 flex items-center justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-800"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali
                </button>
                <button
                    onClick={onNext}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:from-emerald-700 hover:to-green-700 hover:shadow-md"
                >
                    Selanjutnya
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

function StepScores({ subjects = [], registration, onNext, onBack }) {
    const existingScores = {};
    (registration?.subject_scores || []).forEach((s) => {
        existingScores[s.subject_id] = s.ijazah_score;
    });

    const [scores, setScores] = useState(() => {
        const initial = {};
        subjects.forEach((s) => {
            initial[s.id] = existingScores[s.id] ?? '';
        });
        return initial;
    });

    const [saving, setSaving] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        const payload = subjects.map((s) => ({
            subject_id: s.id,
            ijazah_score: scores[s.id] !== '' ? parseFloat(scores[s.id]) : null,
        }));
        router.patch(route('student.scores.update'), { scores: payload }, {
            preserveScroll: true,
            onSuccess: () => onNext(),
            onFinish: () => setSaving(false),
        });
    }

    return (
        <div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">Nilai Ijazah</h3>
            <p className="mb-6 text-sm text-gray-500">Masukkan nilai ijazah untuk setiap mata pelajaran (skala 0-100).</p>

            {subjects.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-400">Belum ada mata pelajaran yang ditentukan.</div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/70">
                                <tr>
                                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Mata Pelajaran</th>
                                    <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-500 w-36">Nilai Ijazah</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {subjects.map((s) => (
                                    <tr key={s.id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-5 py-3 text-sm font-medium text-gray-800">{s.name}</td>
                                        <td className="px-5 py-3 text-right">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                value={scores[s.id]}
                                                onChange={(e) =>
                                                    setScores((prev) => ({ ...prev, [s.id]: e.target.value }))
                                                }
                                                className="w-28 rounded-xl border-gray-200 text-right shadow-sm focus:border-emerald-400 focus:ring-emerald-400 text-sm font-mono"
                                                placeholder="0-100"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <button
                            type="button"
                            onClick={onBack}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-800"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Kembali
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:from-emerald-700 hover:to-green-700 disabled:opacity-50"
                        >
                            {saving ? (
                                <span className="inline-flex items-center gap-2">
                                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Menyimpan...
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-2">
                                    Simpan & Selanjutnya
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

function StepConfirm({ registration, onBack, documentTypes = [] }) {
    const [submitting, setSubmitting] = useState(false);

    function handleFinalize() {
        if (!confirm('Kirim pendaftaran? Data tidak dapat diubah setelah dikirim.')) return;
        setSubmitting(true);
        router.post(route('student.registration.finalize'), {}, {
            preserveScroll: true,
        });
    }

    return (
        <div>
            <h3 className="mb-4 text-xl font-bold text-gray-800">Konfirmasi Pendaftaran</h3>

            <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50/50 p-4 text-sm text-amber-800 flex items-start gap-3 shadow-sm">
                <svg className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                    <span className="font-semibold block">Perhatian Sebelum Mengirim</span>
                    Mohon periksa kembali semua informasi data diri, pilihan jalur pendaftaran, dan berkas persyaratan yang telah Anda unggah di bawah ini. Setelah Anda menekan tombol **Kirim Pendaftaran**, seluruh data akan dikunci secara permanen dan tidak dapat diubah lagi.
                </div>
            </div>

            <RegistrationSummary registration={registration} documentTypes={documentTypes} />

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-800"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali
                </button>
                <button
                    onClick={handleFinalize}
                    disabled={submitting}
                    className="rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-12 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-200 transition hover:from-emerald-700 hover:to-green-700 hover:shadow-xl disabled:opacity-50"
                >
                    {submitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
                </button>
            </div>
            <p className="mt-4 text-center text-sm text-gray-400">
                Pastikan semua data sudah benar. Data tidak dapat diubah setelah dikirim.
            </p>
        </div>
    );
}

function RegistrationSummary({ registration, documentTypes = [] }) {
    const bio = registration?.student_biodata;
    const docs = registration?.student_documents || [];

    function isImage(filePath) {
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
    }

    return (
        <div className="space-y-6">
            {/* Info Jalur */}
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-green-50/30 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-800/80">Jalur Pendaftaran</h4>
                        <p className="text-lg font-bold text-emerald-950">{registration?.admission_path?.name || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Data Diri */}
            {bio && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h4 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-800 border-b border-gray-50 pb-3">
                        <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Data Diri Calon Siswa
                    </h4>
                    
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-4">
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
                        </div>
                        <div className="space-y-4">
                            <div>
                                <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Tempat, Tanggal Lahir</span>
                                <span className="mt-1 block text-sm font-medium text-gray-900">
                                    {bio.birth_place}, {bio.birth_date ? new Date(bio.birth_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Asal Sekolah</span>
                                <span className="mt-1 block text-sm font-medium text-gray-900">{bio.previous_school}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Alamat Rumah</span>
                                <span className="mt-1 block text-sm font-medium text-gray-900">{bio.address}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Nomor Kontak / WA</span>
                                <span className="mt-1 block text-sm font-medium text-gray-900">{bio.phone_number || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Dokumen Terupload */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h4 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-800 border-b border-gray-50 pb-3">
                    <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Dokumen Persyaratan ({docs.length})
                </h4>

                {docs.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {docs.map((doc) => {
                            const typeColor = docTypeColors[doc.document_type] || docTypeColors.other;
                            const typeLabel = documentTypes.find(dt => dt.code === doc.document_type)?.name || docTypeLabels[doc.document_type] || doc.document_type.replace('_', ' ');
                            const fileName = doc.file_path.split('/').pop();
                            const fileIsImage = isImage(doc.file_path);

                            return (
                                <div key={doc.id} className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
                                    <div className="relative h-28 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                                        {fileIsImage ? (
                                            <img
                                                src={`/storage/${doc.file_path}`}
                                                alt={typeLabel}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                                                    <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <span className="text-[10px] font-semibold text-gray-500">PDF</span>
                                            </div>
                                        )}
                                        <a
                                            href={`/storage/${doc.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/30"
                                        >
                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm opacity-0 transition-all group-hover:opacity-100 backdrop-blur-sm">
                                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                Lihat Berkas
                                            </span>
                                        </a>
                                    </div>
                                    <div className="p-3">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${typeColor}`}>
                                            {typeLabel}
                                        </span>
                                        <p className="mt-1 truncate text-xs text-gray-400" title={fileName}>
                                            {fileName}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-6 text-center text-sm text-gray-400">Belum ada dokumen terunggah.</div>
                )}
            </div>
        </div>
    );
}
