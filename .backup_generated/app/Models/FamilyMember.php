<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FamilyMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'client_id',
        'relationship_type',
        'can_view_bookings',
        'can_view_reports',
        'can_view_invoices',
        'can_receive_notifications',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'can_view_bookings' => 'boolean',
            'can_view_reports' => 'boolean',
            'can_view_invoices' => 'boolean',
            'can_receive_notifications' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
