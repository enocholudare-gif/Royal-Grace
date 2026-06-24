<?php

namespace App\Notifications\System;

use App\Models\Payment;
use Illuminate\Notifications\Messages\MailMessage;

class PaymentSuccessfulNotification extends BaseQueuedNotification
{
    public function __construct(public Payment $payment)
    {
    }

    public function notificationType(): string
    {
        return 'payment_successful';
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('Payment Successful')
            ->line("Payment {$this->payment->provider_payment_intent_id} was successful.")
            ->line("Amount: {$this->payment->currency} {$this->payment->amount}");
    }

    public function toArray(object $notifiable): array
    {
        return $this->payload();
    }

    public function toFcm(object $notifiable): array
    {
        return [
            'title' => 'Payment Successful',
            'body' => "Payment of {$this->payment->currency} {$this->payment->amount} was successful.",
            'data' => $this->payload(),
        ];
    }

    protected function payload(): array
    {
        return [
            'type' => $this->notificationType(),
            'payment_id' => $this->payment->id,
            'booking_id' => $this->payment->booking_id,
            'reference' => $this->payment->provider_payment_intent_id,
        ];
    }
}
