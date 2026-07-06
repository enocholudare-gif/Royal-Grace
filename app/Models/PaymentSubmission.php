<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentSubmission extends Model
{
    protected $fillable = [
        'invoice_id',
        'receipt_path',
        'transaction_reference',
        'note',
        'status',
        'rejection_reason',
        'reviewed_by',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function reviewedBy()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
