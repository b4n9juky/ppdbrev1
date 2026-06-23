<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePathActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $registration = $request->route('registration');

        if ($registration && $registration->admissionPath && !$registration->admissionPath->is_active) {
            abort(404);
        }

        return $next($request);
    }
}
