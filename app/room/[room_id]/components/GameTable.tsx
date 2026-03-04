'use client';

import { useState } from 'react';
import { GameState, Action, PlayerView } from '../types';
import Card from './Card';

interface GameTableProps {
  gameState: GameState;
  onAction: (action: Action) => void;
}

export default function GameTable({ gameState, onAction }: GameTableProps) {
  const { hand, myId, myStack } = gameState;
  const [betAmount, setBetAmount] = useState('');

  const isMyTurn = hand.playerOrder[hand.currentPlayerIndex] === myId && !hand.isOver;
  const hasBet = hand.currentBet > 0;
  const me = hand.players[myId];
  const others = hand.playerOrder.filter((id) => id !== myId).map((id) => hand.players[id]);

  function sendBet() {
    const n = Number(betAmount);
    if (!n || n <= 0) return;
    onAction(hasBet ? { type: 'raise', amount: n } : { type: 'bet', amount: n });
    setBetAmount('');
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">

      {/* Other players */}
      <div className="flex flex-wrap gap-6 justify-center px-8 pt-8 pb-4">
        {others.map((p) => p && <PlayerSlot key={p.id} player={p} isActive={hand.playerOrder[hand.currentPlayerIndex] === p.id && !hand.isOver} />)}
      </div>

      {/* Center info */}
      <div className="flex flex-col items-center gap-1 py-4">
        {hand.isOver && hand.winnerId && (
          <div className="mb-2 px-4 py-1.5 rounded-full bg-violet-700/60 text-violet-200 text-sm font-medium">
            {hand.players[hand.winnerId]?.displayName ?? 'Unknown'} wins the pot!
          </div>
        )}
        <div className="text-gray-400 text-sm">
          Pot: <span className="text-white font-semibold">{hand.pot}</span>
          {hand.currentBet > 0 && (
            <span className="ml-4">Current bet: <span className="text-white font-semibold">{hand.currentBet}</span></span>
          )}
        </div>
      </div>

      {/* Your seat */}
      <div className="flex flex-col items-center gap-3 pb-4">
        <div className="flex flex-col items-center gap-1">
          <Card card={null} size="lg" />
          <span className="text-xs text-gray-500 mt-1">Your card (hidden)</span>
          <span className="text-sm text-white font-medium">{me?.displayName ?? 'You'}</span>
          <span className="text-xs text-gray-500">{myStack} chips</span>
          {me?.handStatus !== 'active' && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${me?.handStatus === 'folded' ? 'bg-red-900/40 text-red-400' : 'bg-yellow-900/40 text-yellow-400'}`}>
              {me?.handStatus}
            </span>
          )}
        </div>

        {/* Action panel */}
        {isMyTurn && (
          <div className="flex flex-col items-center gap-3 w-full max-w-sm px-4">
            <p className="text-xs text-violet-400">Your turn</p>
            <div className="flex gap-2 w-full">
              <button onClick={() => onAction({ type: 'fold' })}
                className="flex-1 py-2 rounded-lg bg-red-900/50 hover:bg-red-800/60 border border-red-800 text-red-300 text-sm font-medium transition-colors">
                Fold
              </button>
              {!hasBet && (
                <button onClick={() => onAction({ type: 'check' })}
                  className="flex-1 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm font-medium transition-colors">
                  Check
                </button>
              )}
              {hasBet && (
                <button onClick={() => onAction({ type: 'call' })}
                  className="flex-1 py-2 rounded-lg bg-blue-900/50 hover:bg-blue-800/60 border border-blue-800 text-blue-300 text-sm font-medium transition-colors">
                  Call {hand.currentBet}
                </button>
              )}
            </div>
            <div className="flex gap-2 w-full">
              <input
                type="number"
                min={1}
                placeholder={hasBet ? `Raise by...` : `Bet amount...`}
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendBet()}
                className="flex-1 px-3 py-2 rounded-lg bg-[#1e1e1e] border border-gray-700 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
              />
              <button onClick={sendBet} disabled={!betAmount || Number(betAmount) <= 0}
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors">
                {hasBet ? 'Raise' : 'Bet'}
              </button>
            </div>
          </div>
        )}

        {!isMyTurn && !hand.isOver && me?.handStatus === 'active' && (
          <p className="text-xs text-gray-600">Waiting for your turn...</p>
        )}
      </div>
    </div>
  );
}

function PlayerSlot({ player, isActive }: { player: PlayerView; isActive: boolean }) {
  const folded = player.handStatus === 'folded';
  const allIn = player.handStatus === 'all in';

  return (
    <div className={`flex flex-col items-center gap-2 transition-opacity ${folded ? 'opacity-40' : 'opacity-100'}`}>
      <div className={`relative`}>
        <Card card={player.card} size="md" />
        {isActive && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-violet-400 ring-2 ring-[#151515]" />
        )}
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xs text-white font-medium">{player.displayName}</span>
        <span className="text-xs text-gray-500">{player.stack}</span>
        {folded && <span className="text-xs text-red-500">folded</span>}
        {allIn && <span className="text-xs text-yellow-500">all in</span>}
      </div>
    </div>
  );
}
