import { useState, useCallback } from 'react';
import axios from 'axios';

const toArray = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }
    if (Array.isArray(payload?.data)) {
        return payload.data;
    }
    return [];
};

const toNumber = (value) => {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
};

const toStatus = (value) => String(value ?? '').trim().toLowerCase();

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        maximumFractionDigits: 0,
    }).format(toNumber(value));

const formatDate = (value) => {
    if (!value) {
        return '-';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '-';
    }
    return new Intl.DateTimeFormat('en-CA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
};

const formatDateTime = (value) => {
    if (!value) {
        return 'Recent';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return 'Recent';
    }
    return new Intl.DateTimeFormat('en-CA', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

const bookingDate = (item) =>
    item?.scheduled_date ||
    item?.service_date ||
    item?.visit_date ||
    item?.start_date ||
    item?.created_at;

const paymentAmount = (item) =>
    item?.amount ??
    item?.total_amount ??
    item?.amount_paid ??
    item?.invoice?.amount ??
    0;

const normalizeNotifications = (items, fallbackTitle) =>
    items.map((item, index) => ({
        id: item.id ?? index + 1,
        title: item.title || item.data?.title || fallbackTitle,
        message: item.message || item.data?.message || item.data?.body || 'A new activity update is available.',
        tone: item.data?.tone || 'info',
        time: formatDateTime(item.created_at),
        unread: !item.read_at,
    }));

const normalizeChart = (items, labelResolver, valueResolver) =>
    items.slice(0, 6).map((item, index) => ({
        label: labelResolver(item, index),
        value: toNumber(valueResolver(item, index)),
    }));

export function useDashboardData() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const request = async (url) => {
        const response = await axios.get(url, {
            headers: {
                Accept: 'application/json',
            },
        });
        return response.data;
    };

    const withLoadState = async (callback, fallbackError) => {
        setLoading(true);
        setError('');
        try {
            return await callback();
        } catch (err) {
            const msg = err.response?.data?.message || fallbackError;
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const loadAdminDashboard = useCallback(() =>
        withLoadState(async () => {
            const [bookingsPayload, paymentsPayload, notificationsPayload] = await Promise.all([
                request('/bookings?per_page=8'),
                request('/payments?per_page=8'),
                request('/notifications?per_page=8'),
            ]);

            const bookings = toArray(bookingsPayload);
            const payments = toArray(paymentsPayload);
            const notifications = toArray(notificationsPayload);

            const activeStatuses = ['pending', 'awaiting_payment', 'confirmed', 'assigned', 'in_progress'];
            const cancelledCount = bookings.filter((item) => toStatus(item.status) === 'cancelled').length;
            const activeCount = bookings.filter((item) => activeStatuses.includes(toStatus(item.status))).length;
            const upcomingCount = bookings.filter((item) => ['confirmed', 'assigned', 'in_progress'].includes(toStatus(item.status))).length;
            const totalRevenue = payments.reduce((sum, item) => sum + paymentAmount(item), 0);

            return {
                metrics: [
                    { label: 'Monthly Revenue', value: formatCurrency(totalRevenue), change: `${payments.length} payment records`, tone: 'success' },
                    { label: 'Active Bookings', value: activeCount, change: `${bookings.length} recent bookings`, tone: 'primary' },
                    { label: 'Upcoming Visits', value: upcomingCount, change: 'Confirmed or assigned visits', tone: 'info' },
                    { label: 'Cancellation Rate', value: `${bookings.length ? Math.round((cancelledCount / bookings.length) * 100) : 0}%`, change: `${cancelledCount} cancelled`, tone: cancelledCount ? 'warning' : 'success' },
                ],
                chartSeries: normalizeChart(
                    payments.length ? payments : bookings,
                    (item, index) => item.reference || item.booking_number || `Item ${index + 1}`,
                    (item, index) => paymentAmount(item) || toNumber(item.total_amount) || index + 1,
                ),
                notifications: normalizeNotifications(notifications, 'Admin update'),
                activity: bookings.map((item) => ({
                    id: item.id,
                    reference: item.booking_number || `BK-${item.id}`,
                    subject: item.client?.user?.name || item.client_name || 'Client',
                    category: item.service?.name || item.service_name || 'Service',
                    status: item.status || 'pending',
                    date: formatDate(bookingDate(item)),
                })),
            };
        }, 'Unable to load admin dashboard.'), []);

    const loadCaregiverDashboard = useCallback(() =>
        withLoadState(async () => {
            const [bookingsPayload, visitsPayload, notificationsPayload] = await Promise.all([
                request('/bookings?per_page=8'),
                request('/visits?per_page=8'),
                request('/notifications?per_page=8'),
            ]);

            const bookings = toArray(bookingsPayload);
            const visits = toArray(visitsPayload);
            const notifications = toArray(notificationsPayload);

            const completedVisits = visits.filter((item) => item.departure_time).length;
            const activeVisits = visits.filter((item) => item.arrival_time && !item.departure_time).length;
            const pendingVisits = visits.filter((item) => !item.arrival_time).length;

            return {
                metrics: [
                    { label: 'Assigned Bookings', value: bookings.length, change: 'Current caregiver workload', tone: 'primary' },
                    { label: 'Completed Visits', value: completedVisits, change: 'Submitted visit progress', tone: 'success' },
                    { label: 'In Progress', value: activeVisits, change: 'Active client visits', tone: 'info' },
                    { label: 'Pending Check-Ins', value: pendingVisits, change: 'Require attention', tone: 'warning' },
                ],
                chartSeries: normalizeChart(
                    visits,
                    (item, index) => item.booking?.booking_number || `Visit ${index + 1}`,
                    (item) => item.departure_time ? 100 : item.arrival_time ? 65 : 30,
                ),
                notifications: normalizeNotifications(notifications, 'Care alert'),
                activity: visits.map((item) => ({
                    id: item.id,
                    reference: item.booking?.booking_number || `VIS-${item.id}`,
                    subject: item.booking?.client?.user?.name || 'Client',
                    category: item.departure_time ? 'Completed Visit' : item.arrival_time ? 'Active Visit' : 'Pending Visit',
                    status: item.departure_time ? 'completed' : item.arrival_time ? 'in_progress' : 'pending',
                    date: formatDate(item.arrival_time || item.created_at),
                })),
            };
        }, 'Unable to load caregiver dashboard.'), []);

    const loadClientDashboard = useCallback(() =>
        withLoadState(async () => {
            const [bookingsPayload, paymentsPayload, notificationsPayload] = await Promise.all([
                request('/bookings?per_page=8'),
                request('/payments?per_page=8'),
                request('/notifications?per_page=8'),
            ]);

            const bookings = toArray(bookingsPayload);
            const payments = toArray(paymentsPayload);
            const notifications = toArray(notificationsPayload);

            return {
                metrics: [
                    { label: 'Upcoming Bookings', value: bookings.length, change: 'Care requests in view', tone: 'primary' },
                    { label: 'Paid Invoices', value: payments.length, change: formatCurrency(payments.reduce((sum, item) => sum + paymentAmount(item), 0)), tone: 'success' },
                    { label: 'Confirmed Services', value: bookings.filter((item) => ['confirmed', 'assigned', 'in_progress'].includes(toStatus(item.status))).length, change: 'Scheduled support', tone: 'info' },
                    { label: 'Unread Alerts', value: notifications.filter((item) => !item.read_at).length, change: 'Recent account updates', tone: 'warning' },
                ],
                chartSeries: normalizeChart(
                    payments.length ? payments : bookings,
                    (item, index) => item.reference || item.booking_number || `Item ${index + 1}`,
                    (item, index) => paymentAmount(item) || toNumber(item.total_amount) || index + 1,
                ),
                notifications: normalizeNotifications(notifications, 'Client notification'),
                activity: bookings.map((item) => ({
                    id: item.id,
                    reference: item.booking_number || `BK-${item.id}`,
                    subject: item.service?.name || item.service_name || 'Service',
                    category: item.assigned_caregiver?.user?.name || item.assignedCaregiver?.user?.name || 'Pending caregiver',
                    status: item.status || 'pending',
                    date: formatDate(bookingDate(item)),
                })),
            };
        }, 'Unable to load client dashboard.'), []);

    const loadFamilyDashboard = useCallback(() =>
        withLoadState(async () => {
            const [bookingsPayload, visitsPayload, invoicesPayload, notificationsPayload] = await Promise.all([
                request('/api/family/bookings?per_page=8'),
                request('/api/family/visits?per_page=8'),
                request('/api/family/invoices?per_page=8'),
                request('/api/family/notifications?per_page=8'),
            ]);

            const bookings = toArray(bookingsPayload);
            const visits = toArray(visitsPayload);
            const invoices = toArray(invoicesPayload);
            const notifications = toArray(notificationsPayload);

            return {
                metrics: [
                    { label: 'Upcoming Bookings', value: bookings.length, change: 'Linked client schedule', tone: 'primary' },
                    { label: 'Completed Visits', value: visits.length, change: 'Care report history', tone: 'success' },
                    { label: 'Invoices', value: invoices.length, change: formatCurrency(invoices.reduce((sum, item) => sum + paymentAmount(item), 0)), tone: 'info' },
                    { label: 'Unread Notifications', value: notifications.filter((item) => !item.read_at).length, change: 'Family updates', tone: 'warning' },
                ],
                chartSeries: normalizeChart(
                    bookings.length ? bookings : visits,
                    (item, index) => item.booking_number || item.booking?.booking_number || `Entry ${index + 1}`,
                    (item, index) => toNumber(item.total_amount) || (item.departure_time ? 100 : 45) || index + 1,
                ),
                notifications: normalizeNotifications(notifications, 'Family update'),
                activity: visits.map((item) => ({
                    id: item.id,
                    reference: item.booking?.booking_number || `VIS-${item.id}`,
                    subject: item.caregiver?.user?.name || 'Caregiver',
                    category: item.client_condition || 'Visit report',
                    status: item.departure_time ? 'completed' : item.arrival_time ? 'in_progress' : 'pending',
                    date: formatDate(item.departure_time || item.arrival_time || item.created_at),
                })),
            };
        }, 'Unable to load family dashboard.'), []);

    return {
        loading,
        error,
        loadAdminDashboard,
        loadCaregiverDashboard,
        loadClientDashboard,
        loadFamilyDashboard,
        formatCurrency,
        formatDate,
    };
}
