<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSessionIsActive
{
    public function handle(Request $request, Closure $next, int $timeoutMinutes = 30): Response
    {
        if (! $request->user()) {
            return $next($request);
        }

        $lastActivity = $request->session()->get('last_activity_at');

        if ($lastActivity && now()->diffInMinutes($lastActivity) >= $timeoutMinutes) {
            $request->user()->currentAccessToken()?->delete();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json([
                'message' => 'Session expired due to inactivity.',
            ], 440);
        }

        $request->session()->put('last_activity_at', now());

        return $next($request);
    }
}
