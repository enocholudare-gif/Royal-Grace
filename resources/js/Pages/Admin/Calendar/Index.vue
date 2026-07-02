<script setup>
import { Head } from '@inertiajs/vue3';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '../../../Layouts/AdminLayout.vue';

defineOptions({ layout: AdminLayout });

// --- State ---
const calendarRef = ref(null);
const showBookings = ref(true);
const showAvailability = ref(true);
const selectedEvent = ref(null);
const showEventModal = ref(false);
const isUpdating = ref(false);
const updateError = ref('');
const currentViewLabel = ref('Month');

// --- FullCalendar options ---
const calendarOptions = computed(() => ({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: false,  // We use our own header
    height: 'auto',
    editable: true,
    droppable: true,
    dayMaxEvents: 4,
    eventDisplay: 'block',
    nowIndicator: true,
    selectable: true,
    events: fetchEvents,
    eventDrop: handleEventDrop,
    eventResize: handleEventResize,
    eventClick: handleEventClick,
    eventDidMount: styleEvent,
    views: {
        dayGridMonth: { titleFormat: { year: 'numeric', month: 'long' } },
        timeGridWeek: { slotMinTime: '07:00:00', slotMaxTime: '21:00:00' },
        timeGridDay:  { slotMinTime: '07:00:00', slotMaxTime: '21:00:00' },
    },
}));

// --- Fetch events from backend ---
const fetchEvents = async (info, successCallback, failureCallback) => {
    try {
        const response = await axios.get('/calendar/events', {
            params: {
                start: info.startStr,
                end: info.endStr,
            },
        });

        let events = response.data;

        // Filter based on toggle state
        if (!showBookings.value) {
            events = events.filter(e => e.extendedProps?.type !== 'booking');
        }
        if (!showAvailability.value) {
            events = events.filter(e => e.extendedProps?.type !== 'availability');
        }

        successCallback(events);
    } catch (err) {
        failureCallback(err);
    }
};

// --- Style events after mount ---
const styleEvent = ({ el, event }) => {
    el.style.borderRadius = '6px';
    el.style.padding = '2px 6px';
    el.style.fontSize = '12px';
    el.style.fontWeight = '600';
    el.style.cursor = event.extendedProps?.type === 'booking' ? 'grab' : 'pointer';
};

// --- Navigation ---
const changeView = (viewName, label) => {
    const api = calendarRef.value?.getApi();
    if (api) {
        api.changeView(viewName);
        currentViewLabel.value = label;
    }
};

const goToday = () => calendarRef.value?.getApi()?.today();
const goPrev = () => calendarRef.value?.getApi()?.prev();
const goNext = () => calendarRef.value?.getApi()?.next();

const currentTitle = computed(() => {
    const api = calendarRef.value?.getApi();
    return api?.view?.title || '';
});

// --- Refresh calendar when filters toggle ---
const refreshCalendar = () => {
    calendarRef.value?.getApi()?.refetchEvents();
};

// --- Event handlers ---
const handleEventClick = ({ event }) => {
    selectedEvent.value = {
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        ...event.extendedProps,
    };
    showEventModal.value = true;
    updateError.value = '';
};

const handleEventDrop = async ({ event, revert }) => {
    if (event.extendedProps?.type !== 'booking') {
        revert();
        return;
    }

    isUpdating.value = true;
    const bookingId = event.extendedProps?.booking_id;

    try {
        await axios.put(`/bookings/${bookingId}`, {
            scheduled_start_at: event.start.toISOString(),
        });
    } catch (err) {
        revert();
    } finally {
        isUpdating.value = false;
    }
};

const handleEventResize = async ({ event, revert }) => {
    if (event.extendedProps?.type !== 'booking') {
        revert();
        return;
    }

    const bookingId = event.extendedProps?.booking_id;
    try {
        await axios.put(`/bookings/${bookingId}`, {
            scheduled_start_at: event.start.toISOString(),
        });
    } catch (err) {
        revert();
    }
};

const closeModal = () => {
    showEventModal.value = false;
    selectedEvent.value = null;
};

const formatDateTime = (dt) => {
    if (!dt) return '—';
    return new Intl.DateTimeFormat('en-CA', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dt));
};

const getStatusClass = (status) => {
    const map = {
        pending: 'status-pending',
        awaiting_payment: 'status-pending',
        confirmed: 'status-info',
        assigned: 'status-info',
        in_progress: 'status-warning',
        completed: 'status-active',
        cancelled: 'status-danger',
        refunded: 'status-danger',
    };
    return map[status?.toLowerCase()] || 'status-inactive';
};

const viewOptions = [
    { label: 'Month', view: 'dayGridMonth' },
    { label: 'Week', view: 'timeGridWeek' },
    { label: 'Day', view: 'timeGridDay' },
];
</script>

<template>
    <Head title="Calendar" />

    <div class="space-y-5">
        <!-- Page Header -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold tracking-tight text-text">Calendar</h1>
                <p class="mt-1 text-sm text-text-muted">
                    Visualize and manage bookings and caregiver availability across all views.
                </p>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap items-center gap-3">
                <button
                    class="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition"
                    :class="showBookings ? 'bg-info-100 border-info-300 text-info-700' : 'border-border text-text-muted bg-surface'"
                    @click="showBookings = !showBookings; refreshCalendar()"
                >
                    <span class="h-2 w-2 rounded-full" :class="showBookings ? 'bg-info-500' : 'bg-text-soft'" />
                    Bookings
                </button>
                <button
                    class="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition"
                    :class="showAvailability ? 'bg-secondary-100 border-secondary-300 text-secondary-700' : 'border-border text-text-muted bg-surface'"
                    @click="showAvailability = !showAvailability; refreshCalendar()"
                >
                    <span class="h-2 w-2 rounded-full" :class="showAvailability ? 'bg-secondary-400' : 'bg-text-soft'" />
                    Availability
                </button>
            </div>
        </div>

        <!-- Calendar Card -->
        <div class="card overflow-hidden">
            <!-- Calendar Toolbar -->
            <div class="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
                <!-- Navigation -->
                <div class="flex items-center gap-1">
                    <button
                        class="rounded-lg border border-border p-2 text-text-muted transition hover:bg-surface-muted hover:text-text"
                        title="Previous"
                        @click="goPrev"
                    >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                    <button
                        class="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-muted transition hover:bg-surface-muted"
                        @click="goToday"
                    >
                        Today
                    </button>
                    <button
                        class="rounded-lg border border-border p-2 text-text-muted transition hover:bg-surface-muted hover:text-text"
                        title="Next"
                        @click="goNext"
                    >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                </div>

                <!-- Title -->
                <h2 class="flex-1 text-base font-semibold text-text" :key="currentTitle">
                    {{ currentTitle }}
                </h2>

                <!-- View Switcher -->
                <div class="flex items-center gap-1 rounded-lg border border-border bg-surface-muted p-1">
                    <button
                        v-for="v in viewOptions"
                        :key="v.view"
                        class="rounded-md px-3 py-1.5 text-xs font-semibold transition"
                        :class="currentViewLabel === v.label
                            ? 'bg-surface text-text shadow-sm'
                            : 'text-text-muted hover:text-text'"
                        @click="changeView(v.view, v.label)"
                    >
                        {{ v.label }}
                    </button>
                </div>
            </div>

            <!-- Update Indicator -->
            <div v-if="isUpdating" class="flex items-center gap-2 border-b border-border bg-info-50 px-5 py-2 text-xs font-semibold text-info-700">
                <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Saving new booking time…
            </div>

            <!-- Legend -->
            <div class="flex flex-wrap items-center gap-4 border-b border-border px-5 py-2.5">
                <div class="text-xs font-semibold text-text-soft">Legend:</div>
                <div class="flex items-center gap-1.5">
                    <span class="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
                    <span class="text-xs text-text-muted">Pending</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="h-2.5 w-2.5 rounded-full bg-[#0ea5e9]" />
                    <span class="text-xs text-text-muted">Confirmed</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="h-2.5 w-2.5 rounded-full bg-[#8b5cf6]" />
                    <span class="text-xs text-text-muted">In Progress</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
                    <span class="text-xs text-text-muted">Completed</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="h-2.5 w-2.5 rounded-full bg-[#94a3b8]" />
                    <span class="text-xs text-text-muted">Availability</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="h-2.5 w-2.5 rounded-full bg-[#dc2626]" />
                    <span class="text-xs text-text-muted">Unavailable</span>
                </div>
            </div>

            <!-- The Calendar -->
            <div class="px-1 pb-2 pt-1 calendar-wrap">
                <FullCalendar ref="calendarRef" v-bind="calendarOptions" />
            </div>
        </div>

        <!-- Drag & Drop hint -->
        <p class="text-center text-xs text-text-soft">
            💡 Drag and drop booking events to reschedule them. Click any event for details.
        </p>
    </div>

    <!-- Event Detail Modal -->
    <teleport to="body">
        <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="showEventModal && selectedEvent"
                class="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4"
                @click.self="closeModal"
            >
                <transition
                    enter-active-class="transition ease-out duration-200"
                    enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100"
                >
                    <div class="card w-full max-w-md p-6 shadow-2xl">
                        <!-- Modal Header -->
                        <div class="mb-4 flex items-start justify-between gap-4">
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                                    :class="selectedEvent.type === 'booking' ? 'bg-info-500' : 'bg-secondary-400'"
                                >
                                    <svg v-if="selectedEvent.type === 'booking'" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <div>
                                    <p class="text-xs font-semibold uppercase tracking-wide text-text-soft">
                                        {{ selectedEvent.type === 'booking' ? 'Booking Event' : 'Availability Slot' }}
                                    </p>
                                    <h3 class="text-base font-bold text-text">{{ selectedEvent.title }}</h3>
                                </div>
                            </div>
                            <button
                                class="rounded-lg p-1.5 text-text-muted transition hover:bg-surface-muted hover:text-text"
                                @click="closeModal"
                            >
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" />
                                </svg>
                            </button>
                        </div>

                        <!-- Event Details -->
                        <dl class="space-y-3">
                            <div class="flex gap-4">
                                <dt class="w-28 shrink-0 text-xs font-semibold text-text-soft">Start</dt>
                                <dd class="text-sm text-text">{{ formatDateTime(selectedEvent.start) }}</dd>
                            </div>
                            <div class="flex gap-4">
                                <dt class="w-28 shrink-0 text-xs font-semibold text-text-soft">End</dt>
                                <dd class="text-sm text-text">{{ formatDateTime(selectedEvent.end) }}</dd>
                            </div>

                            <!-- Booking-specific details -->
                            <template v-if="selectedEvent.type === 'booking'">
                                <div class="flex gap-4">
                                    <dt class="w-28 shrink-0 text-xs font-semibold text-text-soft">Status</dt>
                                    <dd>
                                        <span class="status-indicator" :class="getStatusClass(selectedEvent.status)">
                                            {{ selectedEvent.status }}
                                        </span>
                                    </dd>
                                </div>
                                <div class="flex gap-4">
                                    <dt class="w-28 shrink-0 text-xs font-semibold text-text-soft">Client</dt>
                                    <dd class="text-sm text-text">{{ selectedEvent.client_name || '—' }}</dd>
                                </div>
                                <div class="flex gap-4">
                                    <dt class="w-28 shrink-0 text-xs font-semibold text-text-soft">Caregiver</dt>
                                    <dd class="text-sm text-text">{{ selectedEvent.caregiver_name || 'Unassigned' }}</dd>
                                </div>
                            </template>

                            <!-- Availability-specific details -->
                            <template v-if="selectedEvent.type === 'availability'">
                                <div class="flex gap-4">
                                    <dt class="w-28 shrink-0 text-xs font-semibold text-text-soft">Caregiver</dt>
                                    <dd class="text-sm text-text">{{ selectedEvent.caregiver_name || '—' }}</dd>
                                </div>
                                <div class="flex gap-4">
                                    <dt class="w-28 shrink-0 text-xs font-semibold text-text-soft">Type</dt>
                                    <dd>
                                        <span class="status-indicator" :class="selectedEvent.availability_type === 'unavailable' ? 'status-danger' : 'status-active'">
                                            {{ selectedEvent.availability_type || 'Available' }}
                                        </span>
                                    </dd>
                                </div>
                            </template>
                        </dl>

                        <div v-if="selectedEvent.type === 'booking'" class="mt-5 flex gap-2 border-t border-border pt-4">
                            <a
                                :href="`/admin/caregivers`"
                                class="btn-secondary flex-1 text-center text-sm"
                            >
                                View Caregivers
                            </a>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>
    </teleport>
</template>

<style>
/* FullCalendar global style overrides to match theme */
.calendar-wrap .fc {
    font-family: var(--font-sans);
    --fc-border-color: var(--color-border);
    --fc-today-bg-color: rgba(20, 184, 166, 0.06);
    --fc-page-bg-color: transparent;
    --fc-neutral-bg-color: var(--color-surface-muted);
    --fc-list-event-hover-bg-color: var(--color-surface-subtle);
    --fc-event-text-color: #fff;
    font-size: 13px;
}

.calendar-wrap .fc-col-header-cell {
    background: var(--color-surface-muted);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--color-text-soft);
}

.calendar-wrap .fc-day-today .fc-daygrid-day-number {
    background: var(--color-brand-600);
    color: #fff;
    border-radius: 9999px;
    padding: 2px 7px;
    font-weight: 700;
}

.calendar-wrap .fc-daygrid-day-number {
    font-size: 12px;
    color: var(--color-text-muted);
    font-weight: 600;
    padding: 4px 8px;
}

.calendar-wrap .fc-event {
    transition: opacity 0.15s, transform 0.15s;
}

.calendar-wrap .fc-event:hover {
    opacity: 0.88;
    transform: translateY(-1px);
}

.calendar-wrap .fc-timegrid-slot {
    height: 40px;
}

.calendar-wrap .fc-scrollgrid {
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-top: none;
}

.calendar-wrap .fc-button {
    display: none;
}
</style>
