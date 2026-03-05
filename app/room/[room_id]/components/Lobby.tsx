'use client';

type LobbyPlayer = { id: string; displayName: string; stack: number };

interface LobbyProps {
  players: LobbyPlayer[];
  pendingPlayers: LobbyPlayer[];
  isOwner: boolean;
  onStartRound: () => void;
}

export default function Lobby({ players, pendingPlayers, isOwner, onStartRound }: LobbyProps) {
  return(
    <div></div>
    );
}
