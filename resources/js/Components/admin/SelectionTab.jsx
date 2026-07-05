import { Link, router } from '@inertiajs/react';
import { Award } from 'lucide-react';
import { STATUS_CONFIG, STATUS_LABELS } from '@/lib/utils';
import Pagination from '@/Components/Pagination';

export default function SelectionTab({ selectionData }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-1 text-base font-semibold text-gray-900">Selection Dashboard</h3>
        <p className="mb-5 text-sm text-gray-500">Quota dan status per jalur pendaftaran</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {selectionData.paths.map((p) => {
            const pct = p.quota > 0 ? Math.round((p.accepted / p.quota) * 100) : 0;
            const isFull = pct >= 100;
            return (
              <div key={p.id} className={`rounded-xl border p-4 ${isFull ? 'border-red-200 bg-red-50/30' : 'border-gray-100 bg-gray-50/30'}`}>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">{p.name}</span>
                  <span className={`text-xs font-medium ${isFull ? 'text-red-600' : 'text-gray-500'}`}>
                    {p.accepted}/{p.quota}
                  </span>
                </div>
                <div className="mb-1 h-2 rounded-full bg-gray-200">
                  <div className={`h-full rounded-full transition-all ${isFull ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <span className="block font-semibold text-blue-700">{p.verified}</span>
                    <span className="text-blue-500">Verified</span>
                  </div>
                  <div className="rounded-lg bg-green-50 p-2">
                    <span className="block font-semibold text-green-700">{p.accepted}</span>
                    <span className="text-green-500">Accepted</span>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-2">
                    <span className="block font-semibold text-amber-700">{p.remaining}</span>
                    <span className="text-amber-500">Remaining</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
          <h3 className="text-base font-semibold text-gray-900">Ranking</h3>
          <div className="flex items-center gap-3">
            <select
              value={selectionData.filters.path}
              onChange={(e) => {
                const params = new URLSearchParams(window.location.search);
                params.set('selection_path', e.target.value);
                params.delete('selection_status');
                params.set('tab', 'selection');
                const data = Object.fromEntries(params.entries());
                router.get(route('admin.workspace'), data, {
                  preserveState: true,
                  preserveScroll: true,
                });
              }}
              className="rounded-lg border border-gray-200 py-1.5 pl-3 pr-8 text-sm text-gray-700"
            >
              <option value="">Semua Jalur</option>
              {selectionData.paths.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <select
              value={selectionData.filters.status}
              onChange={(e) => {
                const params = new URLSearchParams(window.location.search);
                params.set('selection_status', e.target.value);
                params.set('tab', 'selection');
                const data = Object.fromEntries(params.entries());
                router.get(route('admin.workspace'), data, {
                  preserveState: true,
                  preserveScroll: true,
                });
              }}
              className="rounded-lg border border-gray-200 py-1.5 pl-3 pr-8 text-sm text-gray-700"
            >
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="reserve">Reserve</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={() => {
                if (confirm('Generate ranking ini akan menentukan status kelulusan berdasarkan nilai tertinggi. Lanjutkan?')) {
                  router.post(route('admin.selection.generate'), {}, {
                    preserveScroll: true,
                  });
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-violet-700 hover:to-purple-700 transition-all active:scale-[0.98]"
            >
              <Award className="h-4 w-4" />
              Generate Ranking
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Rank</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nama</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Jalur</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Total Nilai</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {selectionData.rankings.data.map((reg, idx) => {
                const rank = selectionData.rankings.from + idx;
                const st = STATUS_CONFIG[reg.status] || STATUS_CONFIG.draft;
                return (
                  <tr key={reg.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        rank <= 3 ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {rank}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-purple-100 text-xs font-semibold text-violet-700">
                          {(reg.student_biodata?.full_name || reg.user?.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {reg.student_biodata?.full_name || reg.user?.name}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                      {reg.admission_path?.name}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-900">
                      {reg.total_score ?? '-'}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${st}`}>
                        {STATUS_LABELS[reg.status] || reg.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {selectionData.rankings.data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <p className="text-sm font-medium text-gray-900">Belum ada data ranking</p>
                    <p className="mt-1 text-xs text-gray-400">Generate ranking untuk melihat hasil seleksi</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination meta={selectionData.rankings} color="violet" />
      </div>
    </div>
  );
}
