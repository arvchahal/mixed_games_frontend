'use client';

import { useState, useEffect } from 'react';
import { Action } from '../type';

interface OptionButtonsProps {
  isMyTurn: boolean;
  currentBet: number;
  callAmount: number;
  myStack: number;
  minRaise: number;
  maxRaise: number;
  onAction: (action: Action) => void;
}

const TURN_SECONDS = 60;

export default function OptionButtons({ isMyTurn, currentBet, callAmount, myStack, minRaise, maxRaise, onAction }: OptionButtonsProps) {
  const [amount, setAmount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TURN_SECONDS);

  // This component remounts on each turn, so the local timer state resets naturally.
  useEffect(() => {
    if (!isMyTurn) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isMyTurn]);

  const hasBet = currentBet > 0;

  function submitBetOrRaise() {
    let n = Number(amount);
    if (!n || n <= 0) return;
    if (hasBet) {
      // Clamp to [minRaise, maxRaise]. If maxRaise < minRaise the player is
      // going all-in for less than the min — backend allows this.
      const effectiveMin = Math.min(minRaise, maxRaise);
      n = Math.max(n, effectiveMin);
      n = Math.min(n, maxRaise);
      onAction({ type: 'raise', amount: n });
    } else {
      n = Math.min(n, myStack);
      onAction({ type: 'bet', amount: n });
    }
    setAmount(0);
  }

  const pct = (timeLeft / TURN_SECONDS) * 100;
  const barColor = timeLeft > 20 ? 'bg-gray-400' : timeLeft > 10 ? 'bg-yellow-400' : 'bg-red-400';

  return (
    <div className={`flex flex-col items-center gap-2${!isMyTurn ? ' opacity-50 pointer-events-none' : ''}`}>
      {isMyTurn && (
        <div className="w-48 h-1.5 rounded-full bg-gray-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
      <div className="flex items-center gap-2">
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
              Call {callAmount}
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
    </div>
  );
}
