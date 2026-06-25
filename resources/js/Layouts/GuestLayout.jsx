import ApplicationLogo from '@/Components/ApplicationLogo';
import ScrollToTop from '@/Components/ScrollToTop';
import Toast from '@/Components/Toast';
import { Head, Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { madrasah_setting } = usePage().props;

    return (
        <>
            <Head>
                <link rel="preconnect" href="https://challenges.cloudflare.com" />
            </Head>
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#e9ecef] font-sans antialiased text-gray-800 px-4 py-8">
            <div className="w-full max-w-md">
                {/* Brand Header (AdminLTE login-logo style) */}
                <div className="text-center mb-6">
                    <Link href="/" className="inline-flex flex-col items-center gap-2">
                        {madrasah_setting?.logo_path ? (
                            <img
                                src={`/storage/${madrasah_setting.logo_path}`}
                                alt={madrasah_setting.madrasah_name || 'Logo Madrasah'}
                                className="h-20 w-20 rounded-2xl object-contain drop-shadow-md"
                            />
                        ) : (
                            <ApplicationLogo className="h-16 w-16 fill-current text-emerald-600 drop-shadow-sm" />
                        )}
                        <span className="text-2xl font-light text-gray-700 tracking-wide mt-2">
                            <b className="font-bold text-gray-900">{madrasah_setting?.madrasah_name || 'PPDB'}</b>
                        </span>
                    </Link>
                </div>

                {/* Login/Register Card (AdminLTE login-card-body style) */}
                <div className="w-full overflow-hidden rounded-xl border border-gray-250 bg-white px-8 py-8 shadow-md">
                    {children}
                </div>
            </div>
            <Toast />
            <ScrollToTop />
            </div>
        </>
    );
}
