'use client';

import Image from 'next/image';
import { GameState, Action, PlayerView } from '../type';
import Seat from './Seat';
import Card from "./Card"
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

const CENTER_X = 800;
const CENTER_Y = 450;
const BET_OFFSET = 0.38;

const BET_POSITIONS = SEAT_POSITIONS.map(({ x, y }) => ({
  x: x + (CENTER_X - x) * BET_OFFSET,
  y: y + (CENTER_Y - y) * BET_OFFSET,
}));

const SVG_W = 1600;
const SVG_H = 1080;

type LobbyPlayer = { id: string; displayName: string; stack: number; seatIndex: number; connected?: boolean };

interface GameTableProps {
  gameState: GameState | null;
  lobbyPlayers: LobbyPlayer[];
  myId: string | null;
  onAction: (action: Action) => void;
}

  const hand = gameState?.hand ?? null;
  const myStack = gameState?.myStack ?? 0;
  const winnerInfo = hand?.isOver && hand.winnerId
    ? {
        name: hand.players[hand.winnerId]?.displayName ?? 'Unknown',
        pot: hand.pot,
      }
    : null;

  const isMyTurn = hand ? hand.playerOrder[hand.currentPlayerIndex] === myId && !hand.isOver : false;
  const buttonPlayerId = hand ? hand.playerOrder[hand.buttonIndex] : null;

  // Compute maxRaise from the hand-level player state (hand.players has correct stacks/bets)
  const myHandPlayer = hand && myId ? (hand.players[myId] as PlayerView | undefined) : undefined;
  const toMatch = myHandPlayer ? Math.max(0, hand!.currentBet - myHandPlayer.currentBetAmount) : 0;
  const maxRaise = myHandPlayer ? Math.max(0, myHandPlayer.stack - toMatch) : 0;

  const playerBySeat: Record<number, { id: string; displayName: string; stack: number; currentBetAmount?: number }> = hand
    ? Object.values(hand.players).reduce((acc, p: PlayerView) => {
        acc[p.seatIndex] = p;
        return acc;
      }, {} as Record<number, PlayerView>)
    : lobbyPlayers.reduce((acc, p) => {
        acc[p.seatIndex] = p;
        return acc;
      }, {} as Record<number, LobbyPlayer>);

  return (
    <div className="relative w-full">
      <Image src="/pokertable.svg" alt="" width={1600} height={1080} priority className="w-full h-auto block" />

      {/* Bet chips on the table */}
      {hand && SEAT_POSITIONS.map((_, i) => {
        const player = playerBySeat[i] as PlayerView | undefined;
        if (!player?.currentBetAmount || player.currentBetAmount <= 0) return null;
        const pos = BET_POSITIONS[i];
        return (
          <div
            key={`bet-${i}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 min-w-16 rounded-xl border border-indigo-200/25 bg-gradient-to-b from-indigo-500 to-indigo-700 px-3 py-2 text-center text-white shadow-[0_10px_30px_rgba(79,70,229,0.45)] ring-2 ring-indigo-300/15"
            style={{ left: `${(pos.x / SVG_W) * 100}%`, top: `${(pos.y / SVG_H) * 100}%` }}
          >
            <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-indigo-100/80">Bet</div>
            <div className="text-sm font-black leading-none tabular-nums">{player.currentBetAmount}</div>
          </div>
        );
      })}

      {/* Seats and cards */}
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
              player={player}
              isMe={player?.id === myId}
              isButton={player?.id === buttonPlayerId}
              isCurrentTurn={hand ? hand.playerOrder[hand.currentPlayerIndex] === player?.id && !hand.isOver : false}
              handActive={!!hand && !hand.isOver}
              connected={(player as LobbyPlayer | undefined)?.connected}
              handStatus={hand ? (hand.players[player?.id ?? ''] as { handStatus?: string } | undefined)?.handStatus : undefined}
            />
            {player && hand && <Card card={
                ? null
                : (player as PlayerView).card ?? null
            }/>}
          </div>
        );
      })}

      {/* Pot display */}
      {hand && hand.pot > 0 && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
          style={{ left: '50%', top: 'calc(50% + 50px)' }}
        >
          <div className="rounded-xl border border-violet-500/30 bg-[#0e0e1a]/80 px-4 py-2 shadow-[0_0_28px_rgba(139,92,246,0.45)]">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-violet-400/70">Pot</div>
            <div className="text-xl font-black text-white tabular-nums">{hand.pot}</div>
          </div>
        </div>
      )}

      {/* Winner reveal overlay */}
      {winnerInfo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="rounded-lg border-2 border-indigo-500 bg-[#1e1e2e] text-gray-200 text-center px-10 py-6 shadow-2xl">
            <div className="text-xl font-bold">{winnerInfo.name}</div>
            <div className="text-sm mt-1 text-gray-400">wins {winnerInfo.pot}</div>
          </div>
        </div>
      )}

      {hand && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10">
          <OptionButtons
            key={`turn-${hand.currentPlayerIndex}-${hand.currentBet}-${hand.pot}`}
            isMyTurn={isMyTurn}
            currentBet={hand.currentBet}
            callAmount={toMatch}
            myStack={myStack}
            minRaise={hand.minRaise}
            maxRaise={maxRaise}
            onAction={onAction}
          />
        </div>
      )}
    </div>
  );
}
