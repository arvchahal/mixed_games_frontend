'use client';

import { useState } from 'react';

interface SeatProps {
  seatIndex: number;
  onSit: (seatIndex: number, displayName: string) => void;
  player?: { displayName: string; stack: number };
  isSeated?: boolean;
  isButton?: boolean;
  currentBetAmount?: number;
}

export default function Seat({ seatIndex, onSit, player, isSeated, isButton, currentBetAmount }: SeatProps) {
  const [displayName, setDisplayName] = useState('');
  const [filled, setFilled] = useState(false);
  const [showInput, setShowInput] = useState(false);

  function handleSit() {
    const name = displayName.trim();
    if (!name) return;
    setFilled(true);
    setShowInput(false);
    onSit(seatIndex, name);
  }

  if (player) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="relative">
          <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-gray-700 text-white text-sm font-medium overflow-hidden">
            <span className="max-w-full truncate whitespace-nowrap px-2">{player.displayName}</span>
            <span className="text-xs text-gray-300">{player.stack}</span>
          </div>
          {isButton && (
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-yellow-400 text-black text-xs font-bold flex items-center justify-center">
              D
            </div>
          )}
        </div>
        {currentBetAmount != null && currentBetAmount > 0 && (
          <span className="text-xs text-yellow-300 font-medium">{currentBetAmount}</span>
        )}
      </div>
    );
  }

  if (filled) {
    return (
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-700 text-white text-sm font-medium overflow-hidden">
        <span className="max-w-full truncate whitespace-nowrap px-2">{displayName}</span>
      </div>
    );
  }

  if (showInput) {
    return (
      <div className="flex flex-col items-center gap-1 font">
        <input
          autoFocus
          type="text"
          placeholder="Your name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSit()}
          className="w-24 px-2 py-1 text-gray-400 text-sm rounded border border-gray-400 text-black"
        />
        <div className="flex gap-1">
          <button onClick={handleSit} className="text-xs px-2 py-0.5 bg-indigo-500 text-white rounded">
            Sit
          </button>
          <button onClick={() => setShowInput(false)} className="text-xs px-2 py-0.3 bg-gray-500 text-white rounded">
            ✕
          </button>
        </div>
      </div>
    );
  }

  if (isSeated) {
    return <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-700" />;
  }

  return (
    <button
      onClick={() => setShowInput(true)}
      className="flex items-center justify-center w-20 h-20 rounded-full border-2 border-dashed border-gray-400 text-gray-400 text-3xl hover:border-white hover:text-white transition-colors"
    >
      +
    </button>
  );
}
