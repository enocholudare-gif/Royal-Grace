<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'file_name',
        'file_path',
        'file_type',
        'file_size',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
