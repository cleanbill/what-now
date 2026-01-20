"use client";
import { useEffect, useState } from 'react';
import EventFlow from './eventFlow';
import IntentStep from './intentStep';
import MealFlow from './mealFlow';
import { Day, DayEvent, DayName, Meal, Order, SetupPhase } from '../types';
import ReviewStep from './reviewStep';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function DaySetup({ initialDay, menu, onSave, flowStart }: { initialDay: Day, menu: Array<Order>, onSave: (d: Day) => void, flowStart: SetupPhase }) {
    const [day, setDay] = useState<Day>(initialDay);
    const [activeFlow, setActiveFlow] = useState<SetupPhase>(flowStart);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setDay(initialDay);
    }, [initialDay])

    const updateFlow = (flow: SetupPhase) => {
        setActiveFlow(flow);
        const params = new URLSearchParams(searchParams.toString());
        params.set('step', flow);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }

    const updateIntent = (intent: string) => {
        setDay(prev => ({ ...prev, intent }));
        updateFlow(SetupPhase.MEALS);
    };

    const addMeal = (meal: Meal) => {
        setDay(prev => ({ ...prev, meals: [...prev.meals, meal] }));
    };

    const addEvent = (event: DayEvent) => {
        setDay(prev => ({
            ...prev,
            events: [...prev.events, event]
        }));
    };

    const getNextDay = (currentDay: DayName): DayName => {
        // 1. Convert the Enum into a sorted array of its values
        const days = Object.values(DayName);

        // 2. Find the index of the day you are currently on
        const currentIndex = days.indexOf(currentDay);

        // 3. Use the Modulo operator (%) to loop back to 0 if we hit the end
        const nextIndex = (currentIndex + 1) % days.length;

        return days[nextIndex] as DayName;
    };

    const updateDay = (updatedDay: Day) => {
        const nextDayName = getNextDay(updatedDay.name);
        router.push(`/setup/${nextDayName}?step=INTENT`);
    };

    const handleSave = (day: Day) => {
        updateFlow(SetupPhase.INTENT);
        onSave(day);
        updateDay(day);
    }

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] my-10 font-mono">
            <header className="mb-8 border-b-4 border-black pb-4">
                <h1 className="text-4xl font-black uppercase italic">Setup: {day.name}</h1>
                <p className="text-slate-500 font-bold">MODE: {activeFlow}</p>
            </header>

            {activeFlow == SetupPhase.INTENT && <IntentStep current={day.intent} onNext={updateIntent} />}

            {activeFlow == SetupPhase.MEALS && (
                <MealFlow
                    onAddMeal={addMeal}
                    onFinishedFlow={() => updateFlow(SetupPhase.EVENTS)} existingOrders={menu} />
            )}

            {activeFlow == SetupPhase.EVENTS && (
                <EventFlow
                    onAddEvent={addEvent}
                    onFinishedFlow={() => updateFlow(SetupPhase.REVIEW)}
                />
            )}

            {activeFlow === SetupPhase.REVIEW && <ReviewStep day={day} onConfirm={() => handleSave(day)} />}
        </div>
    );
}