"use client";
import { useParams, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { Cover, Day, defaultWeek, Meal, Order, SetupPhase } from '@/app/types';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';
import DaySetup from '@/app/components/daySetup';

export default function Page() {
    const [week, setWeek] = useLocalStorage("WEEK", defaultWeek);
    const [menu, setMenu] = useLocalStorage("MENU", new Array<Order>);

    const searchParams = useSearchParams();
    const activeFlow = (searchParams.get('step') as SetupPhase) || SetupPhase.INTENT;

    const { dayName } = useParams<{ dayName: string }>();

    // 1. Derive the index directly from the URL params. 
    // We use useMemo so it only recalculates if the URL or week data changes.
    const dayIndex = useMemo(() => {
        const index = week.findIndex(
            (d: Day) => d.name.toLowerCase() === dayName?.toLowerCase()
        );
        return index === -1 ? 0 : index;
    }, [dayName, week]);

    const initialDay = week[dayIndex];

    const updateDay = (updatedDay: Day) => {
        // Create a fresh copy of the array to trigger state update properly
        const newWeek = [...week];
        newWeek[dayIndex] = updatedDay;
        setWeek([...newWeek]);
        const newMenu: Order[] = newWeek.flatMap((day: Day) =>
            day.meals.flatMap((meal: Meal) =>
                meal.seats.map((cover: Cover) => cover.order)
            )
        );
        const uniqueMenu = Array.from(
            new Map(newMenu.map(order => [order.name, order])).values()
        );
        setMenu([...uniqueMenu])
    };

    return <DaySetup initialDay={initialDay} menu={menu} onSave={updateDay} flowStart={activeFlow} />;
}