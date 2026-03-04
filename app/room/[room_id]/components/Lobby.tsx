'use client';

type LobbyPlayer = { id: string; displayName: string; stack: number };

interface LobbyProps {
  players: LobbyPlayer[];
  pendingPlayers: LobbyPlayer[];
  isOwner: boolean;
  onStartRound: () => void;
}

export default function Lobby({ players, pendingPlayers, isOwner, onStartRound }: LobbyProps) {
  const canStart = players.length >= 2;

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 py-16">
      <div className="flex flex-col gap-6 w-80">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-white">Waiting for players</h2>
          <p className="text-xs text-gray-600">Share the room code at the top to invite others.</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-widest text-gray-600">Seated ({players.length})</p>
          {players.length === 0 && (
            <p className="text-sm text-gray-700 italic">No one seated yet.</p>
          )}
          {players.map((p) => (
            <div key={p.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e1e1e] border border-gray-800">
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              <span className="text-sm text-white flex-1">{p.displayName}</span>
              <span className="text-xs text-gray-500">{p.stack}</span>
            </div>
          ))}
        </div>

        {pendingPlayers.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest text-gray-600">Pending ({pendingPlayers.length})</p>
            {pendingPlayers.map((p) => (
              <div key={p.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e1e1e] border border-gray-800">
                <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
                <span className="text-sm text-gray-400 flex-1">{p.displayName}</span>
                <span className="text-xs text-gray-600">{p.stack}</span>
              </div>
            ))}
          </div>
        )}

        {isOwner && (
          <button
            onClick={onStartRound}
            disabled={!canStart}
            className="py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors"
          >
            {canStart ? "Start Round" : "Need at least 2 players"}
          </button>
        )}

        {!isOwner && (
          <p className="text-xs text-gray-600 text-center">Waiting for the owner to start the round...</p>
        )}
      </div>
    </main>
  );
}
