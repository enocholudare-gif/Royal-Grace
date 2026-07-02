<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Services\Auth\ForgotPasswordService;
use App\Services\Auth\LoginUserService;
use App\Services\Auth\LogoutUserService;
use App\Services\Auth\RegisterUserService;
use App\Services\Auth\ResetPasswordService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function register(RegisterRequest $request, RegisterUserService $service)
    {
        $result = $service->handle($request->validated());

        if ($request->wantsJson() && !$request->inertia()) {
            return response()->json([
                'message' => 'Registration successful. Please verify your email.',
                'user' => $result['user'],
                'token' => $result['token'],
            ], 201);
        }

        \Illuminate\Support\Facades\Auth::login($result['user']);
        
        $roleSlug = strtolower($result['user']->role?->slug ?? '');
        $dashboard = match(true) {
            str_contains($roleSlug, 'admin') => '/admin/dashboard',
            str_contains($roleSlug, 'caregiver') => '/caregiver/dashboard',
            str_contains($roleSlug, 'family') => '/family/dashboard',
            default => '/client/dashboard',
        };

        return redirect()->intended($dashboard)->with('success', 'Registration successful. Please verify your email.');
    }

    public function login(LoginRequest $request, LoginUserService $service)
    {
        $result = $service->handle($request->validated());
        // Log the user into the session for Laravel auth middleware
        \Illuminate\Support\Facades\Auth::login($result['user']);

        $roleSlug = strtolower($result['user']->role?->slug ?? '');
        
        $dashboard = match(true) {
            str_contains($roleSlug, 'admin') => '/admin/dashboard',
            str_contains($roleSlug, 'caregiver') => '/caregiver/dashboard',
            str_contains($roleSlug, 'family') => '/family/dashboard',
            default => '/client/dashboard',
        };

        // Determine response type: Inertia (browser) vs API
        if ($request->wantsJson() && ! $request->inertia()) {
            return response()->json([
                'message' => 'Login successful.',
                'user' => $result['user'],
                'token' => $result['token'],
                'redirect' => $dashboard,
            ]);
        }

        // For Inertia requests, redirect to intended dashboard seamlessly
        return redirect()->intended($dashboard);
    }

    public function logout(Request $request, LogoutUserService $service)
    {
        $service->handle($request->user());

        if ($request->wantsJson() && !$request->inertia()) {
            return response()->json([
                'message' => 'Logout successful.',
            ]);
        }

        return redirect()->route('login');
    }

    public function forgotPassword(ForgotPasswordRequest $request, ForgotPasswordService $service)
    {
        $service->handle($request->validated('email'));

        if ($request->wantsJson() && !$request->inertia()) {
            return response()->json([
                'message' => 'Password reset link sent successfully.',
            ]);
        }

        return back()->with('success', 'Password reset link sent successfully.');
    }

    public function resetPassword(ResetPasswordRequest $request, ResetPasswordService $service)
    {
        $service->handle($request->validated());

        if ($request->wantsJson() && !$request->inertia()) {
            return response()->json([
                'message' => 'Password reset successful.',
            ]);
        }

        return redirect()->route('login')->with('success', 'Password reset successful. Please log in.');
    }
}
