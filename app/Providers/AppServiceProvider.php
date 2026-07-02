<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $repositories = [
            'Booking', 'Caregiver', 'Client', 'FamilyPortal', 'Messaging', 'Payment', 
            'Pwa', 'Rating', 'Report', 'Service', 'Ticket', 'Visit'
        ];

        foreach ($repositories as $repository) {
            $this->app->bind(
                "App\\Repositories\\Contracts\\{$repository}RepositoryInterface",
                "App\\Repositories\\Eloquent\\Eloquent{$repository}Repository"
            );
        }

        Gate::define('viewReports', function (\App\Models\User $user) {
            return $user->hasRole(['admin', 'super-admin']);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        VerifyEmail::createUrlUsing(function ($notifiable) {
            $verifyUrl = URL::temporarySignedRoute(
                'api.verification.verify',
                now()->addMinutes(config('auth.verification.expire', 60)),
                [
                    'id' => $notifiable->getKey(),
                    'hash' => sha1($notifiable->getEmailForVerification()),
                ]
            );

            return url('/email/verify?verify_url=' . urlencode($verifyUrl));
        });
    }
}