"use client";
import React, { useState } from 'react';
import { Cover, Order, Ingredient, Eater } from '../types';

interface OrderBuilderProps {
    onSave: (cover: Cover) => void;
    existingOrders: Order[]; // Pass in previous orders to act as a "Menu"
}

export default function OrderBuilder({ onSave, existingOrders }: OrderBuilderProps) {
    const [eaterName, setEaterName] = useState("");
    const [orderName, setOrderName] = useState("");
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [curIng, setCurIng] = useState("");
    const [isNewOrder, setIsNewOrder] = useState(true);

    const addIngredient = () => {
        if (!curIng.trim()) return;
        const newIng: Ingredient = {
            uuid: crypto.randomUUID(),
            name: curIng.trim()
        };
        setIngredients([...ingredients, newIng]);
        setCurIng("");
    };

    const handleFinalSave = () => {
        if (!eaterName || !orderName) return;

        const newCover: Cover = {
            eater: { uuid: crypto.randomUUID(), name: eaterName },
            order: {
                uuid: crypto.randomUUID(),
                name: orderName,
                description: "",
                ingredients: ingredients
            }
        };

        onSave(newCover);

        // Reset fields for the next cover in the same meal
        setEaterName("");
        setOrderName("");
        setIngredients([]);
    };

    return (
        <div className="border-4 border-black p-4 bg-white space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between items-center">
                <h3 className="font-black uppercase text-xs bg-black text-white p-1">Assign Cover</h3>
                <span className="text-[10px] font-bold text-slate-400">UUID GEN: ACTIVE</span>
            </div>

            {/* Eater Input */}
            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase">Guest Name</label>
                <input
                    className="w-full border-2 border-black p-2 font-bold focus:bg-blue-50 outline-none"
                    placeholder="E.G. TABLE 4 - GUEST A"
                    value={eaterName}
                    onChange={e => setEaterName(e.target.value)}
                />
            </div>

            {/* Mode Switcher */}
            <div className="flex border-2 border-black overflow-hidden rounded-sm">
                <button
                    onClick={() => setIsNewOrder(true)}
                    className={`flex-1 p-2 font-black text-[10px] transition-colors ${isNewOrder ? 'bg-black text-white' : 'bg-white text-black hover:bg-slate-100'}`}
                >CREATE NEW DISH</button>
                <button
                    onClick={() => setIsNewOrder(false)}
                    className={`flex-1 p-2 font-black text-[10px] transition-colors ${!isNewOrder ? 'bg-black text-white' : 'bg-white text-black hover:bg-slate-100'}`}
                >SELECT FROM MENU</button>
            </div>

            {isNewOrder ? (
                <div className="space-y-3">
                    <input
                        className="w-full border-2 border-black p-2 text-sm font-bold"
                        placeholder="DISH NAME (E.G. SALMON TARTARE)"
                        value={orderName}
                        onChange={e => setOrderName(e.target.value)}
                    />

                    {/* Ingredient Management */}
                    <div className="bg-slate-100 border-2 border-black p-3">
                        <label className="text-[9px] font-black uppercase block mb-2">Ingredients List</label>
                        <div className="flex flex-wrap gap-1 mb-3">
                            {ingredients.map((ing) => (
                                <button
                                    key={ing.uuid}
                                    onClick={() => setIngredients(ingredients.filter(i => i.uuid !== ing.uuid))}
                                    className="bg-white border-2 border-black px-2 py-1 text-[10px] font-bold hover:bg-red-100 hover:border-red-500 transition-all group"
                                >
                                    {ing.name} <span className="text-slate-300 group-hover:text-red-500">×</span>
                                </button>
                            ))}
                            {ingredients.length === 0 && <span className="text-slate-400 text-[10px] italic">No ingredients added yet...</span>}
                        </div>

                        <div className="flex gap-2">
                            <input
                                className="flex-1 border-2 border-black p-1 text-xs outline-none focus:border-blue-500"
                                placeholder="Add ingredient..."
                                value={curIng}
                                onChange={e => setCurIng(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addIngredient(); } }}
                            />
                            <button onClick={addIngredient} className="bg-black text-white px-3 font-black text-[10px] hover:bg-slate-800">ADD</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase">Active Menu</label>
                    <select
                        className="w-full border-2 border-black p-2 text-sm font-bold bg-white"
                        onChange={(e) => {
                            const selected = existingOrders.find(o => o.uuid === e.target.value);
                            if (selected) {
                                setOrderName(selected.name);
                                setIngredients(selected.ingredients);
                            }
                        }}
                    >
                        <option value="">-- BROWSE PREVIOUS ORDERS --</option>
                        {existingOrders.map(o => (
                            <option key={o.uuid} value={o.uuid}>{o.name} ({o.ingredients.length} ings)</option>
                        ))}
                    </select>
                </div>
            )}

            <button
                onClick={handleFinalSave}
                disabled={!eaterName || !orderName}
                className="w-full bg-green-400 text-black p-3 border-2 border-black font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-30 disabled:grayscale"
            >
                SAVE COVER TO MEAL
            </button>
        </div>
    );
}