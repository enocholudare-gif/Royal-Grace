<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentSubmission;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Notifications\PaymentApprovedNotification;
use App\Notifications\PaymentRejectedNotification;

class PaymentApprovalController extends Controller
{
    public function index()
    {
        $submissions = PaymentSubmission::with(['invoice.booking.client.user'])
            ->latest()
            ->paginate(15);
            
        return Inertia::render('Admin/Payments/Pending', [
            'submissions' => $submissions
        ]);
    }

    public function show(PaymentSubmission $submission)
    {
        $submission->load('invoice.booking.client.user');
        return Inertia::render('Admin/Payments/Review', [
            'submission' => $submission
        ]);
    }

    public function approve(Request $request, PaymentSubmission $submission)
    {
        $submission->update([
            'status' => 'approved',
            'reviewed_by' => auth()->id()
        ]);

        $submission->invoice->update([
            'status' => 'paid',
            'paid_at' => now(),
            'approved_by' => auth()->id()
        ]);

        // Trigger Notification here
        if ($submission->invoice->booking->client->user) {
            $submission->invoice->booking->client->user->notify(new PaymentApprovedNotification($submission->invoice));
        }

        return redirect()->route('admin.payments.pending')->with('success', 'Payment approved successfully.');
    }

    public function reject(Request $request, PaymentSubmission $submission)
    {
        $request->validate([
            'rejection_reason' => 'required|string'
        ]);

        $submission->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
            'reviewed_by' => auth()->id()
        ]);

        $submission->invoice->update([
            'status' => 'rejected'
        ]);

        // Trigger Notification here
        if ($submission->invoice->booking->client->user) {
            $submission->invoice->booking->client->user->notify(new PaymentRejectedNotification($submission->invoice, $request->rejection_reason));
        }

        return redirect()->route('admin.payments.pending')->with('success', 'Payment rejected.');
    }

    public function downloadReceipt(PaymentSubmission $submission)
    {
        return Storage::disk('public')->download($submission->receipt_path);
    }
}
