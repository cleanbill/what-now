import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export function CalendarSidebar({ events, onItemClick, onDateSelect, onEventTimeChange, calendarRef }: any) {


    return (
        <aside className="w-2/5 border-r-4 border-black p-4 bg-slate-50 overflow-y-auto">
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => calendarRef?.current.getApi().today()}
                    className="flex-1 border-4 border-black bg-yellow-400 p-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1"
                >
                    Today
                </button>
                {/* You can add Prev/Next buttons here too if you want custom ones */}
            </div>           <FullCalendar
                ref={calendarRef}
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridDay"
                nowIndicator={true}        // This adds the "Current Time" line
                scrollTime={new Date().toTimeString().split(' ')[0]}
                editable={true}           // Allows dragging AND resizing
                selectable={true}
                selectMirror={true}
                events={events}
                eventClick={onItemClick}
                select={onDateSelect}

                // 1. Triggered when an event is dragged to a new time
                eventDrop={(info) => {
                    onEventTimeChange(info.event.id, info.event.start, info.event.end);
                }}

                // 2. Triggered when an event is resized (lengthened/shortened)
                eventResize={(info) => {
                    onEventTimeChange(info.event.id, info.event.start, info.event.end);
                }}

                headerToolbar={{ left: 'prev,next', center: 'title', right: 'timeGridDay,timeGridWeek' }}
                height="100%"
            />
        </aside>
    );
}