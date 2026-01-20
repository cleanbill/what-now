// components/Placeholder.tsx
export function Placeholder() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-10">
            <div className="border-8 border-black p-8 bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] -rotate-2">
                <h2 className="text-5xl font-black uppercase mb-4">No Selection</h2>
                <p className="text-xl font-bold text-slate-600 max-w-sm">
                    Click an event on the calendar to edit notes, or drag over a time slot to create something new.
                </p>
                <div className="mt-8 flex gap-4 justify-center">
                    <span className="px-3 py-1 bg-blue-400 border-2 border-black font-black text-xs uppercase">🍴 Meals</span>
                    <span className="px-3 py-1 bg-yellow-400 border-2 border-black font-black text-xs uppercase">📋 Tasks</span>
                    <span className="px-3 py-1 bg-green-400 border-2 border-black font-black text-xs uppercase">📋 Gigs</span>
                    <span className="px-3 py-1 bg-red-400 border-2 border-black font-black text-xs uppercase">📋 Events</span>
                </div>
            </div>
        </div>
    );
}