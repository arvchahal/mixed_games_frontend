'use client';

import { useState } from 'react';
import { GameState, Action, PlayerView } from '../type';
import Seat from './Seat';
import OptionButtons from './OptionButtons';

const SEAT_POSITIONS = [
  { x: 400,  y: 130 },  // 0 — top left
  { x: 800,  y: 95  },  // 1 — top center
  { x: 1200, y: 130 },  // 2 — top right
  { x: 1385, y: 450 },  // 3 — right
  { x: 1200, y: 770 },  // 4 — bottom right
  { x: 800,  y: 805 },  // 5 — bottom center
  { x: 400,  y: 770 },  // 6 — bottom left
  { x: 215,  y: 450 },  // 7 — left
];
const SVG_W = 1600;
const SVG_H = 1080;

interface GameTableProps {
  gameState: GameState;
  onAction: (action: Action) => void;
}

export default function GameTable({ gameState, onAction }: GameTableProps) {
  const { hand, myId, myStack } = gameState;

  const isMyTurn = hand.playerOrder[hand.currentPlayerIndex] === myId && !hand.isOver;
  const buttonPlayerId = hand.playerOrder[hand.buttonIndex];

  const playerBySeat = Object.values(hand.players).reduce((acc, p) => {
    acc[p.seatIndex] = p;
    return acc;
  }, {} as Record<number, PlayerView>);

  const [mySeatIndex, setMySeatIndex] = useState<number | null>(null);

  function handleSit(seatIndex: number, displayName: string) {
    setMySeatIndex(seatIndex);
    // TODO: emit sit_down socket event
  }

  function handleAction(action: Action) {
    onAction(action);
  }

  return (
    <div className="relative w-full">
      <img src="/pokertable.svg" className="w-full block" />
      {SEAT_POSITIONS.map((pos, i) => {
        const player = playerBySeat[i];
        return (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${(pos.x / SVG_W) * 100}%`,
              top: `${(pos.y / SVG_H) * 100}%`,
            }}
          >
            <Seat
              seatIndex={i}
              onSit={handleSit}
              player={player}
              isSeated={mySeatIndex !== null && mySeatIndex !== i}
              isButton={player?.id === buttonPlayerId}
              currentBetAmount={player?.currentBetAmount}
            />
          </div>
        );
      })}
      <div
        className="absolute -translate-x-1/2"
        style={{ left: '50%', top: '88%' }}
      >
        <OptionButtons
          isMyTurn={isMyTurn}
          currentBet={hand.currentBet}
          myStack={myStack}
          minRaise={hand.minRaise}
          onAction={handleAction}
        />
      </div>
    </div>
  );
}
