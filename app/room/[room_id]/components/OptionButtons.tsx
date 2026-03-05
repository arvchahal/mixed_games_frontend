'use client';

import { useState } from 'react';
import { Action } from '../type';

interface OptionButtonsProps {
  isMyTurn: boolean;
  currentBet: number;
  myStack: number;
  minRaise: number;
  onAction: (action: Action) => void;
}

export default function OptionButtons({ isMyTurn, currentBet, myStack, minRaise, onAction }: OptionButtonsProps) {
  const [amount, setAmount] = useState(0);

  const hasBet = currentBet > 0;

  function submitBetOrRaise() {
    const n = Math.min(Number(amount), myStack);
    if (!n || n <= 0) return;
    onAction(hasBet ? { type: 'raise', amount: n } : { type: 'bet', amount: n });
  }

  return (
    <div className={`flex items-center gap-2${!isMyTurn ? ' opacity-50 pointer-events-none' : ''}`}>
      {hasBet ? (
        <>
          <button
            onClick={() => onAction({ type: 'fold' })}
            className="px-4 py-2 rounded bg-red-700 text-white text-sm font-medium hover:bg-red-600"
          >
            Fold
          </button>
          <button
            onClick={() => onAction({ type: 'call' })}
            className="px-4 py-2 rounded bg-blue-700 text-white text-sm font-medium hover:bg-blue-600"
          >
            Call {currentBet}
          </button>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={minRaise}
              max={myStack}
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder={`min ${minRaise}`}
              className="w-24 px-2 py-2 text-sm rounded bg-gray-800 border border-gray-600 text-white"
            />
            <button
              onClick={submitBetOrRaise}
              className="px-4 py-2 rounded bg-yellow-600 text-white text-sm font-medium hover:bg-yellow-500"
            >
              Raise
            </button>
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => onAction({ type: 'check' })}
            className="px-4 py-2 rounded bg-gray-600 text-white text-sm font-medium hover:bg-gray-500"
          >
            Check
          </button>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={1}
              max={myStack}
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="amount"
              className="w-24 px-2 py-2 text-sm rounded bg-gray-800 border border-gray-600 text-white"
            />
            <button
              onClick={submitBetOrRaise}
              className="px-4 py-2 rounded bg-yellow-600 text-white text-sm font-medium hover:bg-yellow-500"
            >
              Bet
            </button>
          </div>
        </>
      )}
    </div>
  );
}
