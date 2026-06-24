<?php

namespace App\Notifications\PaymentManagement;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentReceiptNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Payment $payment)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('Royal Grace Payment Receipt')
            ->greeting('Payment received')
            ->line("Payment reference: {$this->payment->provider_payment_intent_id}")
            ->line("Amount paid: {$this->payment->currency} {$this->payment->amount}")
            ->line('Thank you for choosing Royal Grace.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'payment_id' => $this->payment->id,
            'reference' => $this->payment->provider_payment_intent_id,
            'amount' => $this->payment->amount,
            'currency' => $this->payment->currency,
            'status' => $this->payment->status,
        ];
    }
}
