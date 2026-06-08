<?php

namespace App\Http\Controllers;

use App\Http\Requests\MadrasahSettingUpdateRequest;
use App\Models\MadrasahSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MadrasahSettingController extends Controller
{
    public function edit(): Response
    {
        $setting = MadrasahSetting::first() ?? MadrasahSetting::create([
            'madrasah_name' => 'Madrasah Aliyah',
        ]);

        return Inertia::render('Admin/MadrasahSetting/Edit', [
            'setting' => $setting,
        ]);
    }

    public function update(MadrasahSettingUpdateRequest $request): RedirectResponse
    {
        $setting = MadrasahSetting::first() ?? MadrasahSetting::create([
            'madrasah_name' => 'Madrasah Aliyah',
        ]);

        $data = $request->validated();

        if ($request->hasFile('kop_surat')) {
            if ($setting->kop_surat_path) {
                Storage::disk('public')->delete($setting->kop_surat_path);
            }
            $data['kop_surat_path'] = $request->file('kop_surat')->store('madrasah/settings', 'public');
        }

        if ($request->hasFile('signature')) {
            if ($setting->signature_path) {
                Storage::disk('public')->delete($setting->signature_path);
            }
            $data['signature_path'] = $request->file('signature')->store('madrasah/settings', 'public');
        }

        if ($request->hasFile('stamp')) {
            if ($setting->stamp_path) {
                Storage::disk('public')->delete($setting->stamp_path);
            }
            $data['stamp_path'] = $request->file('stamp')->store('madrasah/settings', 'public');
        }

        if ($request->hasFile('logo')) {
            if ($setting->logo_path) {
                Storage::disk('public')->delete($setting->logo_path);
            }
            $data['logo_path'] = $request->file('logo')->store('madrasah/settings', 'public');
        }

        $setting->update($data);

        return Redirect::route('admin.madrasah-settings.edit')
            ->with('success', 'Pengaturan madrasah berhasil diperbarui.');
    }
}
