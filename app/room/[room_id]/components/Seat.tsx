'use client';

interface SeatProps {
  player?: { displayName: string; stack: number };
  isMe?: boolean;
  isButton?: boolean;
  isCurrentTurn?: boolean;
  handActive?: boolean; // true when a hand is in progress
}

export default function Seat({ player, isMe, isButton, isCurrentTurn, handActive }: SeatProps) {
  if (player) {
    // Dim players who are not the current turn during an active hand
    const dimmed = handActive && !isCurrentTurn;

    return (
      <div className={`flex flex-col items-center gap-1 transition-opacity duration-300 ${dimmed ? 'opacity-40' : 'opacity-100'}`}>
        <div className="relative">
          <div
            className={`flex flex-col items-center justify-center w-20 h-20 rounded-full text-white text-sm font-medium overflow-hidden transition-all duration-300 ${
              isCurrentTurn
                ? 'bg-orange-600 ring-4 ring-orange-400'
                : isMe
                ? 'bg-violet-700 ring-2 ring-violet-400'
                : 'bg-gray-700'
            }`}
          >
            <span className="max-w-full truncate whitespace-nowrap px-2">{player.displayName}</span>
            <span className="text-xs text-gray-300">{player.stack}</span>
          </div>
          {isButton && (
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-yellow-400 text-black text-xs font-bold flex items-center justify-center">
              D
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-700" />
  );
}
