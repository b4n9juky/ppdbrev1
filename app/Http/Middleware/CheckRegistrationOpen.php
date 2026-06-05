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

        return $next($request);
    }
}
