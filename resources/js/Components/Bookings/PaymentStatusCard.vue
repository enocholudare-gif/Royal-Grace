<script setup>
defineProps({
    payment: {
        type: Object,
        default: () => ({}),
    },
    verifying: {
        type: Boolean,
        default: false,
    },
});

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
</script>

<template>
    <div class="card">
        <div class="card-header">
            <div>
                <p class="card-title">Payment</p>
                <p class="card-subtitle">Initialize payment and complete it using the provider link.</p>
            </div>
        </div>

        <div class="card-body space-y-4">
            <div class="grid gap-4 md:grid-cols-3">
                <div class="rounded-2xl border border-border bg-surface-subtle p-4">
                    <p class="text-xs font-semibold uppercase tracking-[0.08em] text-text-soft">Amount</p>
                    <p class="mt-2 text-lg font-semibold text-text">{{ formatCurrency(payment.amount) }}</p>
                </div>

                <div class="rounded-2xl border border-border bg-surface-subtle p-4">
                    <p class="text-xs font-semibold uppercase tracking-[0.08em] text-text-soft">Provider</p>
                    <p class="mt-2 text-lg font-semibold text-text">{{ payment.provider || 'Paystack' }}</p>
                </div>

                <div class="rounded-2xl border border-border bg-surface-subtle p-4">
                    <p class="text-xs font-semibold uppercase tracking-[0.08em] text-text-soft">Status</p>
                    <p class="mt-2 text-lg font-semibold text-text">{{ payment.status || 'pending' }}</p>
                </div>
            </div>

            <div v-if="payment.reference" class="rounded-2xl border border-border bg-surface-subtle p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.08em] text-text-soft">Payment Reference</p>
                <p class="mt-2 break-all text-sm font-medium text-text">{{ payment.reference }}</p>
            </div>

            <div v-if="payment.authorization_url" class="alert-info">
                <div>
                    <p class="font-semibold">Payment link ready</p>
                    <p>Use the provider link to complete payment, then return here to verify and confirm the booking.</p>
                </div>
            </div>

            <div v-if="verifying" class="text-sm text-text-muted">
                Verifying payment with the backend...
            </div>
        </div>
    </div>
</template>
