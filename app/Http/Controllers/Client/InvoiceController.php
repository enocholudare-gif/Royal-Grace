<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Inertia\Inertia;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        if (!$user->client) {
            return redirect()->route('dashboard');
        }

        $invoices = Invoice::whereHas('booking', function ($q) use ($user) {
            $q->where('client_id', $user->client->id);
        })
        ->with(['booking.service', 'submissions' => function($q) {
            $q->latest();
        }])
        ->latest()
        ->paginate(15);

        return Inertia::render('Client/Invoices/Index', [
            'invoices' => $invoices
        ]);
    }
}
