<?php

namespace App\Services\Support;

use App\Models\SupportTicket;
use App\Models\SupportTicketMessage;
use App\Models\SupportTicketAttachment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SupportService
{
    public function createTicket(array $data, $user)
    {
        return DB::transaction(function () use ($data, $user) {
            $ticketNumber = 'TKT-' . strtoupper(Str::random(8));

            $ticket = SupportTicket::create([
                'ticket_number' => $ticketNumber,
                'user_id' => $user->id,
                'category' => $data['category'] ?? 'general',
                'subject' => $data['subject'],
                'description' => $data['description'],
                'priority' => $data['priority'] ?? 'medium',
                'status' => 'open',
            ]);

            if (isset($data['attachments'])) {
                $this->handleAttachments($ticket, null, $data['attachments'], $user);
            }

            // Load relations needed for notifications
            $ticket->load('user');

            if ($ticket->priority === 'emergency') {
                \App\Events\Support\EmergencySupportRequested::dispatch($ticket);
            } else {
                $admins = \App\Models\User::whereHas('role', fn ($query) => $query->whereIn('slug', ['super-admin', 'admin']))->get();
                foreach ($admins as $admin) {
                    $admin->notify(new \App\Notifications\Support\NewSupportTicketNotification($ticket));
                }
            }

            return $ticket->load('attachments');
        });
    }

    public function replyToTicket(SupportTicket $ticket, array $data, $user)
    {
        return DB::transaction(function () use ($ticket, $data, $user) {
            $isAdminReply = $user->hasRole(['admin', 'super-admin']);

            $message = SupportTicketMessage::create([
                'support_ticket_id' => $ticket->id,
                'user_id' => $user->id,
                'message' => $data['message'],
                'is_admin_reply' => $isAdminReply,
            ]);

            // Update ticket status if it's an admin reply or user reply
            if ($isAdminReply && $ticket->status !== 'resolved' && $ticket->status !== 'closed') {
                $ticket->update(['status' => 'in_progress']);
            } elseif (!$isAdminReply && $ticket->status === 'resolved') {
                $ticket->update(['status' => 'open']);
            }

            if (isset($data['attachments'])) {
                $this->handleAttachments($ticket, $message, $data['attachments'], $user);
            }

            $message->load('attachments', 'user');

            // Send notification
            if ($isAdminReply) {
                if ($ticket->user) {
                    $ticket->user->notify(new \App\Notifications\Support\NewSupportReplyNotification($ticket, $message));
                }
            } else {
                if ($ticket->assignee) {
                    $ticket->assignee->notify(new \App\Notifications\Support\NewSupportReplyNotification($ticket, $message));
                } else {
                    $admins = \App\Models\User::whereHas('role', fn ($query) => $query->whereIn('slug', ['super-admin', 'admin']))->get();
                    foreach ($admins as $admin) {
                        $admin->notify(new \App\Notifications\Support\NewSupportReplyNotification($ticket, $message));
                    }
                }
            }

            return $message;
        });
    }

    public function handleAttachments(SupportTicket $ticket, ?SupportTicketMessage $message, array $files, $user)
    {
        foreach ($files as $file) {
            $path = $file->store('support_attachments', 'public');

            SupportTicketAttachment::create([
                'support_ticket_id' => $ticket->id,
                'support_ticket_message_id' => $message ? $message->id : null,
                'user_id' => $user->id,
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
                'file_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
            ]);
        }
    }

    public function updateTicketStatus(SupportTicket $ticket, string $status, ?string $priority = null, ?int $assignedTo = null)
    {
        $data = ['status' => $status];

        if ($priority) {
            $data['priority'] = $priority;
        }

        if ($assignedTo) {
            $data['assigned_to'] = $assignedTo;
        }

        if (in_array($status, ['resolved', 'closed'])) {
            $data['resolved_at'] = now();
        }

        $ticket->update($data);

        return $ticket;
    }
}
