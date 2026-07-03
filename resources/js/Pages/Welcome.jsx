import { Head, Link } from '@inertiajs/react';
import Toast from '@/Components/Toast';
import { useState, useEffect, useCallback } from 'react';
import { formatDate } from '@/lib/utils';

export default function Welcome({ auth, madrasah, activeYear, schedules, activityRequirements, popUpBanners, paths = [] }) {
    const now = new Date();
    const registrationStart = activeYear?.registration_start ? new Date(activeYear.registration_start) : null;
    const registrationEnd = activeYear?.registration_end ? new Date(activeYear.registration_end) : null;
    
    const isNotOpenedYet = registrationStart && now < registrationStart;
    const isAlreadyClosed = registrationEnd && now > registrationEnd;
    const isRegistrationOpen = activeYear && activeYear.is_active && !isNotOpenedYet && !isAlreadyClosed;

    const formatIndonesianDateTime = (dateObj) => {
        if (!dateObj) return '';
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const date = dateObj.getDate();
        const month = months[dateObj.getMonth()];
        const year = dateObj.getFullYear();
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        
        return `${date} ${month} ${year} pukul ${hours}:${minutes} WIB`;
    };

    const phaseColors = [
        { border: 'border-l-emerald-500', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
        { border: 'border-l-blue-500', bg: 'bg-blue-50', dot: 'bg-blue-500' },
        { border: 'border-l-violet-500', bg: 'bg-violet-50', dot: 'bg-violet-500' },
        { border: 'border-l-amber-500', bg: 'bg-amber-50', dot: 'bg-amber-500' },
        { border: 'border-l-rose-500', bg: 'bg-rose-50', dot: 'bg-rose-500' },
    ];

    const [popupOpen, setPopupOpen] = useState(false);
    const [activeBannerIdx, setActiveBannerIdx] = useState(0);
    const [zoomed, setZoomed] = useState(false);
    const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        if (popUpBanners.length > 0 && !sessionStorage.getItem('popup_seen')) {
            setPopupOpen(true);
            sessionStorage.setItem('popup_seen', '1');
        }
    }, [popUpBanners]);

    const closePopup = useCallback(() => {
        setPopupOpen(false);
        setZoomed(false);
        setDragPos({ x: 0, y: 0 });
    }, []);

    const toggleZoom = useCallback((e) => {
        e.stopPropagation();
        if (zoomed) {
            setZoomed(false);
            setDragPos({ x: 0, y: 0 });
        } else {
            setZoomed(true);
        }
    }, [zoomed]);

    const handleMouseDown = useCallback((e) => {
        if (!zoomed) return;
        e.preventDefault();
        setDragging(true);
        setDragStart({ x: e.clientX - dragPos.x, y: e.clientY - dragPos.y });
    }, [zoomed, dragPos]);

    const handleMouseMove = useCallback((e) => {
        if (!dragging) return;
        setDragPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }, [dragging, dragStart]);

    const handleMouseUp = useCallback(() => {
        setDragging(false);
    }, []);

    // Touch support for mobile zoom pan
    const handleTouchStart = useCallback((e) => {
        if (!zoomed) return;
        const touch = e.touches[0];
        setDragging(true);
        setDragStart({ x: touch.clientX - dragPos.x, y: touch.clientY - dragPos.y });
    }, [zoomed, dragPos]);

    const handleTouchMove = useCallback((e) => {
        if (!dragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        setDragPos({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
    }, [dragging, dragStart]);

    const handleTouchEnd = useCallback(() => {
        setDragging(false);
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') closePopup();
        if (e.key === 'ArrowLeft') {
            setActiveBannerIdx((prev) => (prev - 1 + popUpBanners.length) % popUpBanners.length);
            setZoomed(false);
            setDragPos({ x: 0, y: 0 });
        }
        if (e.key === 'ArrowRight') {
            setActiveBannerIdx((prev) => (prev + 1) % popUpBanners.length);
            setZoomed(false);
            setDragPos({ x: 0, y: 0 });
        }
    }, [closePopup, popUpBanners.length]);

    useEffect(() => {
        if (popupOpen) document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [popupOpen, handleKeyDown]);

    const activeBanner = popUpBanners[activeBannerIdx];

    return (
        <>
            <Head title="Beranda" />

            <div className="flex min-h-screen flex-col bg-gradient-to-br from-green-50 via-white to-emerald-50">
                <header className="border-b border-green-100 bg-white/80 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            {madrasah?.logo_path ? (
                                <img
                                    src={`/storage/${madrasah.logo_path}`}
                                    className="h-10 w-10 rounded-lg object-contain"
                                    alt="Logo"
                                />
                            ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-white font-bold text-lg">
                                    M
                                </div>
                            )}
                            <div>
                                <h1 className="text-lg font-bold text-green-800">
                                    {madrasah?.madrasah_name || 'PPDB Madrasah Aliyah'}
                                </h1>
                                <p className="text-xs text-green-600">Penerimaan Peserta Didik Baru</p>
                            </div>
                        </div>

                        <nav className="flex items-center gap-5">
                            {(madrasah?.show_announcement ?? true) && (
                                <Link
                                    href={route('announcement')}
                                    className="text-sm font-medium text-green-700 transition hover:text-green-800"
                                >
                                    Pengumuman
                                </Link>
                            )}
                            {auth.user ? (
                                <>
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                                    >
                                        Dashboard
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-medium text-green-700 transition hover:text-green-800"
                                    >
                                        Masuk
                                    </Link>
                                    {isRegistrationOpen && (
                                        <Link
                                            href={route('register')}
                                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                                        >
                                            Daftar Akun
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="flex-1">
                    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-7 space-y-6 text-left">
                                {activeYear && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/10">
                                        Tahun Ajaran {activeYear.name}
                                    </span>
                                )}
                                <h2 className="text-4xl font-extrabold tracking-tight text-green-950 sm:text-5xl lg:leading-tight">
                                    Selamat Datang di PPDB <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">{madrasah?.madrasah_name || 'Madrasah Aliyah'}</span>
                                </h2>
                                <p className="text-lg text-green-705/90 leading-relaxed max-w-xl">
                                    Sistem Penerimaan Peserta Didik Baru terintegrasi. Daftarkan diri Anda secara online dengan mudah, cepat, dan transparan.
                                </p>
                                
                                <div>
                                    <div className="pt-4 flex flex-wrap items-center gap-4">
                                        {activeYear ? (
                                            isRegistrationOpen ? (
                                                auth.user ? (
                                                    <Link
                                                        href={route('student.registration.show')}
                                                        className="inline-flex items-center rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-200 transition hover:opacity-95 hover:shadow-xl"
                                                    >
                                                        Daftar Sekarang
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href={route('register')}
                                                        className="inline-flex items-center rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-200 transition hover:opacity-95 hover:shadow-xl"
                                                    >
                                                        Daftar Sekarang
                                                    </Link>
                                                )
                                            ) : isNotOpenedYet ? (
                                                <button
                                                    disabled
                                                    className="inline-flex items-center rounded-xl bg-gray-100 border border-gray-200 px-8 py-3.5 text-base font-bold text-gray-400 cursor-not-allowed shadow-none"
                                                >
                                                    Belum Dibuka
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="inline-flex items-center rounded-xl bg-gray-100 border border-gray-200 px-8 py-3.5 text-base font-bold text-gray-400 cursor-not-allowed shadow-none"
                                                >
                                                    Pendaftaran Ditutup
                                                </button>
                                            )
                                        ) : (
                                            <button
                                                disabled
                                                className="inline-flex items-center rounded-xl bg-gray-100 border border-gray-200 px-8 py-3.5 text-base font-bold text-gray-400 cursor-not-allowed shadow-none"
                                            >
                                                Pendaftaran Belum Tersedia
                                            </button>
                                        )}
                                        <a
                                            href="#stepper-section"
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-green-200 bg-white px-6 py-3.5 text-base font-semibold text-green-700 shadow-sm transition hover:bg-green-50"
                                        >
                                            Lihat Alur Pendaftaran
                                        </a>
                                    </div>
                                    {activeYear && registrationStart && registrationEnd && (
                                        <p className="mt-4 text-xs text-green-800 font-medium flex items-center gap-1.5 bg-green-50/50 border border-green-100/30 rounded-xl px-4 py-2.5 max-w-xl">
                                            <svg className="h-4 w-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>
                                                Jadwal Pendaftaran: <span className="font-semibold text-emerald-800">{formatIndonesianDateTime(registrationStart)}</span> s.d. <span className="font-semibold text-emerald-800">{formatIndonesianDateTime(registrationEnd)}</span>
                                            </span>
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="lg:col-span-5 relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/50 to-green-50/30 rounded-3xl blur-3xl opacity-70 -z-10" />
                                <div className="relative rounded-2xl overflow-hidden bg-white/40 p-4 backdrop-blur-sm border border-white/60 shadow-xl shadow-green-150/40">
                                    <img
                                        src="/images/welcome_hero.png"
                                        alt="PPDB Siswa Madrasah"
                                        className="w-full h-auto object-cover rounded-xl select-none"
                                        style={{ animation: 'floatAnimation 6s ease-in-out infinite' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {schedules.length > 0 && (
                        <section id="schedule-section" className="border-t border-green-100 bg-white py-20">
                            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                                <div className="text-center mb-16">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/10">
                                        Agenda PPDB
                                    </span>
                                    <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-green-950 sm:text-4xl">
                                        Jadwal Kegiatan PPDB
                                    </h3>
                                    <p className="mt-2 text-base text-green-700">
                                        Tahun Ajaran {activeYear?.name}
                                    </p>
                                </div>

                                <div className="relative">
                                    {/* Vertical center line (desktop) or left line (mobile) */}
                                    <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-emerald-500 via-green-400 to-emerald-100" />

                                    <div className="space-y-12">
                                        {schedules.map((s, idx) => {
                                            const isOdd = idx % 2 === 0;
                                            return (
                                                <div 
                                                    key={s.id} 
                                                    className={`relative flex flex-col md:flex-row items-start md:items-center justify-between w-full group ${
                                                        isOdd ? 'md:flex-row-reverse' : ''
                                                    }`}
                                                >
                                                    {/* Spacer for desktop alignment */}
                                                    <div className="hidden md:block w-[46%]" />

                                                    {/* Timeline Node/Dot */}
                                                    <div className="absolute left-4 md:left-1/2 top-6 md:top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex h-6 w-6 items-center justify-center rounded-full border-4 border-emerald-500 bg-white shadow-md ring-4 ring-emerald-50 transition-all duration-300 group-hover:scale-110 group-hover:border-emerald-600">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 transition-all duration-300 group-hover:bg-emerald-600" />
                                                    </div>

                                                    {/* Timeline Card */}
                                                    <div className="w-[calc(100%-2.5rem)] md:w-[46%] ml-10 md:ml-0 rounded-2xl border border-gray-150 bg-white p-6 shadow-sm transition-all duration-300 hover:border-emerald-300 backdrop-blur-sm group-hover:-translate-y-1 group-hover:shadow-md relative overflow-hidden">
                                                        {/* Top colored accent gradient band */}
                                                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-green-400" />
                                                        
                                                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                                            <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 ring-1 ring-emerald-600/10">
                                                                Tahap {idx + 1}
                                                            </span>
                                                            
                                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                                                                <svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                {formatDate(s.start_date)} — {formatDate(s.end_date)}
                                                            </span>
                                                        </div>
                                                        
                                                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors duration-200">
                                                            {s.activity_name}
                                                        </h4>
                                                        
                                                        {s.requirements && (
                                                            <div 
                                                                className="prose prose-sm prose-green mt-4 max-w-none text-gray-650 border-t border-gray-100 pt-4 [&_h3]:text-xs [&_h3]:font-bold [&_h3]:text-gray-800 [&_ul]:mt-1.5 [&_li]:text-xs [&_li]:text-gray-500"
                                                                dangerouslySetInnerHTML={{ __html: s.requirements }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activityRequirements.length > 0 && (
                        <section id="stepper-section" className="border-t border-green-100 bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20">
                            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                                <div className="text-center mb-16">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/10">
                                        Prosedur PPDB
                                    </span>
                                    <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-green-950 sm:text-4xl">
                                        Persyaratan & Alur Pendaftaran
                                    </h3>
                                    <p className="mt-2 text-base text-green-700">
                                        Ikuti langkah-langkah di bawah ini untuk mempersiapkan pendaftaran Anda
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                                    {/* Stepper Navigation */}
                                    <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 gap-3 md:gap-4 border-b md:border-b-0 border-gray-100 scrollbar-none snap-x md:relative">
                                        {/* Vertical line connector (desktop only) */}
                                        <div className="hidden md:block absolute left-7 top-4 bottom-4 w-0.5 bg-gray-200/85 z-0" />

                                        {activityRequirements.map((req, idx) => {
                                            const isActive = activeStep === idx;
                                            const isPassed = idx < activeStep;
                                            return (
                                                <button
                                                    key={req.id}
                                                    onClick={() => setActiveStep(idx)}
                                                    className="flex items-center gap-4 text-left p-3 rounded-2xl transition-all duration-200 snap-center shrink-0 focus:outline-none focus:ring-2 focus:ring-green-200 z-10 w-auto md:w-full group"
                                                >
                                                    {/* Step Circle */}
                                                    <div 
                                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-bold text-xs transition-all duration-300 ${
                                                            isActive
                                                                ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-200 ring-4 ring-green-50 scale-105'
                                                                : isPassed
                                                                    ? 'bg-green-50 text-green-600 border-green-500'
                                                                    : 'bg-white text-gray-400 border-gray-200 group-hover:border-green-300 group-hover:text-green-600'
                                                        }`}
                                                    >
                                                        {isPassed ? (
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        ) : (
                                                            idx + 1
                                                        )}
                                                    </div>

                                                    {/* Step Title */}
                                                    <div className="min-w-0 pr-2">
                                                        <p className={`text-[10px] font-bold uppercase tracking-wider ${
                                                            isActive ? 'text-green-600' : 'text-gray-400'
                                                        }`}>
                                                            Langkah {idx + 1}
                                                        </p>
                                                        <h4 className={`text-sm font-bold truncate mt-0.5 max-w-[130px] md:max-w-none ${
                                                            isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'
                                                        }`}>
                                                            {req.title}
                                                        </h4>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Stepper Details Card */}
                                    <div className="md:col-span-2">
                                        {activityRequirements[activeStep] && (
                                            <div 
                                                key={activeStep} 
                                                className="rounded-2xl border border-gray-150 bg-white p-8 shadow-sm transition-all duration-300 relative overflow-hidden animate-slide-in-up"
                                            >
                                                {/* Accent Top Bar */}
                                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-green-400" />
                                                
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-bold text-green-600 uppercase tracking-wider">
                                                            Langkah {activeStep + 1} dari {activityRequirements.length}
                                                        </span>
                                                        <h4 className="text-xl font-extrabold text-gray-900 mt-0.5">
                                                            {activityRequirements[activeStep].title}
                                                        </h4>
                                                    </div>
                                                </div>

                                                <div 
                                                    className="prose prose-sm prose-green border-t border-gray-100 pt-6 text-sm text-gray-700 leading-relaxed max-w-none font-sans"
                                                    dangerouslySetInnerHTML={{ __html: activityRequirements[activeStep].description }}
                                                />

                                                {/* Footer Navigation Buttons */}
                                                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                                                    <button
                                                        disabled={activeStep === 0}
                                                        onClick={() => setActiveStep(activeStep - 1)}
                                                        className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                        </svg>
                                                        Sebelumnya
                                                    </button>

                                                    <button
                                                        disabled={activeStep === activityRequirements.length - 1}
                                                        onClick={() => setActiveStep(activeStep + 1)}
                                                        className="inline-flex items-center gap-1.5 rounded-xl bg-green-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                                                    >
                                                        Berikutnya
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {paths.length > 0 && (
                        <section id="paths-section" className="border-t border-green-100 bg-white py-20">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="text-center mb-16">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/10">
                                        Pilihan Jalur
                                    </span>
                                    <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-green-950 sm:text-4xl">
                                        Jalur Pendaftaran PPDB
                                    </h3>
                                    <p className="mt-2 text-base text-green-700">
                                        Pilih jalur masuk yang sesuai dengan kriteria dan berkas persyaratan Anda
                                    </p>
                                </div>

                                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 justify-center">
                                    {paths.map((path) => (
                                        <div key={path.id} className="relative group overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-emerald-300 hover:-translate-y-1 hover:shadow-md">
                                            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 to-green-400" />
                                            
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-lg font-bold text-gray-900">{path.name}</h4>
                                            </div>
                                            
                                            <p className="text-sm text-gray-600 mb-6 min-h-[4.5rem]">
                                                {path.description || 'Pendaftaran melalui jalur masuk resmi yang dibuka.'}
                                            </p>
                                            
                                            <div className="flex items-center justify-between border-t border-gray-50 pt-4 text-xs font-semibold text-gray-500">
                                                <span>Kuota Pendaftaran</span>
                                                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg ring-1 ring-emerald-600/10">
                                                    {path.quota} Siswa
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="bg-[#0b160f] text-gray-300 py-16 border-t border-emerald-950">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="grid gap-12 md:grid-cols-3">
                                {/* Column 1: Contact & Address */}
                                <div className="space-y-6">
                                    <h4 className="text-lg font-bold text-white relative pb-3 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-12 after:bg-emerald-500">
                                        Kontak & Alamat
                                    </h4>
                                    <div className="space-y-4 text-sm">
                                        <p className="text-gray-400">
                                            Ada pertanyaan terkait pendaftaran PPDB? Hubungi kami langsung melalui WhatsApp.
                                        </p>
                                        {madrasah?.contact && (
                                            <div>
                                                {(() => {
                                                    const cleanedPhone = madrasah.contact.replace(/[^0-9]/g, '');
                                                    const waNumber = cleanedPhone.startsWith('0') ? '62' + cleanedPhone.slice(1) : cleanedPhone;
                                                    return (
                                                        <a
                                                            href={`https://wa.me/${waNumber}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-650 hover:bg-emerald-550 text-white px-5 py-3.5 font-semibold transition shadow-md shadow-emerald-900/35"
                                                        >
                                                            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.09-3.969l.374.222c1.61.957 3.518 1.463 5.488 1.464 5.568 0 10.103-4.52 10.106-10.089.002-2.697-1.046-5.234-2.95-7.14C17.261 2.58 14.73 1.53 12.002 1.53 6.43 1.53 1.895 6.05 1.892 11.62c-.001 1.882.49 3.729 1.42 5.343l.243.421-1.026 3.743 3.83-1.002z" />
                                                            </svg>
                                                            Hubungi via WhatsApp
                                                        </a>
                                                    );
                                                })()}
                                            </div>
                                        )}
                                        <div className="flex items-start gap-3 mt-4 text-gray-400">
                                            <svg className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{madrasah?.address || '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 2: Quick Links */}
                                <div className="space-y-6">
                                    <h4 className="text-lg font-bold text-white relative pb-3 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-12 after:bg-emerald-500">
                                        Tautan Cepat
                                    </h4>
                                    <ul className="space-y-3 text-sm">
                                        <li>
                                            <a href="#schedule-section" className="text-gray-400 hover:text-emerald-400 transition flex items-center gap-2">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                Jadwal Kegiatan PPDB
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#stepper-section" className="text-gray-400 hover:text-emerald-400 transition flex items-center gap-2">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                Persyaratan Pendaftaran
                                            </a>
                                        </li>
                                        {paths.length > 0 && (
                                            <li>
                                                <a href="#paths-section" className="text-gray-400 hover:text-emerald-400 transition flex items-center gap-2">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                    Jalur Pendaftaran
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                {/* Column 3: Exam Student Illustration */}
                                <div className="space-y-6">
                                    <h4 className="text-lg font-bold text-white relative pb-3 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-12 after:bg-emerald-500">
                                        Ujian Seleksi Masuk
                                    </h4>
                                    <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-2 shadow-inner group">
                                        <img
                                            src="/images/exam_student.png"
                                            alt="Siswa Ujian Seleksi"
                                            className="w-full h-36 object-cover rounded-xl select-none transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent flex items-end p-4">
                                            <span className="text-xs font-semibold text-emerald-400">Computer Based Test (CBT)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-green-100 bg-white py-8 text-center text-sm text-green-600">
                    &copy; {new Date().getFullYear()} PPDB Madrasah Aliyah. All rights reserved.
                </footer>
                <Toast />

                {popupOpen && activeBanner && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ animation: 'lightboxFadeIn 0.3s ease-out forwards' }}
                    >
                        {/* Animated dark overlay */}
                        <div
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={closePopup}
                            style={{ animation: 'lightboxOverlayIn 0.4s ease-out forwards' }}
                        />

                        {/* Close button — floating top-right */}
                        <button
                            onClick={closePopup}
                            className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/20 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white hover:scale-110 hover:ring-white/40"
                            aria-label="Tutup banner"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Lightbox content */}
                        <div
                            className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col items-center"
                            onClick={(e) => e.stopPropagation()}
                            style={{ animation: 'lightboxScaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
                        >
                            {/* Image container with glow effect */}
                            <div
                                className="relative w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/10"
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                <img
                                    src={`/storage/${activeBanner.image}`}
                                    alt={activeBanner.title}
                                    className={`w-full h-auto max-h-[70vh] bg-gradient-to-b from-gray-900 to-gray-950 select-none ${
                                        zoomed ? 'object-cover' : 'object-contain'
                                    }`}
                                    style={{
                                        animation: 'lightboxImgIn 0.5s ease-out 0.15s both',
                                        cursor: zoomed ? (dragging ? 'grabbing' : 'grab') : 'zoom-in',
                                        transform: zoomed
                                            ? `scale(2.5) translate(${dragPos.x / 2.5}px, ${dragPos.y / 2.5}px)`
                                            : 'scale(1)',
                                        transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                                        transformOrigin: 'center center',
                                    }}
                                    onClick={toggleZoom}
                                    onMouseDown={handleMouseDown}
                                    onTouchStart={handleTouchStart}
                                    draggable={false}
                                />

                                {/* Title overlay at bottom of image — hide when zoomed */}
                                {!zoomed && (
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-6 pb-5 pt-12">
                                        <h3
                                            className="text-lg font-semibold text-white drop-shadow-lg sm:text-xl"
                                            style={{ animation: 'lightboxSlideUp 0.4s ease-out 0.25s both' }}
                                        >
                                            {activeBanner.title}
                                        </h3>
                                    </div>
                                )}

                                {/* Zoom indicator */}
                                <button
                                    onClick={toggleZoom}
                                    className={`absolute top-3 left-3 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200 ${
                                        zoomed
                                            ? 'bg-white/25 text-white ring-1 ring-white/40'
                                            : 'bg-black/30 text-white/80 ring-1 ring-white/10 hover:bg-black/50 hover:text-white'
                                    }`}
                                    aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
                                >
                                    {zoomed ? (
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                                        </svg>
                                    ) : (
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Navigation arrows — only show if multiple banners */}
                            {popUpBanners.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveBannerIdx((prev) => (prev - 1 + popUpBanners.length) % popUpBanners.length);
                                            setZoomed(false);
                                            setDragPos({ x: 0, y: 0 });
                                        }}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/20 backdrop-blur-sm transition-all duration-200 hover:bg-white/25 hover:text-white hover:scale-110 sm:-translate-x-14"
                                        aria-label="Banner sebelumnya"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveBannerIdx((prev) => (prev + 1) % popUpBanners.length);
                                            setZoomed(false);
                                            setDragPos({ x: 0, y: 0 });
                                        }}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/20 backdrop-blur-sm transition-all duration-200 hover:bg-white/25 hover:text-white hover:scale-110 sm:translate-x-14"
                                        aria-label="Banner berikutnya"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}

                            {/* Dot indicators */}
                            {popUpBanners.length > 1 && (
                                <div className="mt-5 flex items-center gap-2" style={{ animation: 'lightboxSlideUp 0.4s ease-out 0.35s both' }}>
                                    {popUpBanners.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveBannerIdx(idx);
                                            }}
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                idx === activeBannerIdx
                                                    ? 'w-6 bg-white shadow-lg shadow-white/30'
                                                    : 'w-2 bg-white/40 hover:bg-white/60'
                                            }`}
                                            aria-label={`Banner ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Lightbox keyframe animations */}
                        <style>{`
                             @keyframes floatAnimation {
                                 0% { transform: translateY(0px); }
                                 50% { transform: translateY(-10px); }
                                 100% { transform: translateY(0px); }
                             }
                             @keyframes lightboxFadeIn {
                                 from { opacity: 0; }
                                 to { opacity: 1; }
                             }
                             @keyframes lightboxOverlayIn {
                                 from { opacity: 0; }
                                 to { opacity: 1; }
                             }
                             @keyframes lightboxScaleIn {
                                 from { opacity: 0; transform: scale(0.92) translateY(20px); }
                                 to { opacity: 1; transform: scale(1) translateY(0); }
                             }
                             @keyframes lightboxImgIn {
                                 from { opacity: 0; filter: blur(4px); }
                                 to { opacity: 1; filter: blur(0); }
                             }
                             @keyframes lightboxSlideUp {
                                 from { opacity: 0; transform: translateY(12px); }
                                 to { opacity: 1; transform: translateY(0); }
                             }
                             @keyframes slideInUp {
                                 from { opacity: 0; transform: translateY(16px); }
                                 to { opacity: 1; transform: translateY(0); }
                             }
                             .animate-slide-in-up {
                                 animation: slideInUp 0.3c cubic-bezier(0.16, 1, 0.3, 1) forwards;
                             }
                         `}</style>
                    </div>
                )}
            </div>
        </>
    );
}
