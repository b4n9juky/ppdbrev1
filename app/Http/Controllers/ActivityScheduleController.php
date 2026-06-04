<?php

namespace App\Http\Controllers;

use App\Http\Requests\ActivityScheduleRequest;
use App\Models\AcademicYear;
use App\Models\ActivitySchedule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ActivityScheduleController extends Controller
{
    public function index(): Response
    {
        $schedules = ActivitySchedule::with('academicYear')
            ->orderBy('order')
            ->orderBy('start_date')
            ->get();

        $activeYear = AcademicYear::where('is_active', true)->first();
        $academicYears = AcademicYear::orderBy('name')->get();

        return Inertia::render('Admin/ActivitySchedule/Index', [
            'schedules' => $schedules,
            'activeYear' => $activeYear,
            'academicYears' => $academicYears,
        ]);
    }

    public function store(ActivityScheduleRequest $request): RedirectResponse
    {
        ActivitySchedule::create($request->validated());

        return Redirect::route('admin.activity-schedules.index')
            ->with('success', 'Jadwal kegiatan berhasil ditambahkan.');
    }

    public function update(ActivityScheduleRequest $request, ActivitySchedule $activitySchedule): RedirectResponse
    {
        $activitySchedule->update($request->validated());

        return Redirect::route('admin.activity-schedules.index')
            ->with('success', 'Jadwal kegiatan berhasil diperbarui.');
    }

    public function destroy(ActivitySchedule $activitySchedule): RedirectResponse
    {
        $activitySchedule->delete();

        return Redirect::route('admin.activity-schedules.index')
            ->with('success', 'Jadwal kegiatan berhasil dihapus.');
    }
}
