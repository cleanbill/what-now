"use client";
import { useEffect, useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Day, DayEvent, defaultWeek } from "./types";
import { useRouter } from "next/navigation";
import MainDashboard from "./mainDashBoard";

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [week, setWeek] = useLocalStorage("WEEK", defaultWeek);

  useEffect(() => {
    setReady(true);

    // if (week[0].meals.length === 0) {
    //   router.push(`/setup/Monday?step=INTENT`);
    // }
  }, [week, router]);

  if (!ready) {
    return <div className="text-center text-2xl mt-100">Loading....</div>;
  }

  const onUpdateEvent = (eventUuid: string, updatedEvent: DayEvent) => {
    // 1. Map through the week to find the day containing this event
    const updatedWeek = week.map((day: Day) => {
      // Check if this day has the event we are looking for
      const eventExistsInDay = day.events.some(e => e.uuid === eventUuid);

      if (eventExistsInDay) {
        // 2. Return a new Day object with the specific event updated
        return {
          ...day,
          events: day.events.map(e =>
            e.uuid === eventUuid ? updatedEvent : e
          )
        };
      }

      // If the event isn't in this day, return the day as-is
      return day;
    });

    // 3. Save the entire new week array directly
    setWeek(updatedWeek);
  };

  const onUpdateWeek = (updatedWeek: Array<Day>) => {
    setWeek([...updatedWeek]);
  }

  const onUpdateDay = (dateClicked: Date, newEvent: DayEvent) => {
    // 1. Get the day name from the clicked date (e.g., "Monday")
    const dayNameFromDate = dateClicked.toLocaleDateString('en-UK', { weekday: 'long' });

    // 2. Calculate the NEW array first (since setWeek doesn't take a function)
    const updatedWeek = week.map((day: Day) => {
      // Match by name (e.g., day.name === "Monday")
      if (day.name.toLowerCase() === dayNameFromDate.toLowerCase()) {
        console.log("✅ Match found! Adding event to:", day.name);
        return {
          ...day,
          events: [...day.events, newEvent]
        };
      }
      return day;
    });

    // 3. Pass the final result directly
    setWeek(updatedWeek);
  };

  const updateDay = (updatedDay: Day) => {
    // Create a fresh copy of the array to trigger state update properly
    const newWeek = [...week];
    const dayIndex = week.findIndex((weekDay: Day) => weekDay.name == updateDay.name);
    newWeek[dayIndex] = updatedDay;
    setWeek([...newWeek]);
  }

  if (week[0].meals.length !== 0) {
    return <MainDashboard week={week} onUpdateDay={onUpdateDay} onUpdateEvent={onUpdateEvent} onUpdateWeek={onUpdateWeek} />;
  }

  return <div className="text-center text-2xl mt-100">Redirecting to setup...</div>;
}