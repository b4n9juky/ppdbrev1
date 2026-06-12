<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\ActivityRequirement;
use App\Models\ActivitySchedule;
use App\Models\AdmissionPath;
use App\Models\MadrasahSetting;
use App\Models\PopUpBanner;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $madrasah = MadrasahSetting::first();
        $activeYear = AcademicYear::where('is_active', true)->first();

        $schedules = $activeYear
            ? ActivitySchedule::where('academic_year_id', $activeYear->id)
                ->where('is_active', true)
                ->orderBy('order')
                ->orderBy('start_date')
                ->get()
            : collect();

        $activityRequirements = $activeYear
            ? ActivityRequirement::where('academic_year_id', $activeYear->id)
                ->orderBy('order')
                ->get()
            : collect();

        $popUpBanners = PopUpBanner::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();

        $paths = AdmissionPath::where('is_active', true)->get();

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'madrasah' => $madrasah,
            'activeYear' => $activeYear,
            'schedules' => $schedules,
            'activityRequirements' => $activityRequirements,
            'popUpBanners' => $popUpBanners,
            'paths' => $paths,
        ]);
    }
}
