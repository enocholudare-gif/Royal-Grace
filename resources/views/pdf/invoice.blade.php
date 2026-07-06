<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            color: #333;
            line-height: 1.5;
            font-size: 14px;
            margin: 0;
            padding: 0;
        }
        .container {
            padding: 30px;
        }
        .header {
            width: 100%;
            border-bottom: 2px solid #D4AF37;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header table {
            width: 100%;
        }
        .header td {
            vertical-align: top;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #0A192F;
        }
        .invoice-title {
            font-size: 32px;
            font-weight: bold;
            color: #0A192F;
            text-align: right;
            text-transform: uppercase;
        }
        .details-table {
            width: 100%;
            margin-bottom: 40px;
        }
        .details-table td {
            vertical-align: top;
            width: 50%;
        }
        .section-title {
            font-weight: bold;
            color: #666;
            text-transform: uppercase;
            font-size: 12px;
            margin-bottom: 5px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
        }
        .items-table th {
            background-color: #0A192F;
            color: white;
            padding: 10px;
            text-align: left;
        }
        .items-table td {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
        .totals-table {
            width: 50%;
            float: right;
            border-collapse: collapse;
        }
        .totals-table td {
            padding: 8px 10px;
        }
        .totals-table .total-row td {
            border-top: 2px solid #0A192F;
            font-weight: bold;
            font-size: 18px;
        }
        .bank-details {
            margin-top: 60px;
            padding: 20px;
            background-color: #f8f9fa;
            border-left: 4px solid #D4AF37;
            clear: both;
        }
        .bank-details h4 {
            margin-top: 0;
            color: #0A192F;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #888;
            border-top: 1px solid #eee;
            padding-top: 20px;
            clear: both;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <table>
                <tr>
                    <td>
                        <div class="company-name">Royal Grace Care Services</div>
                        <div>123 Care Avenue, Suite 100</div>
                        <div>Calgary, AB T2P 1A1</div>
                        <div>support@royalgrace.ca | 403-669-7455</div>
                    </td>
                    <td>
                        <div class="invoice-title">Invoice</div>
                        <div style="text-align: right; margin-top: 10px;">
                            <strong>Invoice #:</strong> {{ $invoice->invoice_number }}<br>
                            <strong>Date:</strong> {{ $invoice->issue_date->format('M d, Y') }}<br>
                            <strong>Due Date:</strong> {{ $invoice->due_date ? $invoice->due_date->format('M d, Y') : 'Upon Receipt' }}<br>
                            <strong>Status:</strong> <span style="text-transform: uppercase;">{{ str_replace('_', ' ', $invoice->status) }}</span>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <table class="details-table">
            <tr>
                <td>
                    <div class="section-title">Billed To:</div>
                    <strong>{{ $user->first_name }} {{ $user->last_name }}</strong><br>
                    {{ $client->address }}<br>
                    {{ $user->email }}<br>
                    {{ $user->phone }}
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th style="text-align: right;">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ $invoice->booking->service->name ?? 'Care Service Package' }}</td>
                    <td style="text-align: right;">${{ number_format($invoice->subtotal_amount, 2) }}</td>
                </tr>
            </tbody>
        </table>

        <table class="totals-table">
            <tr>
                <td>Subtotal</td>
                <td style="text-align: right;">${{ number_format($invoice->subtotal_amount, 2) }}</td>
            </tr>
            <tr>
                <td>Tax</td>
                <td style="text-align: right;">${{ number_format($invoice->tax_amount, 2) }}</td>
            </tr>
            <tr class="total-row">
                <td>Total Due</td>
                <td style="text-align: right;">${{ number_format($invoice->total_amount, 2) }}</td>
            </tr>
        </table>

        <div style="clear: both;"></div>

        @if($bankAccount)
        <div class="bank-details">
            <h4>Payment Instructions</h4>
            <p style="margin-bottom: 10px;">Please transfer the Total Due amount to the following bank account:</p>
            <table style="width: 100%;">
                <tr>
                    <td style="width: 150px;"><strong>Bank Name:</strong></td>
                    <td>{{ $bankAccount->bank_name }}</td>
                </tr>
                <tr>
                    <td><strong>Account Name:</strong></td>
                    <td>{{ $bankAccount->account_name }}</td>
                </tr>
                <tr>
                    <td><strong>Account Number:</strong></td>
                    <td>{{ $bankAccount->account_number }}</td>
                </tr>
                @if($bankAccount->branch)
                <tr>
                    <td><strong>Branch:</strong></td>
                    <td>{{ $bankAccount->branch }}</td>
                </tr>
                @endif
                @if($bankAccount->swift_code)
                <tr>
                    <td><strong>SWIFT Code:</strong></td>
                    <td>{{ $bankAccount->swift_code }}</td>
                </tr>
                @endif
            </table>
            @if($bankAccount->instructions)
            <p style="margin-top: 15px;"><strong>Note:</strong> {{ $bankAccount->instructions }}</p>
            @endif
        </div>
        @endif

        <div class="footer">
            <p>Thank you for choosing Royal Grace Care Services. For any questions, please contact our support team.</p>
        </div>
    </div>
</body>
</html>
