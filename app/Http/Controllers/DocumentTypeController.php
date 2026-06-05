<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use App\Models\StudentDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class DocumentTypeController extends Controller
{
    public function index(): Response
    {
        $types = DocumentType::orderBy('created_at', 'asc')->get();

        return Inertia::render('Admin/DocumentType/Index', [
            'types' => $types,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:100',
                'unique:document_types,code',
                'regex:/^[a-z0-9_]+$/',
            ],
            'name' => ['required', 'string', 'max:255'],
            'is_required' => ['required', 'boolean'],
        ], [
            'code.regex' => 'Format kode harus berupa huruf kecil, angka, dan underscore saja (contoh: pas_foto).',
        ]);

        DocumentType::create($validated);

        return Redirect::route('admin.document-types.index')
            ->with('success', 'Tipe dokumen berhasil ditambahkan.');
    }

    public function update(Request $request, DocumentType $documentType): RedirectResponse
    {
        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:100',
                'unique:document_types,code,'.$documentType->id,
                'regex:/^[a-z0-9_]+$/',
            ],
            'name' => ['required', 'string', 'max:255'],
            'is_required' => ['required', 'boolean'],
        ], [
            'code.regex' => 'Format kode harus berupa huruf kecil, angka, dan underscore saja (contoh: pas_foto).',
        ]);

        $oldCode = $documentType->code;
        $newCode = $validated['code'];

        if ($oldCode !== $newCode) {
            StudentDocument::where('document_type', $oldCode)->update(['document_type' => $newCode]);
        }

        $documentType->update($validated);

        return Redirect::route('admin.document-types.index')
            ->with('success', 'Tipe dokumen berhasil diperbarui.');
    }

    public function destroy(DocumentType $documentType): RedirectResponse
    {
        if (StudentDocument::where('document_type', $documentType->code)->exists()) {
            return Redirect::back()->with('error', 'Tidak dapat menghapus tipe dokumen ini karena sudah digunakan oleh pendaftar.');
        }

        $documentType->delete();

        return Redirect::route('admin.document-types.index')
            ->with('success', 'Tipe dokumen berhasil dihapus.');
    }
}
