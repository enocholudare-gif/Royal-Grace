<script setup>
import AppLogo from '../Components/Layout/AppLogo.vue';

defineProps({
    title: {
        type: String,
        default: 'Welcome',
    },
    subtitle: {
        type: String,
        default: 'Compassionate healthcare coordination for every family.',
    },
});
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-brand-50 to-surface-muted">
        <div class="container-page flex min-h-screen flex-col justify-center py-10">
            <div class="mx-auto w-full max-w-6xl">
                <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <section class="hidden rounded-[2rem] bg-brand-900 p-10 text-white shadow-lg lg:block">
                        <AppLogo />

                        <div class="mt-10 max-w-xl space-y-5">
                            <span class="badge bg-white/20 text-white">Healthcare SaaS</span>
                            <h1 class="text-4xl font-semibold text-white">{{ title }}</h1>
                            <p class="text-base leading-7 text-brand-100">
                                {{ subtitle }}
                            </p>
                        </div>

                        <div class="mt-10 grid gap-4 md:grid-cols-2">
                            <div class="rounded-2xl bg-white/10 p-5">
                                <p class="text-sm font-semibold">Coordinated Bookings</p>
                                <p class="mt-2 text-sm text-brand-100">Streamlined service requests, confirmations, and visit history.</p>
                            </div>
                            <div class="rounded-2xl bg-white/10 p-5">
                                <p class="text-sm font-semibold">Family Visibility</p>
                                <p class="mt-2 text-sm text-brand-100">Real-time care updates, reports, invoices, and communication.</p>
                            </div>
                        </div>
                    </section>

                    <section class="mx-auto w-full max-w-xl rounded-[2rem] border border-border bg-surface p-6 shadow-lg sm:p-8">
                        <div class="mb-6 lg:hidden">
                            <AppLogo />
                            <h1 class="mt-6 text-3xl font-semibold text-text">{{ title }}</h1>
                            <p class="mt-2 text-sm text-text-muted">{{ subtitle }}</p>
                        </div>

                        <slot />
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>
