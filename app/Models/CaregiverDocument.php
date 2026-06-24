<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CaregiverDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'caregiver_id',
        'uploaded_by',
        'document_type',
        'original_name',
        'disk',
        'path',
        'mime_type',
        'size_bytes',
        'status',
        'expires_at',
        'reviewed_by',
        'reviewed_at',
        'review_notes',
    ];

    protected function casts(): array
    {
        return [
            'size_bytes' => 'integer',
            'expires_at' => 'datetime',
            'reviewed_at' => 'datetime',
        ];
    }

    public function caregiver(): BelongsTo
    {
        return $this->belongsTo(Caregiver::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
