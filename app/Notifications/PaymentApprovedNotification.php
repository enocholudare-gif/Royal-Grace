<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Invoice;

class PaymentApprovedNotification extends Notification implements ShouldQueue
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
                    ->subject('Payment Approved - Invoice #'.$this->invoice->invoice_number)
                    ->greeting('Hello '.$notifiable->first_name.',')
                    ->line('Your payment has been verified successfully. Invoice #'.$this->invoice->invoice_number.' has been marked as Paid.')
                    ->line('Thank you for your payment.')
                    ->action('View Invoices', route('frontend.client.invoices.index'))
                    ->line('If you have any questions, feel free to contact our support team.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'payment_approved',
            'message' => '✅ Payment Approved. Your invoice '.$this->invoice->invoice_number.' has been successfully verified.',
            'url' => route('frontend.client.invoices.index')
        ];
    }
}
