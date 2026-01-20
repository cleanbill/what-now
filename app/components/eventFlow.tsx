import React, { useState } from 'react';
import { DayEvent, EventType, Period } from '../types';

export default function EventFlow({ onAddEvent, onFinishedFlow }: { onAddEvent: (e: DayEvent) => void, onFinishedFlow: () => void }) {
    const [isAdding, setIsAdding] = useState(false);
    const [temp, setTemp] = useState<Partial<DayEvent>>({ type: EventType.Task });

    if (!isAdding) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Any Events or Tasks?</h2>
                <div className="flex gap-4">
                    <button onClick={() => setIsAdding(true)} className="flex-1 border-4 border-black p-4 hover:bg-green-100 font-bold text-xl">YES (+)</button>
                    <button onClick={onFinishedFlow} className="flex-1 border-4 border-black p-4 hover:bg-slate-100 font-bold text-xl">FINISH SETUP</button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-4 border-4 border-black bg-yellow-50">
            <select
                className="w-full border-2 border-black p-2 font-bold"
                onChange={e => setTemp({ ...temp, type: e.target.value as EventType })}
            >
                {Object.values(EventType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <input
                className="w-full border-2 border-black p-2"
                placeholder="Task/Event Name"
                onChange={e => setTemp({ ...temp, name: e.target.value })}
            />

            <div className="flex items-center gap-4">
                <label className="font-bold">Repeats?</label>
                <button
                    className={`border-2 border-black p-2 ${temp.repeat ? 'bg-green-400' : 'bg-white'}`}
                    onClick={() => setTemp({ ...temp, repeat: temp.repeat ? null : { period: Period.Week, qty: 1 } })}
                >
                    {temp.repeat ? "Weekly" : "No"}
                </button>
            </div>

            <button
                className="w-full bg-black text-white p-4 font-bold"
                onClick={() => {
                    onAddEvent({ ...temp, uuid: crypto.randomUUID(), from: new Date(), to: new Date(), complete: null } as DayEvent);
                    setIsAdding(false);
                }}
            >
                ADD {temp.type}
            </button>
        </div>
    );
}