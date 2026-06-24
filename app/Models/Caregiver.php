<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Caregiver extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'postal_code',
        'country',
        'certifications',
        'emergency_contact_name',
        'emergency_contact_phone',
        'bio',
        'average_rating',
        'attendance_score',
        'is_available',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'certifications' => 'array',
            'average_rating' => 'decimal:2',
            'attendance_score' => 'decimal:2',
            'is_available' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function availabilities(): HasMany
    {
        return $this->hasMany(CaregiverAvailability::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(CaregiverDocument::class);
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'caregiver_service')
            ->withPivot('is_primary')
            ->withTimestamps();
    }

    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(CaregiverAttendance::class);
    }

    public function assignedBookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'assigned_caregiver_id');
    }

    public function preferredBookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'preferred_caregiver_id');
    }

    public function visitReports(): HasMany
    {
        return $this->hasMany(VisitReport::class);
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }
}
