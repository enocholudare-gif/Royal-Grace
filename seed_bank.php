<?php
\App\Models\BankAccount::create([
    'bank_name' => 'Royal Bank of Care',
    'account_name' => 'Royal Grace Healthcare Ltd',
    'account_number' => '12345678',
    'branch' => 'Main Branch - London',
    'swift_code' => 'RGRCHGB2XXX',
    'instructions' => 'Please use your Invoice Number as the payment reference. Transfer will be confirmed within 1-2 business days.',
    'is_active' => true,
]);
echo "Active bank account seeded!\n";
