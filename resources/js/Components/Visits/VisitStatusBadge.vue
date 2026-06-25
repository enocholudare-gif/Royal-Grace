<script setup>
const props = defineProps({
    status: {
        type: String,
        default: 'scheduled',
    },
    size: {
        type: String,
        default: 'md', // sm | md | lg
    },
});

const config = {
    scheduled: { label: 'Scheduled', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
    confirmed: { label: 'Confirmed', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    in_progress: { label: 'In Progress', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    completed: { label: 'Completed', cls: 'bg-violet-100 text-violet-700 border-violet-200' },
    draft: { label: 'Draft', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
    submitted: { label: 'Submitted', cls: 'bg-teal-100 text-teal-700 border-teal-200' },
    reviewed: { label: 'Reviewed', cls: 'bg-green-100 text-green-700 border-green-200' },
    cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-600 border-red-200' },
};

const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
};

const badge = config[props.status] ?? { label: props.status, cls: 'bg-slate-100 text-slate-600 border-slate-200' };
</script>

<template>
    <span
        class="inline-flex items-center gap-1 rounded-full border font-medium capitalize"
        :class="[badge.cls, sizeClasses[size]]"
    >
        <span class="h-1.5 w-1.5 rounded-full" :class="{
            'bg-blue-500': status === 'scheduled',
            'bg-emerald-500': status === 'confirmed',
            'bg-amber-500': status === 'in_progress',
            'bg-violet-500': status === 'completed',
            'bg-slate-400': status === 'draft',
            'bg-teal-500': status === 'submitted',
            'bg-green-500': status === 'reviewed',
            'bg-red-500': status === 'cancelled',
        }" />
        {{ badge.label }}
    </span>
</template>
