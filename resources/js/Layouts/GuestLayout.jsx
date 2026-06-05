import ApplicationLogo from '@/Components/ApplicationLogo';
import Toast from '@/Components/Toast';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#e9ecef] font-sans antialiased text-gray-800 px-4 py-8">
            <div className="w-full max-w-md">
                {/* Brand Header (AdminLTE login-logo style) */}
                <div className="text-center mb-6">
                    <Link href="/" className="inline-flex flex-col items-center gap-2">
                        <ApplicationLogo className="h-16 w-16 fill-current text-emerald-600 drop-shadow-sm" />
                        <span className="text-2xl font-light text-gray-700 tracking-wide mt-2">
                            <b className="font-bold text-gray-900">PPDB</b> REV
                        </span>
                    </Link>
                </div>

                {/* Login/Register Card (AdminLTE login-card-body style) */}
                <div className="w-full overflow-hidden rounded-xl border border-gray-250 bg-white px-8 py-8 shadow-md">
                    {children}
                </div>
            </div>
            <Toast />
        </div>
    );
}
