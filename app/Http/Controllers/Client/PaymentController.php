<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\BankAccount;
use App\Models\PaymentSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use App\Notifications\PaymentSubmittedNotification;
use App\Models\User;
use Illuminate\Support\Facades\Notification;

class PaymentController extends Controller
{
    public function makePayment(Invoice $invoice)
    {
        $user = auth()->user();
        if ($invoice->booking->client_id !== $user->client->id) {
            abort(403);
        }

        $bankAccount = BankAccount::active()->latest()->first();

        return Inertia::render('Client/Payments/MakePayment', [
            'invoice' => $invoice->load('booking'),
            'bankAccount' => $bankAccount
        ]);
    }

    public function downloadInvoice(Invoice $invoice)
    {
        $user = auth()->user();
        if ($invoice->booking->client_id !== $user->client->id) {
            abort(403);
        }

        $bankAccount = BankAccount::active()->latest()->first();
        
        $pdf = Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice,
            'bankAccount' => $bankAccount,
            'client' => $user->client,
            'user' => $user
        ]);

        return $pdf->download('invoice-'.$invoice->invoice_number.'.pdf');
    }

    public function submitReceipt(Request $request, Invoice $invoice)
    {
        $user = auth()->user();
        if ($invoice->booking->client_id !== $user->client->id) {
            abort(403);
        }

        $request->validate([
            'receipt' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120', // 5MB
            'transaction_reference' => 'nullable|string|max:255',
            'note' => 'nullable|string'
        ]);

        $path = $request->file('receipt')->store('receipts', 'public');

        PaymentSubmission::create([
            'invoice_id' => $invoice->id,
            'receipt_path' => $path,
            'transaction_reference' => $request->transaction_reference,
            'note' => $request->note,
            'status' => 'pending'
        ]);

        $invoice->update([
            'status' => 'payment_submitted',
            'payment_submitted_at' => now(),
            'payment_method' => 'bank_transfer'
        ]);

        // Trigger notification to admin here
        $admins = User::whereHas('roles', function($q) {
            $q->where('name', 'admin')->orWhere('name', 'super-admin');
        })->get();
        Notification::send($admins, new PaymentSubmittedNotification($invoice));

        return redirect()->route('frontend.client.invoices.index')->with('success', 'Payment receipt submitted successfully. It is now under review.');
    }
}
