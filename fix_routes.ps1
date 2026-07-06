$replacements = @(
    @{ File = "resources\js\Pages\Admin\BankAccounts\Index.jsx"; Find = "route\('frontend\.admin\.bank-accounts\.update', editingId\)"; Replace = "`/admin/bank-accounts/${editingId}`" },
    @{ File = "resources\js\Pages\Admin\BankAccounts\Index.jsx"; Find = "route\('frontend\.admin\.bank-accounts\.store'\)"; Replace = "'/admin/bank-accounts'" },
    @{ File = "resources\js\Pages\Admin\BankAccounts\Index.jsx"; Find = "route\('frontend\.admin\.bank-accounts\.destroy', id\)"; Replace = "`/admin/bank-accounts/${id}`" },
    
    @{ File = "resources\js\Pages\Admin\Payments\Pending.jsx"; Find = "route\('frontend\.admin\.payments\.show', sub\.id\)"; Replace = "`/admin/payments/${sub.id}`" },
    
    @{ File = "resources\js\Pages\Admin\Payments\Review.jsx"; Find = "route\('frontend\.admin\.payments\.approve', submission\.id\)"; Replace = "`/admin/payments/${submission.id}/approve`" },
    @{ File = "resources\js\Pages\Admin\Payments\Review.jsx"; Find = "route\('frontend\.admin\.payments\.reject', submission\.id\)"; Replace = "`/admin/payments/${submission.id}/reject`" },
    @{ File = "resources\js\Pages\Admin\Payments\Review.jsx"; Find = "route\('frontend\.admin\.payments\.pending'\)"; Replace = "'/admin/payments/pending'" },
    @{ File = "resources\js\Pages\Admin\Payments\Review.jsx"; Find = "route\('frontend\.admin\.payments\.download-receipt', submission\.id\)"; Replace = "`/admin/payments/${submission.id}/receipt`" },
    
    @{ File = "resources\js\Pages\Client\Invoices\Index.jsx"; Find = "route\('frontend\.client\.invoices\.pay', invoice\.id\)"; Replace = "`/client/invoices/${invoice.id}/pay`" },
    @{ File = "resources\js\Pages\Client\Invoices\Index.jsx"; Find = "route\('frontend\.client\.invoices\.download', invoice\.id\)"; Replace = "`/client/invoices/${invoice.id}/download`" },
    
    @{ File = "resources\js\Pages\Client\Payments\MakePayment.jsx"; Find = "route\('frontend\.client\.invoices\.submit-receipt', invoice\.id\)"; Replace = "`/client/invoices/${invoice.id}/submit-receipt`" },
    @{ File = "resources\js\Pages\Client\Payments\MakePayment.jsx"; Find = "route\('frontend\.client\.invoices\.download', invoice\.id\)"; Replace = "`/client/invoices/${invoice.id}/download`" }
)

foreach ($r in $replacements) {
    $content = Get-Content $r.File -Raw
    $content = [regex]::Replace($content, $r.Find, $r.Replace)
    Set-Content -Path $r.File -Value $content -NoNewline
}
echo "Done"
