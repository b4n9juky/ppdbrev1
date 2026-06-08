<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubjectRequest;
use App\Models\AcademicYear;
use App\Models\Subject;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class SubjectController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Subject/Index', [
            'subjects' => Subject::with('academicYear')->orderBy('urut')->orderBy('name')->get(),
            'academicYears' => AcademicYear::all(),
        ]);
    }

    public function store(SubjectRequest $request): RedirectResponse
    {
        Subject::create($request->validated());

        return Redirect::route('admin.subjects.index')
            ->with('success', 'Mata pelajaran berhasil ditambahkan.');
    }

    public function update(SubjectRequest $request, Subject $subject): RedirectResponse
    {
        $subject->update($request->validated());

        return Redirect::route('admin.subjects.index')
            ->with('success', 'Mata pelajaran berhasil diperbarui.');
    }

    public function destroy(Subject $subject): RedirectResponse
    {
        $subject->delete();

        return Redirect::route('admin.subjects.index')
            ->with('success', 'Mata pelajaran berhasil dihapus.');
    }
}
