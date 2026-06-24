<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\VerifyEmailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    public function __invoke(Request $request, int $id, string $hash, VerifyEmailService $service): JsonResponse
    {
        $user = $service->handle($id, $hash);

        return response()->json([
            'message' => 'Email verified successfully.',
            'verified' => $user->hasVerifiedEmail(),
        ]);
    }

    public function show(Request $request, VerifyEmailService $service): JsonResponse
    {
        if ($request->filled(['id', 'hash'])) {
            $user = $service->handle((int) $request->query('id'), (string) $request->query('hash'));

            return response()->json([
                'message' => 'Email verified successfully.',
                'verified' => $user->hasVerifiedEmail(),
            ]);
        }

        return response()->json([
            'message' => 'Use the signed email verification link sent to your email address.',
            'verified' => $request->user()?->hasVerifiedEmail() ?? false,
        ]);
    }
}
