'use client';

import { Card as CardType } from '../type';

const RED_SUITS = new Set(['H', 'D', 'hearts', 'diamonds', '♥', '♦']);

const SUIT_SYMBOL: Record<string, string> = {
  S: '♠', spades: '♠', '♠': '♠',
  H: '♥', hearts: '♥', '♥': '♥',
  D: '♦', diamonds: '♦', '♦': '♦',
  C: '♣', clubs: '♣', '♣': '♣',
};

interface CardProps {
  card: CardType | null; // null = face-down
  size?: 'sm' | 'md' | 'lg';
}

export default function Card({ card, size = 'md' }: CardProps) {
  const dims = {
    sm: 'w-10 h-14 text-xs',
    md: 'w-14 h-20 text-sm',
    lg: 'w-20 h-28 text-base',
  }[size];

  if (!card) {
    return (
      <div className={`${dims} rounded-lg border border-gray-600 bg-[#1a1a2e] flex items-center justify-center shadow-md`}>
        <div className="w-3/4 h-3/4 rounded border border-gray-700 bg-[#16213e]" />
      </div>
    );
  }

  const symbol = SUIT_SYMBOL[card.suit] ?? card.suit;
  const red = RED_SUITS.has(card.suit);
  const color = red ? 'text-red-500' : 'text-gray-900';

  const centerSize = { sm: 'text-xl', md: 'text-3xl', lg: 'text-4xl' }[size];

  return (
    <div className={`${dims} rounded-lg bg-white flex flex-col justify-between p-1 shadow-md select-none`}>
      <div className={`font-bold leading-none ${color}`}>
        <div>{card.rank}</div>
        <div className="text-xs">{symbol}</div>
      </div>
      <div className={`${centerSize} text-center leading-none ${color}`}>{symbol}</div>
      <div className={`font-bold leading-none self-end rotate-180 ${color}`}>
        <div>{card.rank}</div>
        <div className="text-xs">{symbol}</div>
      </div>
    </div>
  );
}
