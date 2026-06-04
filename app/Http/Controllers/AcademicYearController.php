<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class AcademicYearController extends Controller
{
    public function index(): Response
    {
        $years = AcademicYear::orderBy('name', 'desc')->get();

        return Inertia::render('Admin/AcademicYear/Index', [
            'years' => $years,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:academic_years,name'],
        ]);

        AcademicYear::create($validated);

        return Redirect::route('admin.academic-years.index')
            ->with('success', 'Tahun ajaran berhasil ditambahkan.');
    }

    public function update(Request $request, AcademicYear $academicYear): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:academic_years,name,' . $academicYear->id],
        ]);

        $academicYear->update($validated);

        return Redirect::route('admin.academic-years.index')
            ->with('success', 'Tahun ajaran berhasil diperbarui.');
    }

    public function destroy(AcademicYear $academicYear): RedirectResponse
    {
        if ($academicYear->is_active) {
            return Redirect::back()->with('error', 'Tidak dapat menghapus tahun ajaran yang aktif.');
        }

        $academicYear->delete();

        return Redirect::route('admin.academic-years.index')
            ->with('success', 'Tahun ajaran berhasil dihapus.');
    }

    public function toggleActive(AcademicYear $academicYear): RedirectResponse
    {
        AcademicYear::where('is_active', true)->update(['is_active' => false]);

        $academicYear->update(['is_active' => true]);

        $status = $academicYear->is_active ? 'dibuka' : 'ditutup';

        return Redirect::route('admin.academic-years.index')
            ->with('success', "Pendaftaran untuk {$academicYear->name} {$status}.");
    }
}
