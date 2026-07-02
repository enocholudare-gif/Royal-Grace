<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AdminManagementController extends Controller
{
    public function index()
    {
        $adminRole = Role::where('slug', 'admin')->firstOrFail();
        
        $admins = User::where('role_id', $adminRole->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($admin) => [
                'id' => $admin->id,
                'name' => $admin->first_name . ' ' . $admin->last_name,
                'first_name' => $admin->first_name,
                'last_name' => $admin->last_name,
                'email' => $admin->email,
                'phone' => $admin->phone,
                'status' => $admin->status,
                'created_at' => $admin->created_at->format('M d, Y'),
            ]);

        return Inertia::render('SuperAdmin/Admins/Index', [
            'admins' => $admins,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'phone' => ['nullable', 'string', 'max:20', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $adminRole = Role::where('slug', 'admin')->firstOrFail();

        User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role_id' => $adminRole->id,
            'status' => 'active',
        ]);

        return back()->with('success', 'Admin created successfully.');
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'max:20', 'unique:users,phone,' . $user->id],
            'status' => ['required', 'in:active,inactive'],
            'password' => ['nullable', 'confirmed', Password::defaults()],
        ]);

        $user->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'status' => $request->status,
        ]);

        if ($request->filled('password')) {
            $user->update(['password' => Hash::make($request->password)]);
        }

        return back()->with('success', 'Admin updated successfully.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete yourself.');
        }

        $user->delete();

        return back()->with('success', 'Admin deleted successfully.');
    }
}
