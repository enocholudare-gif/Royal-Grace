<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\VerifyEmailService;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\JsonResponse;

class EmailVerificationController extends Controller
{
    public function __invoke(EmailVerificationRequest $request, VerifyEmailService $service): JsonResponse
    {
        $service->handle($request);

        return response()->json([
            'message' => 'Email verified successfully.',
        ]);
    }
}
