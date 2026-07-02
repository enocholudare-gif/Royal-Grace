import React, { useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Index() {
    const calendarRef = useRef(null);

    return (
        <>
            <Head title="Calendar Dashboard" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-text">Calendar</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            View all bookings and caregiver schedules in one place.
                        </p>
                    </div>
                </div>

                <div className="card p-4 sm:p-6 bg-white overflow-hidden shadow ring-1 ring-border rounded-xl">
                    <div className="fc-theme-standard relative" style={{ minHeight: '600px' }}>
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            events="/calendar/events"
                            editable={false}
                            selectable={true}
                            height="auto"
                            eventClick={(info) => {
                                const props = info.event.extendedProps;
                                let details = '';
                                if (props.type === 'booking') {
                                    details = `Status: ${props.status}\nClient: ${props.client_name}\nCaregiver: ${props.caregiver_name}`;
                                } else if (props.type === 'availability') {
                                    details = `Type: ${props.availability_type}\nCaregiver: ${props.caregiver_name}`;
                                }
                                alert(`${info.event.title}\n\n${details}`);
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

Index.layout = page => <AdminLayout>{page}</AdminLayout>;
