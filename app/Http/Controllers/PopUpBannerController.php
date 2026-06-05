<?php

namespace App\Http\Controllers;

use App\Http\Requests\PopUpBannerRequest;
use App\Models\PopUpBanner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PopUpBannerController extends Controller
{
    public function index(): Response
    {
        $banners = PopUpBanner::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/PopUpBanner/Index', [
            'banners' => $banners,
        ]);
    }

    public function store(PopUpBannerRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('popup-banners', 'public');
        }

        PopUpBanner::create($data);

        return Redirect::route('admin.pop-up-banners.index')
            ->with('success', 'Banner berhasil ditambahkan.');
    }

    public function update(PopUpBannerRequest $request, PopUpBanner $popUpBanner): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($popUpBanner->image) {
                Storage::disk('public')->delete($popUpBanner->image);
            }
            $data['image'] = $request->file('image')->store('popup-banners', 'public');
        }

        $popUpBanner->update($data);

        return Redirect::route('admin.pop-up-banners.index')
            ->with('success', 'Banner berhasil diperbarui.');
    }

    public function destroy(PopUpBanner $popUpBanner): RedirectResponse
    {
        if ($popUpBanner->image) {
            Storage::disk('public')->delete($popUpBanner->image);
        }

        $popUpBanner->delete();

        return Redirect::route('admin.pop-up-banners.index')
            ->with('success', 'Banner berhasil dihapus.');
    }

    public function toggleActive(PopUpBanner $popUpBanner): RedirectResponse
    {
        $popUpBanner->update([
            'is_active' => ! $popUpBanner->is_active,
        ]);

        return Redirect::route('admin.pop-up-banners.index')
            ->with('success', $popUpBanner->is_active ? 'Banner diaktifkan.' : 'Banner dinonaktifkan.');
    }
}
