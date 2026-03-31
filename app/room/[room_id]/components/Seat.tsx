'use client';

interface SeatProps {
  player?: { displayName: string; stack: number };
  isMe?: boolean;
  isButton?: boolean;
  isCurrentTurn?: boolean;
  handActive?: boolean; // true when a hand is in progress
  connected?: boolean;  // undefined = in-round (unknown), false = disconnected
  handStatus?: string;
}

export default function Seat({ player, isMe, isButton, isCurrentTurn, handActive, connected, handStatus }: SeatProps) {
  if (player) {
    const folded = handStatus === 'folded';
    // Dim players who are not the current turn during an active hand, or who have folded
    const dimmed = folded || (handActive && !isCurrentTurn);
    const seatClasses = folded
      ? 'bg-gray-800 ring-2 ring-gray-600'
      : isCurrentTurn
      ? isMe
        ? 'bg-orange-600 ring-4 ring-orange-400 shadow-lg shadow-orange-500/30'
        : 'bg-indigo-500 ring-4 ring-indigo-300 shadow-lg shadow-indigo-500/30'
      : isMe
      ? 'bg-violet-700 ring-2 ring-violet-400'
      : 'bg-gray-700';
    const stackClasses = 'text-gray-300';

    return (
      <div className={`flex flex-col items-center gap-1 transition-opacity duration-300 ${dimmed ? 'opacity-50' : 'opacity-100'}`}>
        <div className="relative">
          <div
            className={`flex flex-col items-center justify-center w-20 h-20 rounded-full text-white text-sm font-medium overflow-hidden transition-all duration-300 ${seatClasses}`}
          >
            {folded ? (
              <>
                <span className="max-w-full truncate whitespace-nowrap px-2 text-gray-400 text-xs">{player.displayName}</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Folded</span>
              </>
            ) : (
              <>
                <span className="max-w-full truncate whitespace-nowrap px-2">{player.displayName}</span>
                <span className={`text-xs ${stackClasses}`}>{player.stack}</span>
              </>
            )}
          </div>
          {isButton && (
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-yellow-400 text-black text-xs font-bold flex items-center justify-center">
              D
            </div>
          )}
          {connected === false && (
            <div className="absolute top-0 left-0 w-4 h-4 rounded-full bg-gray-500 border-2 border-[#151515]" title="Disconnected" />
          )}
          {connected === true && (
            <div className="absolute top-0 left-0 w-4 h-4 rounded-full bg-green-500 border-2 border-[#151515]" title="Connected" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-700" />
  );
}
