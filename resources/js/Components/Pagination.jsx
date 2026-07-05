import { Link } from '@inertiajs/react';

const gradients = {
  emerald: 'from-emerald-500 to-green-500',
  violet: 'from-violet-500 to-purple-500',
  orange: 'from-orange-500 to-amber-500',
};

export default function Pagination({ meta, color = 'emerald', onPageChange }) {
  if (!meta || meta.last_page <= 1) return null;

  const gradient = gradients[color] || gradients.emerald;

  return (
    <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/30 px-6 py-4">
      <div className="text-sm text-gray-500">
        Menampilkan {meta.from}-{meta.to} dari {meta.total}
      </div>
      <div className="flex items-center gap-1">
        {meta.current_page > 1 ? (
          onPageChange ? (
            <button onClick={() => onPageChange(meta.current_page - 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </button>
          ) : (
            <Link href={meta.prev_page_url} preserveState
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </Link>
          )
        ) : (
          <span className="inline-flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-300 cursor-not-allowed">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </span>
        )}
        {meta.links.slice(1, -1).map((link, i) => {
          if (link.label === '...') {
            return <span key={i} className="px-2 py-2 text-sm text-gray-400">...</span>;
          }
          return link.active ? (
            <span key={i} className={`inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r ${gradient} text-sm font-semibold text-white shadow-sm`}>{link.label}</span>
          ) : onPageChange ? (
            <button key={i} onClick={() => onPageChange(parseInt(link.label))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900">{link.label}</button>
          ) : (
            <Link key={i} href={link.url} preserveState
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900">{link.label}</Link>
          );
        })}
        {meta.current_page < meta.last_page ? (
          onPageChange ? (
            <button onClick={() => onPageChange(meta.current_page + 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900">
              Next
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <Link href={meta.next_page_url} preserveState
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900">
              Next
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )
        ) : (
          <span className="inline-flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-300 cursor-not-allowed">
            Next
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}
