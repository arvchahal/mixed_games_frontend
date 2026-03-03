"use client";
import React, { useState } from 'react'

interface GameCardParameters {
    headers: React.ReactNode;
    context: React.ReactNode;
    rules: string[];
}

const GameCard = ({ headers, context, rules }: GameCardParameters) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="p-2">
            <div className="rounded-lg border-6 border-indigo-500 text-gray-200 bg-[#1e1e2e] overflow-hidden">
                <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5"
                    onClick={() => setOpen(!open)}
                >
                    <h1 className="text-xl font-bold">{headers}</h1>
                    <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
                </div>
                {open && (
                    <div className="px-4 pb-4 text-sm text-gray-400 border-t border-gray-700 pt-3 flex flex-col gap-2">
                        <p>{context}</p>
                        <ul className="flex flex-col gap-1 mt-1">
                            {rules.map((rule, i) => (
                                <li key={i} className="flex gap-2">
                                    <span className="text-indigo-400">•</span>
                                    <span>{rule}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default GameCard
