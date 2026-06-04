export default function QuotaMonitor({ path }) {
    const percentage = path.quota > 0
        ? Math.round((path.total_registered / path.quota) * 100)
        : 0;

    const isFull = percentage >= 100;
    const isWarning = percentage >= 80 && !isFull;

    const barColor = isFull
        ? 'bg-gradient-to-r from-red-500 to-red-400'
        : isWarning
            ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
            : 'bg-gradient-to-r from-emerald-500 to-emerald-400';

    const cardBorder = isFull
        ? 'border-red-200'
        : isWarning
            ? 'border-yellow-200'
            : 'border-emerald-200';

    const iconBg = isFull
        ? 'bg-red-100 text-red-600'
        : isWarning
            ? 'bg-yellow-100 text-yellow-600'
            : 'bg-emerald-100 text-emerald-600';

    return (
        <div className={`group rounded-xl border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md ${cardBorder}`}>
            <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg} transition-colors`}>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">{path.name}</h3>
                        <p className="text-xs text-gray-400">Jalur Pendaftaran</p>
                    </div>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${isFull ? 'bg-red-50 text-red-700' : isWarning ? 'bg-yellow-50 text-yellow-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {path.total_registered}
                    <span className="text-xs font-normal text-gray-400">/ {path.quota}</span>
                </span>
            </div>

            <div className="relative mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>

            <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                    Sisa kuota: <span className="font-medium text-gray-700">{path.available_quota}</span>
                </span>
                <span className={`font-medium ${isFull ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-emerald-600'}`}>
                    {percentage}%
                </span>
            </div>

            {isFull && (
                <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Kuota penuh!
                </div>
            )}
        </div>
    );
}
