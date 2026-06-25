<script setup>
defineProps({
    rows: { type: Number, default: 3 },
    showCard: { type: Boolean, default: false },
});
</script>

<template>
    <!-- Card skeleton -->
    <div v-if="showCard" class="animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div class="mb-4 flex items-start justify-between">
            <div class="flex-1 space-y-2">
                <div class="h-4 w-40 rounded bg-slate-200" />
                <div class="h-3 w-24 rounded bg-slate-100" />
            </div>
            <div class="h-6 w-20 rounded-full bg-slate-200" />
        </div>
        <div class="space-y-2">
            <div v-for="i in rows" :key="i" class="h-3 rounded bg-slate-100" :style="{ width: i % 2 === 0 ? '75%' : '90%' }" />
        </div>
        <div class="mt-4 flex gap-2 border-t border-border pt-4">
            <div class="h-8 flex-1 rounded-xl bg-slate-200" />
            <div class="h-8 flex-1 rounded-xl bg-slate-100" />
        </div>
    </div>

    <!-- List skeleton -->
    <template v-else>
        <div v-for="i in rows" :key="i" class="animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <div class="mb-4 flex items-start justify-between">
                <div class="flex-1 space-y-2">
                    <div class="h-4 w-48 rounded bg-slate-200" />
                    <div class="h-3 w-28 rounded bg-slate-100" />
                </div>
                <div class="h-6 w-20 rounded-full bg-slate-200" />
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div class="h-3 rounded bg-slate-100" />
                <div class="h-3 rounded bg-slate-100" />
                <div class="col-span-2 h-3 rounded bg-slate-100" style="width: 60%" />
            </div>
        </div>
    </template>
</template>
