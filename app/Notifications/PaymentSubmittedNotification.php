<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Invoice;

class PaymentSubmittedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $invoice;

    public function __construct(Invoice $invoice)
    {
        $this->invoice = $invoice;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Payment Receipt Submitted - Invoice #'.$this->invoice->invoice_number)
                    ->greeting('Hello Admin,')
                    ->line('A client has uploaded a payment receipt for Invoice #'.$this->invoice->invoice_number.'.')
                    ->line('Amount Due: $'.number_format($this->invoice->total_amount, 2))
                    ->action('Review Payment', route('frontend.admin.payments.pending'))
                    ->line('Please review the submission and approve or reject it.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'payment_submitted',
            'message' => 'Payment receipt submitted for Invoice #'.$this->invoice->invoice_number,
            'url' => route('frontend.admin.payments.pending')
        ];
    }
}
