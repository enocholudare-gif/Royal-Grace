<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_number',
        'client_id',
        'service_id',
        'assigned_caregiver_id',
        'preferred_caregiver_id',
        'scheduled_start_at',
        'scheduled_end_at',
        'care_instructions',
        'service_name_snapshot',
        'service_price_snapshot',
        'service_duration_snapshot',
        'status',
        'booking_source',
        'is_recurring',
        'recurrence_group_uuid',
        'subtotal_amount',
        'discount_amount',
        'tax_amount',
        'total_amount',
        'confirmed_at',
        'cancelled_at',
        'cancellation_reason',
        'cancelled_by',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_start_at' => 'datetime',
            'scheduled_end_at' => 'datetime',
            'is_recurring' => 'boolean',
            'service_price_snapshot' => 'decimal:2',
            'subtotal_amount' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'confirmed_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function assignedCaregiver(): BelongsTo
    {
        return $this->belongsTo(Caregiver::class, 'assigned_caregiver_id');
    }

    public function preferredCaregiver(): BelongsTo
    {
        return $this->belongsTo(Caregiver::class, 'preferred_caregiver_id');
    }

    public function cancelledByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    public function notes(): HasMany
    {
        return $this->hasMany(BookingNote::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function refunds(): HasMany
    {
        return $this->hasMany(Refund::class);
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }

    public function visitReport(): HasOne
    {
        return $this->hasOne(VisitReport::class);
    }

    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class);
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    public function supportTickets(): HasMany
    {
        return $this->hasMany(SupportTicket::class);
    }
}
