<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CaregiverAvailability extends Model
{
    use HasFactory;

    protected $table = 'caregiver_availability';

    protected $fillable = [
        'caregiver_id',
        'availability_type',
        'start_datetime',
        'end_datetime',
        'is_recurring',
        'recurrence_rule',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'start_datetime' => 'datetime',
            'end_datetime' => 'datetime',
            'is_recurring' => 'boolean',
        ];
    }

    public function caregiver(): BelongsTo
    {
        return $this->belongsTo(Caregiver::class);
    }
}
