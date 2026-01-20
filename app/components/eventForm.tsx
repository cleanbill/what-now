import { DayEvent, EventType } from '../types';
import OrderBuilder from './orderBuilder';

interface EventFormProps {
    event: DayEvent;
    onUpdate: (field: keyof DayEvent, value: any) => void;
    onDeleteEvent: (uuid: string) => void
}

export function EventForm({ event, onUpdate, onDeleteEvent }: EventFormProps) {
    // Check if current type is Meal to toggle the UI
    const isMeal = event.type === EventType.Meal;

    return (
        <div className="p-4 border-4 border-black bg-yellow-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
            {/* Top Row: Name and Type together */}
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <label className="text-[10px] font-black uppercase block mb-1">Title</label>
                    <input
                        className="w-full border-2 border-black p-2 font-bold text-lg bg-white focus:bg-yellow-100 outline-none"
                        value={event.name}
                        onChange={(e) => onUpdate('name', e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-[10px] font-black uppercase block mb-1">Type</label>
                    <select
                        className="w-full border-2 border-black p-2.5 font-bold bg-white"
                        value={event.type}
                        onChange={(e) => onUpdate('type', e.target.value)}
                    >
                        {Object.values(EventType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>

            {/* Conditional Middle Section */}
            {isMeal ? (
                <div className="p-4 border-2 border-dashed border-black bg-blue-50 animate-in fade-in zoom-in-95 duration-200">
                    <h3 className="text-sm font-black uppercase mb-2 text-blue-800">Meal Manifest / Orders</h3>
                    <OrderBuilder
                        existingOrders={[]}
                        onSave={(order) => {/* Logic to link orders to this specific event */ }}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-200">
                    <div>
                        <label className="text-[10px] font-black uppercase block mb-1">URL / Link</label>
                        <input
                            className="w-full border-2 border-black p-2 text-sm bg-white"
                            placeholder="https://..."
                            value={event.url}
                            onChange={(e) => onUpdate('url', e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 items-end">
                        {/* NEW: Open in New Tab Button */}
                        <button
                            onClick={() => {
                                if (event.url) {
                                    window.open(event.url, '_blank', 'noopener,noreferrer');
                                } else {
                                    alert("No URL provided for this activity.");
                                }
                            }}
                            className={`p-2 border-2 border-black bg-blue-400 text-black font-black uppercase text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-500 active:translate-y-1 active:shadow-none transition-all ${!event.url && 'opacity-50 cursor-not-allowed'}`}
                            title="Open Link"
                        >
                            ↗ Open
                        </button>
                        {/* Complete Button */}
                        <button
                            onClick={() => onUpdate('complete', event.complete ? null : new Date())}
                            className={`flex-1 p-2 border-2 border-black font-black uppercase text-[10px] transition-all ${event.complete
                                ? 'bg-green-500 shadow-none translate-y-1 hover:bg-green-100'
                                : 'bg-white hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                }`}
                        >
                            {event.complete ? '✓ Done' : 'Complete'}
                        </button>


                        {/* Delete Button */}
                        <button
                            onClick={() => onDeleteEvent(event.uuid)}
                            className="p-2 border-2 border-black bg-red-500 text-white font-black uppercase text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 active:translate-y-1 active:shadow-none transition-all"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}