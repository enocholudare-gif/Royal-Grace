<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BankAccount;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BankAccountController extends Controller
{
    public function index()
    {
        $accounts = BankAccount::latest()->get();
        return Inertia::render('Admin/BankAccounts/Index', [
            'accounts' => $accounts
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'bank_name' => 'required|string|max:255',
            'account_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:255',
            'branch' => 'nullable|string|max:255',
            'swift_code' => 'nullable|string|max:255',
            'instructions' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        if ($request->is_active) {
            BankAccount::query()->update(['is_active' => false]);
        }

        BankAccount::create($validated);

        return back()->with('success', 'Bank account created successfully.');
    }

    public function update(Request $request, BankAccount $bankAccount)
    {
        $validated = $request->validate([
            'bank_name' => 'required|string|max:255',
            'account_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:255',
            'branch' => 'nullable|string|max:255',
            'swift_code' => 'nullable|string|max:255',
            'instructions' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        if ($request->is_active && !$bankAccount->is_active) {
            BankAccount::query()->update(['is_active' => false]);
        }

        $bankAccount->update($validated);

        return back()->with('success', 'Bank account updated successfully.');
    }

    public function destroy(BankAccount $bankAccount)
    {
        $bankAccount->delete();
        return back()->with('success', 'Bank account deleted.');
    }
}
