<?php

namespace App\Http\Controllers;

use App\Http\Requests\AdmissionPathRequest;
use App\Models\AdmissionPath;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class AdmissionPathController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/AdmissionPath/Index', [
            'paths' => AdmissionPath::orderBy('name')->get(),
        ]);
    }

    public function store(AdmissionPathRequest $request): RedirectResponse
    {
        AdmissionPath::create($request->validated());

        return Redirect::route('admin.admission-paths.index')
            ->with('success', 'Jalur pendaftaran berhasil ditambahkan.');
    }

    public function update(AdmissionPathRequest $request, AdmissionPath $admissionPath): RedirectResponse
    {
        $admissionPath->update($request->validated());

        return Redirect::route('admin.admission-paths.index')
            ->with('success', 'Jalur pendaftaran berhasil diperbarui.');
    }

    public function destroy(AdmissionPath $admissionPath): RedirectResponse
    {
        $admissionPath->delete();

        return Redirect::route('admin.admission-paths.index')
            ->with('success', 'Jalur pendaftaran berhasil dihapus.');
    }
}
