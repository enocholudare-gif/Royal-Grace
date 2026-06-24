<script setup>
import axios from 'axios';
import { computed, onMounted, reactive, ref } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import AuthAlert from '../../Components/Auth/AuthAlert.vue';
import AuthInput from '../../Components/Auth/AuthInput.vue';
import AuthSelect from '../../Components/Auth/AuthSelect.vue';
import BookingReviewCard from '../../Components/Bookings/BookingReviewCard.vue';
import BookingStepIndicator from '../../Components/Bookings/BookingStepIndicator.vue';
import PaymentStatusCard from '../../Components/Bookings/PaymentStatusCard.vue';
import ServiceSelectionCard from '../../Components/Bookings/ServiceSelectionCard.vue';
import ClientLayout from '../../Layouts/ClientLayout.vue';

defineOptions({ layout: ClientLayout });

const steps = [
    { number: 1, title: 'Service', caption: 'Choose service' },
    { number: 2, title: 'Date', caption: 'Select date' },
    { number: 3, title: 'Time', caption: 'Select time' },
    { number: 4, title: 'Instructions', caption: 'Care notes' },
    { number: 5, title: 'Review', caption: 'Confirm details' },
    { number: 6, title: 'Payment', caption: 'Complete payment' },
    { number: 7, title: 'Confirmation', caption: 'Booking complete' },
];

const currentStep = ref(1);
const services = ref([]);
const serviceLoading = ref(false);
const processing = ref(false);
const verifyingPayment = ref(false);
const bookingResponse = ref(null);
const paymentResponse = ref(null);
const confirmationReference = ref('');
const globalMessage = ref('');
const globalTone = ref('info');
const errors = reactive({});

const form = reactive({
    service_id: '',
    scheduled_date: '',
    scheduled_time: '',
    care_instructions: '',
    preferred_caregiver_id: '',
    discount_amount: '',
    tax_amount: '',
    recurrence_enabled: false,
    recurrence_frequency: '',
    recurrence_interval: 1,
    recurrence_occurrences: 2,
});

const selectedService = computed(() =>
    services.value.find((item) => Number(item.id) === Number(form.service_id)) || null,
);

const scheduledStartAt = computed(() => {
    if (!form.scheduled_date || !form.scheduled_time) {
        return '';
    }

    return `${form.scheduled_date}T${form.scheduled_time}:00`;
});

const summary = computed(() => ({
    scheduled_start_at: scheduledStartAt.value,
    care_instructions: form.care_instructions,
    subtotal_amount: selectedService.value?.price || 0,
    total_amount:
        Number(selectedService.value?.price || 0)
        - Number(form.discount_amount || 0)
        + Number(form.tax_amount || 0),
    service_duration_snapshot: selectedService.value?.duration_minutes || 0,
}));

const clearErrors = () => {
    Object.keys(errors).forEach((key) => delete errors[key]);
};

const setError = (key, message) => {
    errors[key] = message;
};

const loadServices = async () => {
    serviceLoading.value = true;

    try {
        const response = await axios.get('/services?status=active&per_page=100', {
            headers: { Accept: 'application/json' },
        });

        services.value = Array.isArray(response.data?.data) ? response.data.data : [];
    } catch (error) {
        globalMessage.value = error.response?.data?.message || 'Unable to load services.';
        globalTone.value = 'danger';
    } finally {
        serviceLoading.value = false;
    }
};

const validateStep = () => {
    clearErrors();

    if (currentStep.value === 1 && !form.service_id) {
        setError('service_id', 'Please select a service.');
    }

    if (currentStep.value === 2 && !form.scheduled_date) {
        setError('scheduled_date', 'Please select a booking date.');
    }

    if (currentStep.value === 3 && !form.scheduled_time) {
        setError('scheduled_time', 'Please select a booking time.');
    }

    if (currentStep.value === 4 && form.care_instructions.length > 5000) {
        setError('care_instructions', 'Care instructions may not be greater than 5000 characters.');
    }

    if (form.recurrence_enabled) {
        if (!form.recurrence_frequency) {
            setError('recurrence.frequency', 'Please select a recurrence frequency.');
        }

        if (!form.recurrence_occurrences || Number(form.recurrence_occurrences) < 2) {
            setError('recurrence.occurrences', 'Recurring bookings need at least 2 occurrences.');
        }
    }

    return Object.keys(errors).length === 0;
};

const nextStep = () => {
    if (!validateStep()) {
        globalMessage.value = 'Please fix the highlighted fields before continuing.';
        globalTone.value = 'danger';
        return;
    }

    globalMessage.value = '';
    currentStep.value = Math.min(currentStep.value + 1, steps.length);
};

const previousStep = () => {
    clearErrors();
    globalMessage.value = '';
    currentStep.value = Math.max(currentStep.value - 1, 1);
};

const bookingPayload = computed(() => {
    const payload = {
        service_id: Number(form.service_id),
        scheduled_start_at: scheduledStartAt.value,
        care_instructions: form.care_instructions || null,
        preferred_caregiver_id: form.preferred_caregiver_id ? Number(form.preferred_caregiver_id) : null,
        discount_amount: form.discount_amount ? Number(form.discount_amount) : null,
        tax_amount: form.tax_amount ? Number(form.tax_amount) : null,
    };

    if (form.recurrence_enabled) {
        payload.recurrence = {
            frequency: form.recurrence_frequency,
            interval: Number(form.recurrence_interval || 1),
            occurrences: Number(form.recurrence_occurrences || 2),
        };
    }

    return payload;
});

const submitBooking = async () => {
    if (!validateStep()) {
        globalMessage.value = 'Please review your booking details.';
        globalTone.value = 'danger';
        return;
    }

    processing.value = true;
    globalMessage.value = '';

    try {
        const response = await axios.post('/bookings', bookingPayload.value, {
            headers: { Accept: 'application/json' },
        });

        const createdItems = Array.isArray(response.data?.data) ? response.data.data : [];
        bookingResponse.value = createdItems[0] || null;

        currentStep.value = 6;
    } catch (error) {
        if (error.response?.status === 422) {
            const serverErrors = error.response.data?.errors || {};
            clearErrors();
            Object.entries(serverErrors).forEach(([key, value]) => {
                setError(key, Array.isArray(value) ? value[0] : value);
            });
        }

        globalMessage.value = error.response?.data?.message || 'Unable to create booking.';
        globalTone.value = 'danger';
    } finally {
        processing.value = false;
    }
};

const initializePayment = async () => {
    if (!bookingResponse.value?.id) {
        globalMessage.value = 'Please create the booking before starting payment.';
        globalTone.value = 'danger';
        return;
    }

    processing.value = true;
    globalMessage.value = '';

    try {
        const response = await axios.post(`/payments/bookings/${bookingResponse.value.id}/initialize`, {}, {
            headers: { Accept: 'application/json' },
        });

        paymentResponse.value = response.data?.data || response.data;
        confirmationReference.value = paymentResponse.value?.reference || '';

        if (paymentResponse.value?.authorization_url) {
            window.open(paymentResponse.value.authorization_url, '_blank', 'noopener,noreferrer');
        }
    } catch (error) {
        globalMessage.value = error.response?.data?.message || 'Unable to initialize payment.';
        globalTone.value = 'danger';
    } finally {
        processing.value = false;
    }
};

const verifyPayment = async () => {
    if (!confirmationReference.value) {
        globalMessage.value = 'Enter or confirm the payment reference before verification.';
        globalTone.value = 'danger';
        return;
    }

    verifyingPayment.value = true;
    globalMessage.value = '';

    try {
        const response = await axios.post('/payments/verify', {
            reference: confirmationReference.value,
        }, {
            headers: { Accept: 'application/json' },
        });

        paymentResponse.value = response.data?.data || response.data;
        currentStep.value = 7;
        globalMessage.value = 'Payment verified successfully. Your booking is confirmed.';
        globalTone.value = 'success';
    } catch (error) {
        globalMessage.value = error.response?.data?.message || 'Payment verification failed.';
        globalTone.value = 'danger';
    } finally {
        verifyingPayment.value = false;
    }
};

const goToBookings = () => {
    router.visit('/client/bookings');
};

onMounted(loadServices);
</script>

<template>
    <Head title="Create Booking" />

    <div class="space-y-6">
        <div class="page-header">
            <div>
                <h1 class="page-title">Booking Wizard</h1>
                <p class="page-description">
                    Create a care booking step by step, then complete payment and confirmation.
                </p>
            </div>
        </div>

        <AuthAlert
            v-if="globalMessage"
            :tone="globalTone"
            title="Booking update"
            :message="globalMessage"
        />

        <BookingStepIndicator :steps="steps" :current-step="currentStep" />

        <div v-if="currentStep === 1" class="space-y-5">
            <div class="card">
                <div class="card-header">
                    <div>
                        <p class="card-title">Select Service</p>
                        <p class="card-subtitle">Choose the care service you want to book.</p>
                    </div>
                </div>
                <div class="card-body space-y-4">
                    <p v-if="errors.service_id" class="form-error">{{ errors.service_id }}</p>
                    <ServiceSelectionCard
                        :services="services"
                        :selected-service-id="form.service_id"
                        :loading="serviceLoading"
                        @select="form.service_id = $event.id"
                    />
                </div>
            </div>
        </div>

        <div v-else-if="currentStep === 2" class="card">
            <div class="card-header">
                <div>
                    <p class="card-title">Select Date</p>
                    <p class="card-subtitle">Pick the preferred date for the booking.</p>
                </div>
            </div>
            <div class="card-body">
                <AuthInput
                    id="booking-date"
                    v-model="form.scheduled_date"
                    label="Booking date"
                    type="date"
                    required
                    :error="errors.scheduled_date"
                />
            </div>
        </div>

        <div v-else-if="currentStep === 3" class="card">
            <div class="card-header">
                <div>
                    <p class="card-title">Select Time</p>
                    <p class="card-subtitle">Choose when the caregiver should arrive.</p>
                </div>
            </div>
            <div class="card-body">
                <AuthInput
                    id="booking-time"
                    v-model="form.scheduled_time"
                    label="Booking time"
                    type="time"
                    required
                    :error="errors.scheduled_time"
                />
            </div>
        </div>

        <div v-else-if="currentStep === 4" class="card">
            <div class="card-header">
                <div>
                    <p class="card-title">Care Instructions</p>
                    <p class="card-subtitle">Add context that helps the caregiver prepare.</p>
                </div>
            </div>
            <div class="card-body space-y-5">
                <AuthInput
                    id="booking-care-instructions"
                    v-model="form.care_instructions"
                    label="Care instructions"
                    placeholder="Mobility support, medication reminders, feeding assistance..."
                    :error="errors.care_instructions"
                />

                <div class="grid gap-5 md:grid-cols-2">
                    <AuthInput
                        id="booking-discount-amount"
                        v-model="form.discount_amount"
                        label="Discount amount"
                        type="number"
                        placeholder="0"
                        :error="errors.discount_amount"
                    />

                    <AuthInput
                        id="booking-tax-amount"
                        v-model="form.tax_amount"
                        label="Tax amount"
                        type="number"
                        placeholder="0"
                        :error="errors.tax_amount"
                    />
                </div>

                <div class="grid gap-5 md:grid-cols-3">
                    <AuthSelect
                        id="booking-recurrence-frequency"
                        v-model="form.recurrence_frequency"
                        label="Recurrence frequency"
                        :options="[
                            { value: 'daily', label: 'Daily' },
                            { value: 'weekly', label: 'Weekly' },
                            { value: 'monthly', label: 'Monthly' },
                        ]"
                        :error="errors['recurrence.frequency']"
                    />

                    <AuthInput
                        id="booking-recurrence-interval"
                        v-model="form.recurrence_interval"
                        label="Recurrence interval"
                        type="number"
                        placeholder="1"
                        :error="errors['recurrence.interval']"
                    />

                    <AuthInput
                        id="booking-recurrence-occurrences"
                        v-model="form.recurrence_occurrences"
                        label="Occurrences"
                        type="number"
                        placeholder="2"
                        :error="errors['recurrence.occurrences']"
                    />
                </div>
            </div>
        </div>

        <div v-else-if="currentStep === 5" class="space-y-5">
            <BookingReviewCard :booking="summary" :service="selectedService || {}" />
        </div>

        <div v-else-if="currentStep === 6" class="space-y-5">
            <PaymentStatusCard :payment="paymentResponse || { amount: summary.total_amount, provider: 'paystack', status: 'pending' }" :verifying="verifyingPayment" />

            <div class="card">
                <div class="card-body space-y-5">
                    <div class="flex flex-col gap-3 md:flex-row">
                        <button type="button" class="btn-primary" :disabled="processing" @click="initializePayment">
                            {{ processing ? 'Initializing Payment...' : 'Initialize Payment' }}
                        </button>

                        <a
                            v-if="paymentResponse?.authorization_url"
                            :href="paymentResponse.authorization_url"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="btn-secondary"
                        >
                            Open Payment Link
                        </a>
                    </div>

                    <AuthInput
                        id="booking-payment-reference"
                        v-model="confirmationReference"
                        label="Payment reference"
                        placeholder="Paste payment reference"
                    />

                    <div class="flex justify-end">
                        <button type="button" class="btn-success" :disabled="verifyingPayment" @click="verifyPayment">
                            {{ verifyingPayment ? 'Verifying...' : 'Verify Payment' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="currentStep === 7" class="space-y-5">
            <div class="card">
                <div class="card-body space-y-5 text-center">
                    <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100 text-success-700">
                        <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>

                    <div>
                        <h2 class="text-2xl font-semibold text-text">Booking Confirmed</h2>
                        <p class="mt-2 text-sm text-text-muted">
                            Your booking has been created and payment has been verified successfully.
                        </p>
                    </div>

                    <div class="grid gap-4 md:grid-cols-3">
                        <div class="rounded-2xl border border-border bg-surface-subtle p-4">
                            <p class="text-xs font-semibold uppercase tracking-[0.08em] text-text-soft">Booking Number</p>
                            <p class="mt-2 text-sm font-semibold text-text">{{ bookingResponse?.booking_number || 'Pending' }}</p>
                        </div>

                        <div class="rounded-2xl border border-border bg-surface-subtle p-4">
                            <p class="text-xs font-semibold uppercase tracking-[0.08em] text-text-soft">Payment Reference</p>
                            <p class="mt-2 text-sm font-semibold text-text">{{ paymentResponse?.reference || confirmationReference || 'Pending' }}</p>
                        </div>

                        <div class="rounded-2xl border border-border bg-surface-subtle p-4">
                            <p class="text-xs font-semibold uppercase tracking-[0.08em] text-text-soft">Status</p>
                            <p class="mt-2 text-sm font-semibold text-text">{{ bookingResponse?.status || 'confirmed' }}</p>
                        </div>
                    </div>

                    <div class="flex justify-center">
                        <button type="button" class="btn-primary" @click="goToBookings">
                            View My Bookings
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="currentStep < 7" class="flex items-center justify-between gap-4">
            <button type="button" class="btn-secondary" :disabled="currentStep === 1 || processing || verifyingPayment" @click="previousStep">
                Back
            </button>

            <button
                v-if="currentStep < 5"
                type="button"
                class="btn-primary"
                :disabled="processing || verifyingPayment"
                @click="nextStep"
            >
                Continue
            </button>

            <button
                v-else-if="currentStep === 5"
                type="button"
                class="btn-primary"
                :disabled="processing"
                @click="submitBooking"
            >
                {{ processing ? 'Creating Booking...' : 'Proceed to Payment' }}
            </button>
        </div>
    </div>
</template>
