"use client";
import { useState, useMemo, useEffect, useRef } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from "@blocknote/mantine";
import { CalendarSidebar } from './components/calendarSidebar';
import { EventForm } from './components/eventForm';
import OrderBuilder from './components/orderBuilder';
import { Day, DayEvent, EventType, TYPE_COLOURS } from './types';
import { Placeholder } from './components/placeholder';
import "@blocknote/mantine/style.css";

export default function MainDashboard({ week, onUpdateDay, onUpdateEvent, onUpdateWeek }: any) {
    const calendarRef = useRef<any>(null);
    const [selection, setSelection] = useState<{ type: 'MEAL' | 'EVENT', id: string } | null>(null);
    const [pendingId, setPendingId] = useState<string | null>(null);
    const editor = useCreateBlockNote();

    const activeEvent = useMemo(() => {
        if (!selection || selection.type !== 'EVENT') return null;

        // Flatten and find
        return week
            .flatMap((d: Day) => d.events)
            .find((e: DayEvent) => e.uuid === selection.id) || null;
    }, [week, selection]); // Must depend on both

    const calendarItems = useMemo(() => {
        return week.flatMap((day: Day) => [
            // 1. Meals (using a fixed color or the map)
            ...day.meals.map(m => ({
                id: m.uuid,
                title: `🍴 ${m.name}`,
                start: m.from,
                backgroundColor: TYPE_COLOURS[EventType.Meal],
                borderColor: 'black',
                textColor: 'white',
                extendedProps: { type: 'MEAL' },
            })),
            // 2. Events/Tasks/Gigs (using the dynamic map)
            ...day.events.map(e => ({
                id: e.uuid,
                title: e.complete ? `✅ ${e.name}` : e.name,
                start: e.from,
                end: e.to,
                // If completed, maybe turn it grey, otherwise use the type color
                backgroundColor: e.complete ? '#d1d5db' : (TYPE_COLOURS[e.type] || '#000'),
                borderColor: 'black',
                textColor: e.complete ? '#4b5563' : 'black',
                extendedProps: { type: 'EVENT' },
            }))
        ]);
    }, [week]);

    // 2. Logic for clicking an empty slot
    const handleDateSelect = (selectInfo: any) => {
        const newEvent: DayEvent = {
            uuid: crypto.randomUUID(),
            name: "New Activity",
            from: selectInfo.start,
            to: selectInfo.end,
            type: EventType.Task,
            notes: [],
            description: '',
            url: '',
            complete: null,
            repeat: null
        };

        // This calls your parent's state update logic
        onUpdateDay(selectInfo.start, newEvent);

        setPendingId(newEvent.uuid);
    };

    useEffect(() => {
        if (pendingId) {
            const exists = week.flatMap((d: Day) => d.events).some((e: DayEvent) => e.uuid === pendingId);
            if (exists) {
                setSelection({ type: 'EVENT', id: pendingId });
                setPendingId(null); // Clear pending
            }
        }
    }, [week, pendingId]);

    // Update Editor content when event changes
    useEffect(() => {
        if (activeEvent) {
            editor.replaceBlocks(editor.document, activeEvent.notes.length > 0 ? activeEvent.notes : [{ content: "" }]);
        }
    }, [activeEvent?.uuid, editor]);

    useEffect(() => {
        if (selection && calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();

            // Find the item's start time from your data
            const item = week.flatMap((d: any) => [...d.events, ...d.meals])
                .find((i: any) => i.uuid === selection.id);

            if (item?.from) {
                // Option A: Scroll to that time (preserves the current day view)
                calendarApi.scrollToTime(new Date(item.from).toTimeString().split(' ')[0]);

                // Option B: Go to that specific date/time (changes day if needed)
                calendarApi.gotoDate(item.from);
            }
        }
    }, [selection, week]);

    const onEventTimeChange = (uuid: string, start: Date | null, end: Date | null) => {
        if (!start) return;

        // Find the event in the week state
        const eventToUpdate = week.flatMap((d: Day) => d.events).find((e: DayEvent) => e.uuid === uuid);

        if (eventToUpdate) {
            const updatedEvent = {
                ...eventToUpdate,
                from: start,
                // If it's a short click, 'end' might be null; FullCalendar defaultxs 
                // to 30 mins, but we should handle it safely.
                to: end || new Date(start.getTime() + 30 * 60000)
            };

            // Use your existing onUpdateEvent logic to save the change
            onUpdateEvent(uuid, updatedEvent);
        }
    };

    const onDeleteEvent = (eventUuid: string) => {
        // Confirm with the user first to prevent accidental clicks
        if (!confirm("Are you sure you want to delete this activity?")) return;

        const updatedWeek = week.map((day: Day) => ({
            ...day,
            events: day.events.filter(e => e.uuid !== eventUuid)
        }));

        onUpdateWeek(updatedWeek);
        // Clear the selection so the form closes and Placeholder shows
        setSelection(null);
    };

    return (
        <main className="flex h-screen overflow-hidden bg-white">
            <CalendarSidebar
                calendarRef={calendarRef}
                onEventTimeChange={onEventTimeChange}
                events={calendarItems}
                onItemClick={(info: any) => setSelection({
                    type: info.event.extendedProps.type,
                    id: info.event.id
                })}
                onDateSelect={handleDateSelect}
            />

            <section className="flex-1 p-10 overflow-y-auto border-l-4 border-black">
                {!selection ? (
                    <Placeholder />
                ) : selection.type === 'MEAL' ? (
                    <div className="max-w-4xl mx-auto space-y-6">
                        <h2 className="text-4xl font-black border-b-8 border-black pb-2 uppercase tracking-tighter">
                            Meal Manifest
                        </h2>
                        <OrderBuilder existingOrders={[]} onSave={() => { }} />
                    </div>
                ) : activeEvent && (
                    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                        <EventForm
                            onDeleteEvent={onDeleteEvent}
                            event={activeEvent}
                            onUpdate={(field, val) => onUpdateEvent(activeEvent.uuid, { ...activeEvent, [field]: val })}
                        />

                        <div className="pt-6 border-t-8 border-black">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-black uppercase italic">Strategy & Notes</h3>
                                <span className="text-[10px] font-bold bg-black text-white px-2 py-1">BLOCKNOTE EDITOR</span>
                            </div>
                            <div className="border-4 border-black bg-white min-h-[500px] pt-2 relative z-10">
                                <BlockNoteView
                                    editor={editor}
                                    theme="light"
                                    // Ensure the menu isn't constrained by adding a portal target if needed
                                    onChange={() => onUpdateEvent(activeEvent.uuid, { ...activeEvent, notes: editor.document })}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}