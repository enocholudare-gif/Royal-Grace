<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'author_user_id',
        'note_type',
        'content',
        'is_visible_to_family',
    ];

    protected function casts(): array
    {
        return [
            'is_visible_to_family' => 'boolean',
        ];
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_user_id');
    }
}
