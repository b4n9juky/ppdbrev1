import { Head, Link } from '@inertiajs/react';
import Toast from '@/Components/Toast';
import { useState, useEffect, useCallback } from 'react';

export default function Welcome({ auth, madrasah, activeYear, schedules, activityRequirements, popUpBanners }) {
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

                        <nav className="flex items-center gap-4">
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
                                    {activeYear && (
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
                    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold tracking-tight text-green-900 sm:text-5xl">
                                Selamat Datang di PPDB
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-green-700">
                                {madrasah?.madrasah_name
                                    ? `Sistem Penerimaan Peserta Didik Baru ${madrasah.madrasah_name} Tahun Ajaran ${activeYear?.name || '-'}`
                                    : 'Sistem Penerimaan Peserta Didik Baru Madrasah Aliyah'}
                            </p>

                            {activeYear ? (
                                <div className="mt-10">
                                    {auth.user ? (
                                        <Link
                                            href={route('student.registration.show')}
                                            className="inline-flex items-center rounded-xl bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-green-700 hover:shadow-xl"
                                        >
                                            Daftar Sekarang
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center rounded-xl bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-green-700 hover:shadow-xl"
                                        >
                                            Daftar Sekarang
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="mt-10">
                                    <p className="text-lg font-medium text-amber-600">
                                        Pendaftaran belum dibuka
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {schedules.length > 0 && (
                        <section className="border-t border-green-100 bg-white py-16">
                            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                                <h3 className="mb-2 text-center text-2xl font-bold text-green-900">
                                    Jadwal Kegiatan PPDB
                                </h3>
                                <p className="mb-10 text-center text-green-600">
                                    {activeYear?.name}
                                </p>
                                <div className="relative space-y-6">
                                    {schedules.map((s, idx) => {
                                        const c = phaseColors[idx % phaseColors.length];
                                        return (
                                            <div key={s.id} className={`relative flex gap-5 rounded-2xl border border-green-100 ${c.border} border-l-4 ${c.bg} p-6 shadow-sm transition hover:shadow-md`}>
                                                <div className={`mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${c.dot}`}>
                                                    <span className="text-[10px] font-bold text-white">{idx + 1}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                                        <h4 className="text-lg font-semibold text-gray-900">{s.activity_name}</h4>
                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm ring-1 ring-gray-200">
                                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {s.start_date} — {s.end_date}
                                                        </span>
                                                    </div>
                                                    {s.requirements && (
                                                        <div className="prose prose-sm prose-green mt-4 max-w-none text-gray-700 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-gray-800 [&_ul]:mt-1 [&_li]:text-sm"
                                                            dangerouslySetInnerHTML={{ __html: s.requirements }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    )}

                    {activityRequirements.length > 0 && (
                        <section className="border-t border-green-100 bg-gradient-to-br from-green-50 via-white to-emerald-50 py-16">
                            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                                <h3 className="mb-2 text-center text-2xl font-bold text-green-900">
                                    Persyaratan Pendaftaran & Alur Pendaftaran
                                </h3>
                                <p className="mb-10 text-center text-green-600">
                                    Lengkapi persyaratan berikut untuk mendaftar
                                </p>
                                <div className="grid gap-6 md:grid-cols-2">
                                    {activityRequirements.map((req, idx) => {
                                        const c = phaseColors[idx % phaseColors.length];
                                        return (
                                            <div key={req.id} className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition hover:shadow-md">
                                                <div className="mb-4 flex items-center gap-3">
                                                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.bg}`}>
                                                        <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{req.title}</h4>
                                                    </div>
                                                </div>
                                                <p className="border-t border-gray-100 pt-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                                    {req.description}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    )}

                    {madrasah && (
                        <section className="border-t border-green-100 bg-white py-16">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="grid gap-8 md:grid-cols-3">
                                    <div className="rounded-xl border border-green-100 bg-green-50 p-6">
                                        <h3 className="font-semibold text-green-900">Kontak</h3>
                                        <p className="mt-2 text-green-700">{madrasah.contact || '-'}</p>
                                    </div>
                                    <div className="rounded-xl border border-green-100 bg-green-50 p-6 md:col-span-2">
                                        <h3 className="font-semibold text-green-900">Alamat</h3>
                                        <p className="mt-2 text-green-700">{madrasah.address || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeYear && (
                        <section className="py-16">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <h3 className="mb-8 text-center text-2xl font-bold text-green-900">
                                    Jalur Pendaftaran
                                </h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-6">
                                        <h4 className="font-semibold text-blue-900">Jalur Zonasi</h4>
                                        <p className="mt-2 text-sm text-blue-700">
                                            Pendaftaran berdasarkan domisili tempat tinggal sesuai zona yang ditentukan.
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-purple-100 bg-purple-50 p-6">
                                        <h4 className="font-semibold text-purple-900">Jalur Prestasi</h4>
                                        <p className="mt-2 text-sm text-purple-700">
                                            Pendaftaran berdasarkan prestasi akademik maupun non-akademik.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
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
                        `}</style>
                    </div>
                )}
            </div>
        </>
    );
}
