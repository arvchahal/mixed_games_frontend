'use client'

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import SettingsDropdown from "./components/SettingsDropdown";
import Lobby from "./components/Lobby";
import GameTable from "./components/GameTable";
import { DEFAULT_ROOM_SETTINGS, RoomSettings } from "./settings";
import { GameState, Action } from "./types";

type PageState = "join" | "lobby" | "in_round";
type LobbyPlayer = { id: string; displayName: string; stack: number };
type LobbyUpdate = {
  roomId: string;
  ownerId: string;
  status: "lobby" | "in_round";
  players: LobbyPlayer[];
  pendingPlayers: LobbyPlayer[];
};

export default function RoomPage() {
  const { room_id: roomId } = useParams<{ room_id: string }>();

  const [pageState, setPageState] = useState<PageState>("join");
  const [joinName, setJoinName] = useState("");
  const [joinStack, setJoinStack] = useState(100);
  const [joinError, setJoinError] = useState("");
  const [joining, setJoining] = useState(false);

  const [playerId, setPlayerId] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [players, setPlayers] = useState<LobbyPlayer[]>([]);
  const [pendingPlayers, setPendingPlayers] = useState<LobbyPlayer[]>([]);
  const [settings, setSettings] = useState<RoomSettings>(DEFAULT_ROOM_SETTINGS);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      const savedId = localStorage.getItem(`pid_${roomId}`);
      const savedStack = Number(localStorage.getItem(`stack_${roomId}`)) || 100;
      if (savedId) {
        setPlayerId(savedId);
        socket.emit("join_room", { room_id: roomId, player_id: savedId, display_name: "", stack: savedStack });
      }
    });

    socket.on("disconnect", () => setIsConnected(false));

    socket.on("room_joined", ({ playerId: pid }: { playerId: string }) => {
      localStorage.setItem(`pid_${roomId}`, pid);
      setPlayerId(pid);
      setJoining(false);
    });

    socket.on("lobby_update", (data: LobbyUpdate) => {
      setOwnerId(data.ownerId);
      setPlayers(data.players);
      setPendingPlayers(data.pendingPlayers);
      if (data.status !== "in_round") setPageState("lobby");
    });

    socket.on("game_state", (data: GameState) => {
      setGameState(data);
      setPageState("in_round");
    });

    socket.on("error", ({ message }: { message: string }) => {
      setJoinError(message);
      setJoining(false);
    });

    return () => { socket.disconnect(); };
  }, [roomId]);

  function handleJoin() {
    const trimmed = joinName.trim();
    if (!trimmed || joinStack <= 0 || !socketRef.current) return;
    setJoining(true);
    setJoinError("");
    localStorage.setItem(`stack_${roomId}`, String(joinStack));
    socketRef.current.emit("join_room", { room_id: roomId, display_name: trimmed, stack: joinStack });
  }

  function handleStartRound() {
    if (!socketRef.current || !playerId) return;
    socketRef.current.emit("start_round", { room_id: roomId, player_id: playerId });
  }

  function handleAction(action: Action) {
    if (!socketRef.current || !playerId) return;
    socketRef.current.emit("player_action", { room_id: roomId, player_id: playerId, action });
  }

  function handleSaveSettings(updated: RoomSettings) {
    setSettings(updated);
    socketRef.current?.emit("update_settings", { room_id: roomId, player_id: playerId, settings: updated });
  }

  const isOwner = playerId !== null && playerId === ownerId;

  if (pageState === "join" && !playerId) {
    const canJoin = joinName.trim().length > 0 && joinStack > 0 && !joining;
    return (
      <div className="flex flex-col min-h-screen bg-[#151515] items-center justify-center">
        <div className="flex flex-col gap-4 w-72">
          <h1 className="text-xl font-semibold text-white">Join room</h1>
          <p className="text-xs text-gray-600 font-mono">{roomId}</p>
          <input
            type="text"
            placeholder="Your display name"
            value={joinName}
            disabled={joining}
            onChange={(e) => setJoinName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && canJoin && handleJoin()}
            className="px-3 py-2 rounded-lg bg-[#1e1e1e] border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 disabled:opacity-40 transition-colors"
            autoFocus
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Starting stack</label>
            <input
              type="number"
              min={1}
              value={joinStack}
              disabled={joining}
              onChange={(e) => setJoinStack(Number(e.target.value))}
              className="px-3 py-2 rounded-lg bg-[#1e1e1e] border border-gray-700 text-white focus:outline-none focus:border-violet-500 disabled:opacity-40 transition-colors"
            />
          </div>
          {joinError && <p className="text-red-400 text-sm">{joinError}</p>}
          <button
            onClick={handleJoin}
            disabled={!canJoin}
            className="py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors"
          >
            {joining ? "Joining..." : "Take a Seat"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151515] text-white flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-gray-600"}`} />
          <span className="text-xs text-gray-500 font-mono">{roomId}</span>
        </div>
        <SettingsDropdown settings={settings} isOwner={isOwner} onSave={handleSaveSettings} />
      </div>

      {pageState === "lobby" && (
        <Lobby
          players={players}
          pendingPlayers={pendingPlayers}
          isOwner={isOwner}
          onStartRound={handleStartRound}
        />
      )}

      {pageState === "in_round" && gameState && (
        <GameTable gameState={gameState} onAction={handleAction} />
      )}
    </div>
  );
}
