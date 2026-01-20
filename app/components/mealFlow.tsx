"use client";
import React, { useState } from 'react';
import { Meal, Cover, Order } from '../types';
import OrderBuilder from './orderBuilder';

interface MealFlowProps {
    onAddMeal: (m: Meal) => void;
    onFinishedFlow: () => void;
    existingOrders: Order[]; // Passed down to share "Menu" items across meals
}

export default function MealFlow({ onAddMeal, onFinishedFlow, existingOrders }: MealFlowProps) {
    // Logic states
    const [isAddingMeal, setIsAddingMeal] = useState(false);

    // Current Meal being built
    const [mealName, setMealName] = useState("");
    const [mealTime, setMealTime] = useState("12:00");
    const [covers, setCovers] = useState<Cover[]>([]);

    const handleSaveFullMeal = () => {
        if (!mealName) return;

        const newMeal: Meal = {
            uuid: crypto.randomUUID(),
            name: mealName,
            // Combining current date with the string time
            from: new Date(`2026-01-10T${mealTime}:00`),
            to: new Date(`2026-01-10T${mealTime + 1}:00`),
            seats: covers
        };

        onAddMeal(newMeal);

        // Reset local state to allow adding another meal or finishing
        setMealName("");
        setCovers([]);
        setIsAddingMeal(false);
    };

    const addCoverToMeal = (newCover: Cover) => {
        setCovers(prev => [...prev, newCover]);
    };

    // 1. Initial State: Ask if they want to add a meal
    if (!isAddingMeal) {
        return (
            <div className="space-y-6 animate-in fade-in">
                <div className="bg-slate-100 p-6 border-4 border-black border-double">
                    <h2 className="text-2xl font-black mb-2">MEAL SCHEDULING</h2>
                    <p className="text-sm font-bold text-slate-600 mb-6">
                        Would you like to add a meal (Breakfast, Lunch, Event Catering) to this day?
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsAddingMeal(true)}
                            className="flex-1 bg-green-400 border-4 border-black p-4 font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                        >
                            YES (+)
                        </button>
                        <button
                            onClick={onFinishedFlow}
                            className="flex-1 bg-white border-4 border-black p-4 font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                        >
                            NEXT STEP →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Active State: Building the Meal
    return (
        <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                        <label className="text-[10px] font-black uppercase">Meal Name</label>
                        <input
                            autoFocus
                            className="w-full border-4 border-black p-3 text-xl font-bold outline-none focus:bg-yellow-50"
                            placeholder="E.G. GALA DINNER"
                            value={mealName}
                            onChange={e => setMealName(e.target.value)}
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="text-[10px] font-black uppercase">Time</label>
                        <input
                            type="time"
                            className="w-full border-4 border-black p-3 text-xl font-bold outline-none focus:bg-yellow-50"
                            value={mealTime}
                            onChange={e => setMealTime(e.target.value)}
                        />
                    </div>
                </div>

                <div className="border-t-4 border-black pt-4">
                    <h3 className="text-lg font-black uppercase mb-4 flex justify-between items-center">
                        Covers
                        <span className="bg-black text-white px-2 py-1 text-xs">{covers.length} added</span>
                    </h3>

                    {/* List of already added covers */}
                    {covers.length > 0 && (
                        <div className="mb-4 space-y-2">
                            {covers.map((c, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-slate-50 border-2 border-black p-2 text-xs font-bold">
                                    <span>{c.eater.name} → {c.order.name}</span>
                                    <button
                                        onClick={() => setCovers(covers.filter((_, i) => i !== idx))}
                                        className="text-red-500 hover:scale-125"
                                    >
                                        [REMOVE]
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* The Sub-Component for adding new covers */}
                    <OrderBuilder
                        onSave={addCoverToMeal}
                        existingOrders={existingOrders}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6">
                    <button
                        onClick={() => setIsAddingMeal(false)}
                        className="border-4 border-black p-3 font-bold hover:bg-red-50"
                    >
                        CANCEL MEAL
                    </button>
                    <button
                        onClick={handleSaveFullMeal}
                        disabled={!mealName || covers.length === 0}
                        className="bg-black text-white p-3 border-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(156,163,175,1)] disabled:opacity-50"
                    >
                        CONFIRM MEAL
                    </button>
                </div>
            </div>
        </div>
    );
}