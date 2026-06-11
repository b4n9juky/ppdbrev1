<?php

namespace App\Http\Middleware;

use App\Models\AcademicYear;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRegistrationOpen
{
    public function handle(Request $request, Closure $next): Response
    {
        $activeYear = AcademicYear::where('is_active', true)->first();

        if (! $activeYear) {
            return redirect()->route('welcome')
                ->with('error', 'Pendaftaran sedang ditutup.');
        }

        $now = now();
        if ($activeYear->registration_start && $now->lt($activeYear->registration_start)) {
            return redirect()->route('welcome')
                ->with('error', 'Pendaftaran belum dibuka (jadwal buka: ' . $activeYear->registration_start->format('d-m-Y H:i') . ').');
        }

        if ($activeYear->registration_end && $now->gt($activeYear->registration_end)) {
            return redirect()->route('welcome')
                ->with('error', 'Pendaftaran sudah ditutup (jadwal tutup: ' . $activeYear->registration_end->format('d-m-Y H:i') . ').');
        }

        return $next($request);
    }
}
