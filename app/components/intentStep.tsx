import { useState } from "react";

export default function IntentStep({ current, onNext }: { current: string, onNext: (val: string) => void }) {
    const [val, setVal] = useState(current);
    return (
        <div className="space-y-4">
            <label className="text-2xl font-bold">Define the spirit of this day:</label>
            <input
                autoFocus
                className="w-full border-4 border-black p-4 text-3xl outline-none focus:bg-blue-50"
                value={val}
                onChange={e => setVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && onNext(val)}
            />
            <button onClick={() => onNext(val)} className="w-full bg-black text-white p-4 font-black">CONTINUE</button>
        </div>
    );
}