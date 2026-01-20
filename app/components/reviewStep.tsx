"use client";
import { Day } from '../types';

type ReviewProps = {
    day: Day;
    onConfirm: () => void;
};

export default function ReviewStep({ day, onConfirm }: ReviewProps) {
    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-slate-900 text-white p-4">
                <h2 className="text-xl font-black uppercase tracking-tighter">
                    Final Review: {day.name}
                </h2>
                <p className="text-slate-400 text-sm italic">"Spirit: {day.intent}"</p>
            </div>

            <div className="space-y-4">
                {/* Meals Summary */}
                <section>
                    <h3 className="font-black border-b-2 border-black mb-2 uppercase text-sm">Meals & Covers</h3>
                    {day.meals.length === 0 ? (
                        <p className="text-slate-400 italic">No meals scheduled.</p>
                    ) : (
                        <div className="grid gap-2">
                            {day.meals.map((meal) => (
                                <div key={meal.uuid} className="border-2 border-black p-2 bg-blue-50">
                                    <div className="flex justify-between font-bold">
                                        <span>{meal.name}</span>
                                        <span>{meal.seats.length} Covers</span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 truncate">
                                        {meal.seats.map(s => s.eater.name).join(", ")}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Events Summary */}
                <section>
                    <h3 className="font-black border-b-2 border-black mb-2 uppercase text-sm">Events & Tasks</h3>
                    {day.events.length === 0 ? (
                        <p className="text-slate-400 italic">No events scheduled.</p>
                    ) : (
                        <ul className="space-y-1">
                            {day.events.map((event) => (
                                <li key={event.uuid} className="flex items-center gap-2 text-sm">
                                    <span className="bg-yellow-400 border border-black px-1 font-bold text-[10px]">
                                        {event.type}
                                    </span>
                                    <span className="font-medium">{event.name}</span>
                                    {event.repeat && <span className="text-blue-600 text-[10px]">↻</span>}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            <div className="pt-4 border-t-4 border-black">
                <button
                    onClick={onConfirm}
                    className="w-full bg-green-500 hover:bg-green-400 text-black border-4 border-black p-4 font-black text-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                >
                    CONFIRM & SEIZE
                </button>
                <p className="text-[10px] text-center mt-4 text-slate-500 uppercase font-bold">
                    Clicking confirm will save this setup to your local manifest.
                </p>
            </div>
        </div>
    );
}