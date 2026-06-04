<?php

namespace App\Http\Controllers;

use App\Http\Requests\ActivityRequirementRequest;
use App\Models\AcademicYear;
use App\Models\ActivityRequirement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ActivityRequirementController extends Controller
{
    public function index(): Response
    {
        $requirements = ActivityRequirement::with('academicYear')
            ->orderBy('order')
            ->get();

        $activeYear = AcademicYear::where('is_active', true)->first();
        $academicYears = AcademicYear::orderBy('name')->get();

        return Inertia::render('Admin/ActivityRequirement/Index', [
            'requirements' => $requirements,
            'activeYear' => $activeYear,
            'academicYears' => $academicYears,
        ]);
    }

    public function store(ActivityRequirementRequest $request): RedirectResponse
    {
        ActivityRequirement::create($request->validated());

        return Redirect::route('admin.activity-requirements.index')
            ->with('success', 'Persyaratan berhasil ditambahkan.');
    }

    public function update(ActivityRequirementRequest $request, ActivityRequirement $activityRequirement): RedirectResponse
    {
        $activityRequirement->update($request->validated());

        return Redirect::route('admin.activity-requirements.index')
            ->with('success', 'Persyaratan berhasil diperbarui.');
    }

    public function destroy(ActivityRequirement $activityRequirement): RedirectResponse
    {
        $activityRequirement->delete();

        return Redirect::route('admin.activity-requirements.index')
            ->with('success', 'Persyaratan berhasil dihapus.');
    }
}
