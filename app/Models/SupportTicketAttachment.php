<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupportTicketAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'support_ticket_id',
        'support_ticket_message_id',
        'user_id',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
    ];

    public function ticket()
    {
        return $this->belongsTo(SupportTicket::class, 'support_ticket_id');
    }

    public function message()
    {
        return $this->belongsTo(SupportTicketMessage::class, 'support_ticket_message_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
