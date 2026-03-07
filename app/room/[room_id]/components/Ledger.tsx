'use client';

import { useState, useRef, useEffect } from 'react';
import { LedgerEntry } from '../type';

interface LedgerProps {
  ledger: LedgerEntry[];
}

export default function Ledger({ ledger }: LedgerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const sorted = [...ledger].sort((a, b) => b.delta - a.delta);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 bg-[#1e1e1e] text-gray-300 text-sm hover:border-gray-500 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
        Ledger
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-indigo-500 bg-[#1a1a1a] shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700">
            <span className="text-sm font-medium text-white">Ledger</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs uppercase border-b border-gray-800">
                <th className="px-4 py-2 text-left font-medium">Player</th>
                <th className="px-4 py-2 text-right font-medium">Total In</th>
                <th className="px-4 py-2 text-right font-medium">Stack</th>
                <th className="px-4 py-2 text-right font-medium">+/-</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry) => (
                <tr key={entry.displayName} className="border-b border-gray-800 last:border-0 hover:bg-[#1e1e2e] transition-colors">
                  <td className="px-4 py-2.5 text-gray-200 font-medium truncate max-w-[7rem]">{entry.displayName}</td>
                  <td className="px-4 py-2.5 text-gray-400 text-right">{entry.totalBuyIn}</td>
                  <td className="px-4 py-2.5 text-gray-200 text-right">{entry.stack}</td>
                  <td className={`px-4 py-2.5 text-right font-semibold ${entry.delta > 0 ? 'text-green-400' : entry.delta < 0 ? 'text-red-400' : 'text-gray-500'}`}>
                    {entry.delta > 0 ? '+' : ''}{entry.delta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
