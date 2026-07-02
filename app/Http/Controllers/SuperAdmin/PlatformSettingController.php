<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlatformSettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->groupBy('group');

        // Transform settings into a key-value format for easier frontend handling
        $formattedSettings = [];
        foreach ($settings as $group => $items) {
            $formattedSettings[$group] = $items->mapWithKeys(function ($item) {
                return [$item->key => [
                    'value' => $item->value,
                    'is_public' => $item->is_public,
                ]];
            });
        }

        return Inertia::render('SuperAdmin/Settings/Index', [
            'settings' => $formattedSettings,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'settings' => ['required', 'array'],
        ]);

        foreach ($request->settings as $group => $keys) {
            foreach ($keys as $key => $data) {
                Setting::updateOrCreate(
                    ['group' => $group, 'key' => $key],
                    [
                        'value' => $data['value'],
                        'is_public' => $data['is_public'] ?? false,
                    ]
                );
            }
        }

        return back()->with('success', 'Platform settings updated successfully.');
    }
}
