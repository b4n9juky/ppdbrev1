<?php

namespace App\Http\Middleware;

use App\Models\MadrasahSetting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'registration' => $request->user() && $request->user()->role === 'student'
                    ? \App\Models\Registration::where('user_id', $request->user()->id)
                        ->where('academic_year_id', \App\Models\AcademicYear::where('is_active', true)->value('id'))
                        ->first()
                    : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'madrasah_setting' => fn () => MadrasahSetting::first(),
        ];
    }
}
