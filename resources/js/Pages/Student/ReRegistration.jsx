import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

export default function ReRegistration({ registration, activeYear }) {
    const { madrasah_setting } = usePage().props;
    const bio = registration?.student_biodata || {};
    const parent = registration?.student_parent || {};

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return dateStr.split('T')[0];
    };

    const { data, setData, post, processing, errors } = useForm({
        // Student Biodata - Existing
        nisn: bio.nisn || '',
        full_name: bio.full_name || '',
        gender: bio.gender || '',
        birth_place: bio.birth_place || '',
        birth_date: formatDate(bio.birth_date),
        address: bio.address || '',
        phone_number: bio.phone_number || '',
        previous_school: bio.previous_school || '',

        // Student Biodata - New
        nik: bio.nik || '',
        child_order: bio.child_order || '',
        siblings_count: bio.siblings_count || '',
        student_status: bio.student_status || 'Anak Kandung',
        district: bio.district || '',
        subdistrict: bio.subdistrict || '',
        living_status: bio.living_status || 'Orang Tua',
        distance_to_school: bio.distance_to_school || '< 1 KM',
        blood_type: bio.blood_type || '',
        disability: bio.disability || '',

        // Previous School details
        previous_school_status: bio.previous_school_status || 'Swasta',
        previous_school_npsn: bio.previous_school_npsn || '',
        previous_school_address: bio.previous_school_address || '',
        previous_school_city: bio.previous_school_city || '',
        previous_school_district: bio.previous_school_district || '',
        previous_school_subdistrict: bio.previous_school_subdistrict || '',

        // Father
        father_name: parent.father_name || '',
        father_birth_place: parent.father_birth_place || '',
        father_birth_date: formatDate(parent.father_birth_date),
        father_nik: parent.father_nik || '',
        father_education: parent.father_education || 'S1',
        father_occupation: parent.father_occupation || '',
        father_income: parent.father_income || '',
        father_address: parent.father_address || '',
        father_phone: parent.father_phone || '',
        father_status: parent.father_status || 'Masih Hidup',

        // Mother
        mother_name: parent.mother_name || '',
        mother_birth_place: parent.mother_birth_place || '',
        mother_birth_date: formatDate(parent.mother_birth_date),
        mother_nik: parent.mother_nik || '',
        mother_education: parent.mother_education || 'S1',
        mother_occupation: parent.mother_occupation || '',
        mother_income: parent.mother_income || '',
        mother_address: parent.mother_address || '',
        mother_phone: parent.mother_phone || '',
        mother_status: parent.mother_status || 'Masih Hidup',

        // Guardian
        guardian_name: parent.guardian_name || '',
        guardian_birth_place: parent.guardian_birth_place || '',
        guardian_birth_date: formatDate(parent.guardian_birth_date),
        guardian_nik: parent.guardian_nik || '',
        guardian_education: parent.guardian_education || '',
        guardian_occupation: parent.guardian_occupation || '',
        guardian_income: parent.guardian_income || '',
        guardian_address: parent.guardian_address || '',
        guardian_phone: parent.guardian_phone || '',
        guardian_status: parent.guardian_status || '',

        // Statement Agreements
        student_statement_agree: false,
        parent_statement_agree: false,
        participation_statement_agree: false,
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [guardianType, setGuardianType] = useState('manual'); // manual, father, mother

    const handleGuardianTypeChange = (type) => {
        setGuardianType(type);
        if (type === 'father') {
            setData((prev) => ({
                ...prev,
                guardian_name: data.father_name,
                guardian_birth_place: data.father_birth_place,
                guardian_birth_date: data.father_birth_date,
                guardian_nik: data.father_nik,
                guardian_education: data.father_education,
                guardian_occupation: data.father_occupation,
                guardian_income: data.father_income,
                guardian_address: data.father_address,
                guardian_phone: data.father_phone,
                guardian_status: data.father_status,
            }));
        } else if (type === 'mother') {
            setData((prev) => ({
                ...prev,
                guardian_name: data.mother_name,
                guardian_birth_place: data.mother_birth_place,
                guardian_birth_date: data.mother_birth_date,
                guardian_nik: data.mother_nik,
                guardian_education: data.mother_education,
                guardian_occupation: data.mother_occupation,
                guardian_income: data.mother_income,
                guardian_address: data.mother_address,
                guardian_phone: data.mother_phone,
                guardian_status: data.mother_status,
            }));
        } else {
            setData((prev) => ({
                ...prev,
                guardian_name: '',
                guardian_birth_place: '',
                guardian_birth_date: '',
                guardian_nik: '',
                guardian_education: '',
                guardian_occupation: '',
                guardian_income: '',
                guardian_address: '',
                guardian_phone: '',
                guardian_status: '',
            }));
        }
    };

    const nextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, 8));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student.re-registration.submit'));
    };

    const steps = [
        { id: 1, title: 'Biodata' },
        { id: 2, title: 'Sekolah' },
        { id: 3, title: 'Ayah' },
        { id: 4, title: 'Ibu' },
        { id: 5, title: 'Wali' },
        { id: 6, title: 'Pern. Siswa' },
        { id: 7, title: 'Pern. Ortu' },
        { id: 8, title: 'Partisipasi' },
    ];

    const studentPoints = madrasah_setting?.student_statement_points
        ? madrasah_setting.student_statement_points.split('\n').map(p => p.trim()).filter(Boolean)
        : [];
    const parentPoints = madrasah_setting?.parent_statement_points
        ? madrasah_setting.parent_statement_points.split('\n').map(p => p.trim()).filter(Boolean)
        : [];
    const participationPoints = madrasah_setting?.participation_statement_points
        ? madrasah_setting.participation_statement_points.split('\n').map(p => p.trim()).filter(Boolean)
        : [];

    const bloodTypes = ['-', 'A', 'B', 'AB', 'O'];
    const educationOptions = ['SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3', 'Lainnya'];
    const occupationOptions = ['Tidak Bekerja', 'PNS', 'Karyawan Swasta', 'Wiraswasta', 'Guru/Dosen', 'TNI/Polri', 'Petani/Nelayan', 'Buruh', 'Ibu Rumah Tangga', 'Lainnya'];
    const incomeOptions = ['Tidak Berpenghasilan', '< 1 Juta', '1 - 3 Juta', '3 - 5 Juta', '5 - 10 Juta', '> 10 Juta'];

    return (
        <StudentLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#468432] to-[#9AD872] shadow-lg shadow-emerald-100">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Daftar Ulang Siswa</h2>
                        <p className="text-sm text-gray-500">Lengkapi formulir pendaftaran ulang di bawah ini.</p>
                    </div>
                </div>
            }
        >
            <Head title="Daftar Ulang" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Stepper Header */}
                    <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            {steps.map((step, idx) => (
                                <React.Fragment key={step.id}>
                                    <div className="flex items-center gap-2">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                                            currentStep === step.id
                                                ? 'bg-[#468432] text-white shadow-md shadow-[#468432]/25'
                                                : currentStep > step.id
                                                ? 'bg-emerald-100 text-[#468432]'
                                                : 'bg-gray-100 text-gray-400'
                                        }`}>
                                            {currentStep > step.id ? (
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : step.id}
                                        </div>
                                        <span className={`text-xs font-semibold ${
                                            currentStep === step.id ? 'text-gray-900 font-bold' : 'text-gray-400'
                                        }`}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {idx < steps.length - 1 && (
                                        <div className="hidden md:block flex-1 h-0.5 bg-gray-100 min-w-[8px] mx-1" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Main Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Validation Error Alert */}
                        {Object.keys(errors).length > 0 && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                                <div className="flex gap-2">
                                    <svg className="h-5 w-5 shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div>
                                        <span className="font-bold">Terdapat beberapa kesalahan input:</span>
                                        <ul className="list-disc pl-5 mt-1.5 space-y-0.5">
                                            {Object.entries(errors).map(([key, val]) => (
                                                <li key={key}>{val}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm ring-1 ring-gray-100">
                            {/* STEP 1: DATA DIRI SISWA */}
                            {currentStep === 1 && (
                                <div className="space-y-5">
                                    <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">A. Keterangan Tentang Diri Siswa</h3>
                                    
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                value={data.full_name}
                                                onChange={(e) => setData('full_name', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">NISN</label>
                                            <input
                                                type="text"
                                                value={data.nisn}
                                                onChange={(e) => setData('nisn', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">NIK Siswa (16 Digit) <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                maxLength={16}
                                                value={data.nik}
                                                onChange={(e) => setData('nik', e.target.value.replace(/\D/g, ''))}
                                                placeholder="647401..."
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Jenis Kelamin</label>
                                            <select
                                                value={data.gender}
                                                onChange={(e) => setData('gender', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            >
                                                <option value="male">Laki-Laki</option>
                                                <option value="female">Perempuan</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Tempat Lahir</label>
                                            <input
                                                type="text"
                                                value={data.birth_place}
                                                onChange={(e) => setData('birth_place', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Tanggal Lahir</label>
                                            <input
                                                type="date"
                                                value={data.birth_date}
                                                onChange={(e) => setData('birth_date', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Anak Ke- <span className="text-red-500">*</span></label>
                                            <input
                                                type="number"
                                                min={1}
                                                value={data.child_order}
                                                onChange={(e) => setData('child_order', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Jumlah Saudara Kandung <span className="text-red-500">*</span></label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={data.siblings_count}
                                                onChange={(e) => setData('siblings_count', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Status Anak <span className="text-red-500">*</span></label>
                                            <select
                                                value={data.student_status}
                                                onChange={(e) => setData('student_status', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            >
                                                <option value="Anak Kandung">Anak Kandung</option>
                                                <option value="Anak Angkat">Anak Angkat</option>
                                                <option value="Anak Tiri">Anak Tiri</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Nomor HP / WhatsApp</label>
                                            <input
                                                type="text"
                                                value={data.phone_number}
                                                onChange={(e) => setData('phone_number', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                    </div>

                                    <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pt-4 pb-3">B. Keterangan Tempat Tinggal & Kesehatan</h3>
                                    
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Alamat Rumah Lengkap</label>
                                            <textarea
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                rows={2}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Kecamatan <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.district}
                                                onChange={(e) => setData('district', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Kelurahan/Desa <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.subdistrict}
                                                onChange={(e) => setData('subdistrict', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Tinggal Dengan <span className="text-red-500">*</span></label>
                                            <select
                                                value={data.living_status}
                                                onChange={(e) => setData('living_status', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            >
                                                <option value="Orang Tua">Orang Tua</option>
                                                <option value="Wali">Wali</option>
                                                <option value="Kos">Kos</option>
                                                <option value="Asrama">Asrama</option>
                                                <option value="Lainnya">Lainnya</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Jarak ke Sekolah <span className="text-red-500">*</span></label>
                                            <select
                                                value={data.distance_to_school}
                                                onChange={(e) => setData('distance_to_school', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            >
                                                <option value="< 1 KM">&lt; 1 KM</option>
                                                <option value="1 - 5 KM">1 - 5 KM</option>
                                                <option value="5 - 10 KM">5 - 10 KM</option>
                                                <option value="11 - 20 KM">11 - 20 KM</option>
                                                <option value="> 20 KM">&gt; 20 KM</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Golongan Darah</label>
                                            <select
                                                value={data.blood_type}
                                                onChange={(e) => setData('blood_type', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            >
                                                {bloodTypes.map((t) => (
                                                    <option key={t} value={t === '-' ? '' : t}>{t}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Kelainan Jasmani (Jika Ada)</label>
                                            <input
                                                type="text"
                                                value={data.disability}
                                                placeholder="Tidak ada / Asma / dll."
                                                onChange={(e) => setData('disability', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: ASAL SEKOLAH & STATUS DI MADRASAH */}
                            {currentStep === 2 && (
                                <div className="space-y-5">
                                    <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">D. Keterangan Pendidikan Asal Sekolah</h3>
                                    
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Nama Asal Sekolah (SMP/MTs)</label>
                                            <input
                                                type="text"
                                                value={data.previous_school}
                                                onChange={(e) => setData('previous_school', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Status Asal Sekolah <span className="text-red-500">*</span></label>
                                            <select
                                                value={data.previous_school_status}
                                                onChange={(e) => setData('previous_school_status', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            >
                                                <option value="Negeri">Negeri</option>
                                                <option value="Swasta">Swasta</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">NPSN Sekolah Asal <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.previous_school_npsn}
                                                onChange={(e) => setData('previous_school_npsn', e.target.value.replace(/\D/g, ''))}
                                                placeholder="NPSN 8 digit"
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Kota / Kabupaten Sekolah Asal <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.previous_school_city}
                                                onChange={(e) => setData('previous_school_city', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Kecamatan Sekolah Asal <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.previous_school_district}
                                                onChange={(e) => setData('previous_school_district', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Kelurahan Sekolah Asal <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.previous_school_subdistrict}
                                                onChange={(e) => setData('previous_school_subdistrict', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Alamat Lengkap Sekolah Asal <span className="text-red-500">*</span></label>
                                            <textarea
                                                value={data.previous_school_address}
                                                onChange={(e) => setData('previous_school_address', e.target.value)}
                                                rows={2}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                    </div>

                                    <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pt-4 pb-3">Diterima di Madrasah ini (Hanya-Baca)</h3>
                                    
                                    <div className="grid gap-6 md:grid-cols-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div>
                                            <span className="block text-xs font-semibold text-gray-400 uppercase">Di Kelas</span>
                                            <span className="mt-1 block text-sm font-semibold text-gray-800">X (Sepuluh)</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs font-semibold text-gray-400 uppercase">Program/Jalur</span>
                                            <span className="mt-1 block text-sm font-semibold text-gray-800">{registration.admission_path?.name || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs font-semibold text-gray-400 uppercase">Tanggal Masuk</span>
                                            <span className="mt-1 block text-sm font-semibold text-gray-800">
                                                {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: DATA AYAH KANDUNG */}
                            {currentStep === 3 && (
                                <div className="space-y-5">
                                    <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">E. Keterangan Tentang Ayah Kandung</h3>
                                    
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Nama Lengkap Ayah <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.father_name}
                                                onChange={(e) => setData('father_name', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">NIK Ayah (16 Digit) <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                maxLength={16}
                                                value={data.father_nik}
                                                onChange={(e) => setData('father_nik', e.target.value.replace(/\D/g, ''))}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Tempat Lahir Ayah <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.father_birth_place}
                                                onChange={(e) => setData('father_birth_place', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Tanggal Lahir Ayah <span className="text-red-500">*</span></label>
                                            <input
                                                type="date"
                                                value={data.father_birth_date}
                                                onChange={(e) => setData('father_birth_date', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Status Ayah <span className="text-red-500">*</span></label>
                                            <select
                                                value={data.father_status}
                                                onChange={(e) => setData('father_status', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            >
                                                <option value="Masih Hidup">Masih Hidup</option>
                                                <option value="Meninggal Dunia">Meninggal Dunia</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Pendidikan Terakhir <span className="text-red-500">*</span></label>
                                            <select
                                                value={data.father_education}
                                                onChange={(e) => setData('father_education', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            >
                                                {educationOptions.map((e) => (
                                                    <option key={e} value={e}>{e}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {data.father_status === 'Masih Hidup' && (
                                            <>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Pekerjaan <span className="text-red-500">*</span></label>
                                                    <select
                                                        value={data.father_occupation}
                                                        onChange={(e) => setData('father_occupation', e.target.value)}
                                                        className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                                    >
                                                        <option value="">Pilih Pekerjaan</option>
                                                        {occupationOptions.map((o) => (
                                                            <option key={o} value={o}>{o}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Penghasilan Per Bulan <span className="text-red-500">*</span></label>
                                                    <select
                                                        value={data.father_income}
                                                        onChange={(e) => setData('father_income', e.target.value)}
                                                        className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                                    >
                                                        <option value="">Pilih Penghasilan</option>
                                                        {incomeOptions.map((i) => (
                                                            <option key={i} value={i}>{i}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">No. HP / WhatsApp <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={data.father_phone}
                                                        onChange={(e) => setData('father_phone', e.target.value.replace(/\D/g, ''))}
                                                        className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Alamat Rumah Ayah <span className="text-red-500">*</span></label>
                                                    <textarea
                                                        value={data.father_address}
                                                        onChange={(e) => setData('father_address', e.target.value)}
                                                        rows={2}
                                                        className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: DATA IBU KANDUNG */}
                            {currentStep === 4 && (
                                <div className="space-y-5">
                                    <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">F. Keterangan Tentang Ibu Kandung</h3>
                                    
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Nama Lengkap Ibu <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.mother_name}
                                                onChange={(e) => setData('mother_name', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">NIK Ibu (16 Digit) <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                maxLength={16}
                                                value={data.mother_nik}
                                                onChange={(e) => setData('mother_nik', e.target.value.replace(/\D/g, ''))}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Tempat Lahir Ibu <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={data.mother_birth_place}
                                                onChange={(e) => setData('mother_birth_place', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Tanggal Lahir Ibu <span className="text-red-500">*</span></label>
                                            <input
                                                type="date"
                                                value={data.mother_birth_date}
                                                onChange={(e) => setData('mother_birth_date', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Status Ibu <span className="text-red-500">*</span></label>
                                            <select
                                                value={data.mother_status}
                                                onChange={(e) => setData('mother_status', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            >
                                                <option value="Masih Hidup">Masih Hidup</option>
                                                <option value="Meninggal Dunia">Meninggal Dunia</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Pendidikan Terakhir <span className="text-red-500">*</span></label>
                                            <select
                                                value={data.mother_education}
                                                onChange={(e) => setData('mother_education', e.target.value)}
                                                className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                            >
                                                {educationOptions.map((e) => (
                                                    <option key={e} value={e}>{e}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {data.mother_status === 'Masih Hidup' && (
                                            <>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Pekerjaan <span className="text-red-500">*</span></label>
                                                    <select
                                                        value={data.mother_occupation}
                                                        onChange={(e) => setData('mother_occupation', e.target.value)}
                                                        className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                                    >
                                                        <option value="">Pilih Pekerjaan</option>
                                                        {occupationOptions.map((o) => (
                                                            <option key={o} value={o}>{o}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Penghasilan Per Bulan <span className="text-red-500">*</span></label>
                                                    <select
                                                        value={data.mother_income}
                                                        onChange={(e) => setData('mother_income', e.target.value)}
                                                        className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                                    >
                                                        <option value="">Pilih Penghasilan</option>
                                                        {incomeOptions.map((i) => (
                                                            <option key={i} value={i}>{i}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">No. HP / WhatsApp <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={data.mother_phone}
                                                        onChange={(e) => setData('mother_phone', e.target.value.replace(/\D/g, ''))}
                                                        className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Alamat Rumah Ibu <span className="text-red-500">*</span></label>
                                                    <textarea
                                                        value={data.mother_address}
                                                        onChange={(e) => setData('mother_address', e.target.value)}
                                                        rows={2}
                                                        className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* STEP 5: WALI & REVIEW */}
                            {currentStep === 5 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">G. Keterangan Tentang Wali (Opsional / Tinggal dengan Wali)</h3>
                                        
                                        {/* Autofill selection */}
                                        <div className="mt-4 p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-2.5">
                                            <span className="block text-xs font-bold text-blue-800 uppercase tracking-wider">Fitur Autofill Data Wali</span>
                                            <div className="flex flex-wrap gap-4 text-sm font-medium">
                                                <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                                                    <input
                                                        type="radio"
                                                        name="guardian_autofill"
                                                        checked={guardianType === 'manual'}
                                                        onChange={() => handleGuardianTypeChange('manual')}
                                                        className="text-[#468432] focus:ring-[#468432]"
                                                    />
                                                    Isi Manual (Wali Lainnya)
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                                                    <input
                                                        type="radio"
                                                        name="guardian_autofill"
                                                        checked={guardianType === 'father'}
                                                        onChange={() => handleGuardianTypeChange('father')}
                                                        className="text-[#468432] focus:ring-[#468432]"
                                                    />
                                                    Sama dengan Data Ayah
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                                                    <input
                                                        type="radio"
                                                        name="guardian_autofill"
                                                        checked={guardianType === 'mother'}
                                                        onChange={() => handleGuardianTypeChange('mother')}
                                                        className="text-[#468432] focus:ring-[#468432]"
                                                    />
                                                    Sama dengan Data Ibu
                                                </label>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2 mt-5">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Nama Lengkap Wali</label>
                                                <input
                                                    type="text"
                                                    value={data.guardian_name}
                                                    disabled={guardianType !== 'manual'}
                                                    onChange={(e) => setData('guardian_name', e.target.value)}
                                                    className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm disabled:bg-gray-50 disabled:text-gray-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">NIK Wali (16 Digit)</label>
                                                <input
                                                    type="text"
                                                    maxLength={16}
                                                    value={data.guardian_nik}
                                                    disabled={guardianType !== 'manual'}
                                                    onChange={(e) => setData('guardian_nik', e.target.value.replace(/\D/g, ''))}
                                                    className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm disabled:bg-gray-50 disabled:text-gray-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Tempat Lahir Wali</label>
                                                <input
                                                    type="text"
                                                    value={data.guardian_birth_place}
                                                    disabled={guardianType !== 'manual'}
                                                    onChange={(e) => setData('guardian_birth_place', e.target.value)}
                                                    className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm disabled:bg-gray-50 disabled:text-gray-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Tanggal Lahir Wali</label>
                                                <input
                                                    type="date"
                                                    value={data.guardian_birth_date}
                                                    disabled={guardianType !== 'manual'}
                                                    onChange={(e) => setData('guardian_birth_date', e.target.value)}
                                                    className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm disabled:bg-gray-50 disabled:text-gray-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Pendidikan Terakhir Wali</label>
                                                <select
                                                    value={data.guardian_education}
                                                    disabled={guardianType !== 'manual'}
                                                    onChange={(e) => setData('guardian_education', e.target.value)}
                                                    className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm disabled:bg-gray-50 disabled:text-gray-500"
                                                >
                                                    <option value="">Pilih Pendidikan</option>
                                                    {educationOptions.map((e) => (
                                                        <option key={e} value={e}>{e}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Pekerjaan Wali</label>
                                                <select
                                                    value={data.guardian_occupation}
                                                    disabled={guardianType !== 'manual'}
                                                    onChange={(e) => setData('guardian_occupation', e.target.value)}
                                                    className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm disabled:bg-gray-50 disabled:text-gray-500"
                                                >
                                                    <option value="">Pilih Pekerjaan</option>
                                                    {occupationOptions.map((o) => (
                                                        <option key={o} value={o}>{o}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Penghasilan Wali Per Bulan</label>
                                                <select
                                                    value={data.guardian_income}
                                                    disabled={guardianType !== 'manual'}
                                                    onChange={(e) => setData('guardian_income', e.target.value)}
                                                    className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm disabled:bg-gray-50 disabled:text-gray-500"
                                                >
                                                    <option value="">Pilih Penghasilan</option>
                                                    {incomeOptions.map((i) => (
                                                        <option key={i} value={i}>{i}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">No. HP / WhatsApp Wali</label>
                                                <input
                                                    type="text"
                                                    value={data.guardian_phone}
                                                    disabled={guardianType !== 'manual'}
                                                    onChange={(e) => setData('guardian_phone', e.target.value.replace(/\D/g, ''))}
                                                    className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm disabled:bg-gray-50 disabled:text-gray-500"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Alamat Rumah Wali</label>
                                                <textarea
                                                    value={data.guardian_address}
                                                    disabled={guardianType !== 'manual'}
                                                    onChange={(e) => setData('guardian_address', e.target.value)}
                                                    rows={2}
                                                    className="mt-1.5 block w-full rounded-xl border-gray-200 shadow-sm focus:border-[#468432] focus:ring-[#468432] text-sm disabled:bg-gray-50 disabled:text-gray-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* STEP 6: SURAT PERNYATAAN SISWA */}
                            {currentStep === 6 && (
                                <div className="space-y-5">
                                    <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">H. Surat Pernyataan Calon Siswa</h3>
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 leading-relaxed mb-4">
                                        <p className="font-semibold mb-1">PENTING:</p>
                                        Harap baca dan pahami seluruh butir pernyataan di bawah ini sebelum menyetujui.
                                    </div>
                                    <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5 space-y-4 max-h-[300px] overflow-y-auto">
                                        <p className="text-sm font-semibold text-gray-700">Dengan ini saya menyatakan bahwa saya:</p>
                                        <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600 leading-relaxed">
                                            {studentPoints.length > 0 ? (
                                                studentPoints.map((point, index) => (
                                                    <li key={index}>{point}</li>
                                                ))
                                            ) : (
                                                <li>Akan mematuhi semua tata tertib madrasah.</li>
                                            )}
                                        </ol>
                                    </div>
                                    <div className="mt-5">
                                        <label className="relative flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
                                            <div className="flex h-5 items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.student_statement_agree}
                                                    onChange={(e) => setData('student_statement_agree', e.target.checked)}
                                                    className="h-4.5 w-4.5 rounded border-gray-300 text-[#468432] focus:ring-[#468432]"
                                                />
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-bold text-gray-950">Saya menyetujui Surat Pernyataan Siswa di atas.</span>
                                                <p className="text-xs text-gray-500 mt-1">Saya memahami dan bersedia mematuhi seluruh peraturan yang berlaku.</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* STEP 7: SURAT PERNYATAAN ORANG TUA */}
                            {currentStep === 7 && (
                                <div className="space-y-5">
                                    <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">I. Surat Pernyataan Orang Tua / Wali</h3>
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 leading-relaxed mb-4">
                                        <p className="font-semibold mb-1">PENTING:</p>
                                        Harap baca dan pahami seluruh butir komitmen orang tua di bawah ini sebelum menyetujui.
                                    </div>
                                    <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5 space-y-4 max-h-[300px] overflow-y-auto">
                                        <p className="text-sm font-semibold text-gray-700">Saya sebagai orang tua/wali dari calon siswa menyatakan bersedia:</p>
                                        <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600 leading-relaxed">
                                            {parentPoints.length > 0 ? (
                                                parentPoints.map((point, index) => (
                                                    <li key={index}>{point}</li>
                                                ))
                                            ) : (
                                                <li>Mendampingi anak dalam proses belajar di madrasah.</li>
                                            )}
                                        </ol>
                                    </div>
                                    <div className="mt-5">
                                        <label className="relative flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
                                            <div className="flex h-5 items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.parent_statement_agree}
                                                    onChange={(e) => setData('parent_statement_agree', e.target.checked)}
                                                    className="h-4.5 w-4.5 rounded border-gray-300 text-[#468432] focus:ring-[#468432]"
                                                />
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-bold text-gray-950">Saya menyetujui Surat Pernyataan Orang Tua di atas.</span>
                                                <p className="text-xs text-gray-500 mt-1">Saya menyatakan komitmen penuh sebagai wali/orang tua siswa.</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* STEP 8: SURAT PERNYATAAN PARTISIPASI & REVIEW */}
                            {currentStep === 8 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">J. Surat Pernyataan Partisipasi Orang Tua / Wali</h3>
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 leading-relaxed mb-4">
                                            <p className="font-semibold mb-1">PENTING:</p>
                                            Pernyataan ini berkaitan dengan partisipasi aktif dalam program madrasah.
                                        </div>
                                        <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5 space-y-4 max-h-[300px] overflow-y-auto">
                                            <p className="text-sm font-semibold text-gray-700">Sebagai bentuk dukungan terhadap program pendidikan, saya bersedia:</p>
                                            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600 leading-relaxed">
                                                {participationPoints.length > 0 ? (
                                                    participationPoints.map((point, index) => (
                                                        <li key={index}>{point}</li>
                                                    ))
                                                ) : (
                                                    <li>Berpartisipasi aktif dalam kegiatan komite madrasah.</li>
                                                )}
                                            </ol>
                                        </div>
                                        <div className="mt-5">
                                            <label className="relative flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
                                                <div className="flex h-5 items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.participation_statement_agree}
                                                        onChange={(e) => setData('participation_statement_agree', e.target.checked)}
                                                        className="h-4.5 w-4.5 rounded border-gray-300 text-[#468432] focus:ring-[#468432]"
                                                    />
                                                </div>
                                                <div className="text-sm">
                                                    <span className="font-bold text-gray-950">Saya menyetujui Surat Pernyataan Partisipasi di atas.</span>
                                                    <p className="text-xs text-gray-500 mt-1">Saya bersedia ikut serta memajukan madrasah.</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Confirmation Section */}
                                    <div className="border-t border-gray-150 pt-5 space-y-3">
                                        <h4 className="text-sm font-bold text-gray-900">Pernyataan Konfirmasi Akhir</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            Dengan menekan tombol kirim di bawah, saya menyatakan bahwa seluruh data yang telah diisi di form pendaftaran ulang ini (termasuk persetujuan pernyataan di atas) adalah benar dan dapat dipertanggungjawabkan.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Footer */}
                        <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                            {currentStep > 1 ? (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Sebelumnya
                                </button>
                            ) : (
                                <Link
                                    href={route('student.dashboard')}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-500 shadow-sm transition hover:bg-gray-50"
                                >
                                    Batal
                                </Link>
                            )}

                            {currentStep < 8 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#468432] to-[#9AD872] px-6 py-2.5 text-sm font-bold text-white shadow-sm shadow-emerald-100 hover:opacity-95 transition"
                                >
                                    Selanjutnya
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#468432] to-[#9AD872] px-7 py-3 text-sm font-bold text-white shadow-md shadow-[#468432]/25 hover:shadow-lg hover:opacity-95 transition disabled:opacity-50"
                                >
                                    {processing ? 'Mengirim...' : 'Kirim Pendaftaran Ulang'}
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </StudentLayout>
    );
}
