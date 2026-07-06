<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Invoice;

class PaymentRejectedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $invoice;
    public $reason;

    public function __construct(Invoice $invoice, $reason)
    {
        $this->invoice = $invoice;
        $this->reason = $reason;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Payment Rejected - Invoice #'.$this->invoice->invoice_number)
                    ->greeting('Hello '.$notifiable->first_name.',')
                    ->line('Your payment submission for Invoice #'.$this->invoice->invoice_number.' could not be verified.')
                    ->line('Reason for rejection: ' . $this->reason)
                    ->line('Please upload a clearer receipt or contact support if you need assistance.')
                    ->action('Re-submit Payment', route('frontend.client.invoices.pay', $this->invoice->id));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'payment_rejected',
            'message' => '❌ Payment Rejected for invoice '.$this->invoice->invoice_number.'. Reason: '.$this->reason,
            'url' => route('frontend.client.invoices.pay', $this->invoice->id)
        ];
    }
}
