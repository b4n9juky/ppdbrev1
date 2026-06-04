import ApplicationLogo from '@/Components/ApplicationLogo';
import Toast from '@/Components/Toast';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-gray-50 via-white to-emerald-50 pt-6 sm:justify-center sm:pt-0">
            <div className="mb-6">
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-emerald-600 drop-shadow-sm" />
                </Link>
            </div>

            <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white px-8 py-8 shadow-lg shadow-gray-100 sm:max-w-md">
                {children}
            </div>
            <Toast />
        </div>
    );
}
