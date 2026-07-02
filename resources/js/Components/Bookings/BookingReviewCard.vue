<script setup>
defineProps({
    booking: {
        type: Object,
        required: true,
    },
    service: {
        type: Object,
        default: () => ({}),
    },
});

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));

const formatDateTime = (value) => {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '—';

    return new Intl.DateTimeFormat('en-CA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};
</script>

<template>
    <div class="card">
        <div class="card-header">
            <div>
                <p class="card-title">Review booking</p>
                <p class="card-subtitle">Confirm the service, schedule, and instructions before payment.</p>
            </div>
        </div>

        <div class="card-body grid gap-4 lg:grid-cols-2">
            <div class="rounded-2xl border border-border bg-surface-subtle p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.08em] text-text-soft">Selected Service</p>
                <p class="mt-2 text-lg font-semibold text-text">{{ service.name || '—' }}</p>
                <p class="mt-1 text-sm text-text-muted">{{ service.description || 'No description available.' }}</p>
            </div>

            <div class="rounded-2xl border border-border bg-surface-subtle p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.08em] text-text-soft">Schedule</p>
                <p class="mt-2 text-lg font-semibold text-text">{{ formatDateTime(booking.scheduled_start_at) }}</p>
                <p class="mt-1 text-sm text-text-muted">{{ service.duration_minutes || booking.service_duration_snapshot || 0 }} minutes</p>
            </div>

            <div class="rounded-2xl border border-border bg-surface-subtle p-4 lg:col-span-2">
                <p class="text-xs font-semibold uppercase tracking-[0.08em] text-text-soft">Care Instructions</p>
                <p class="mt-2 text-sm text-text-muted">
                    {{ booking.care_instructions || 'No special care instructions were added.' }}
                </p>
            </div>

            <div class="rounded-2xl border border-border bg-surface-subtle p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.08em] text-text-soft">Subtotal</p>
                <p class="mt-2 text-lg font-semibold text-text">{{ formatCurrency(booking.subtotal_amount || service.price || 0) }}</p>
            </div>

            <div class="rounded-2xl border border-border bg-surface-subtle p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.08em] text-text-soft">Estimated Total</p>
                <p class="mt-2 text-lg font-semibold text-text">
                    {{ formatCurrency(booking.total_amount || booking.subtotal_amount || service.price || 0) }}
                </p>
            </div>
        </div>
    </div>
</template>
