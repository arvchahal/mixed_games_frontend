'use client'

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import SettingsDropdown from "./components/SettingsDropdown";
import GameTable from "./components/GameTable";
import Ledger from "./components/Ledger";
import Chat, { ChatMessage } from "./components/Chat";
import { DEFAULT_ROOM_SETTINGS, RoomSettings } from "./settings";
import { GameState, Action, LedgerEntry } from "./type";

type PageState = "join" | "lobby" | "in_round";
type LobbyPlayer = { id: string; displayName: string; stack: number; seatIndex: number; connected?: boolean };
type LobbyUpdate = {
  roomId: string;
  ownerId: string;
  status: "lobby" | "in_round";
  settings?: RoomSettings;
  players: LobbyPlayer[];
  pendingPlayers: LobbyPlayer[];
  ledger: LedgerEntry[];
  chatMessages: ChatMessage[];
};

export default function RoomPage() {
  const { room_id: roomId } = useParams<{ room_id: string }>();

  const [pageState, setPageState] = useState<PageState>("join");
  const [joinName, setJoinName] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joining, setJoining] = useState(false);

  const [playerId, setPlayerId] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [players, setPlayers] = useState<LobbyPlayer[]>([]);
  const [settings, setSettings] = useState<RoomSettings>(DEFAULT_ROOM_SETTINGS);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const pageStateRef = useRef<PageState>("join");

  useEffect(() => { pageStateRef.current = pageState; }, [pageState]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      const savedId = localStorage.getItem(`pid_${roomId}`);
      if (savedId) {
        setPlayerId(savedId);
        socket.emit("join_room", { room_id: roomId, player_id: savedId, display_name: "" });
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
      setLedger(data.ledger);
      setChatMessages(data.chatMessages ?? []);
      if (data.settings) setSettings(data.settings);
      if (data.status !== "in_round") setPageState("lobby");
    });

    socket.on("game_state", (data: GameState) => {
      setGameState(data);
      setLedger(data.ledger);
      setChatMessages(data.chatMessages ?? []);
      setPageState("in_round");
    });

    socket.on("chat_message", (msg: ChatMessage) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    socket.on("error", ({ message }: { message: string }) => {
      setJoinError(message);
      setJoining(false);
      if (pageStateRef.current === "join") {
        setPlayerId(null);
        localStorage.removeItem(`pid_${roomId}`);
      }
    });

    return () => { socket.disconnect(); };
  }, [roomId]);

  function handleJoin() {
    const trimmed = joinName.trim();
    if (!trimmed || !socketRef.current) return;
    setJoining(true);
    setJoinError("");
    socketRef.current.emit("join_room", { room_id: roomId, display_name: trimmed });
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

  function handleTransferOwnership(targetId: string) {
    socketRef.current?.emit("transfer_ownership", { room_id: roomId, player_id: playerId, target_id: targetId });
  }

  function handleSendChat(text: string) {
    if (!socketRef.current || !playerId) return;
    socketRef.current.emit("chat_message", { room_id: roomId, player_id: playerId, text });
  }

  const isOwner = playerId !== null && playerId === ownerId;

  if (pageState === "join" && !playerId) {
    const canJoin = joinName.trim().length > 0 && !joining;
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
        <div className="flex items-center gap-3">
          {pageState === "lobby" && isOwner && (
            <button
              onClick={handleStartRound}
              disabled={players.length < 2}
              className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            >
              Start Round
            </button>
          )}
          {ledger.length > 0 && <Ledger ledger={ledger} />}
          <Chat messages={chatMessages} onSend={handleSendChat} />
          <SettingsDropdown settings={settings} isOwner={isOwner} onSave={handleSaveSettings} />
        </div>
      </div>

      {pageState === "lobby" && (
        <div className="px-6 py-3 border-b border-gray-800 flex items-center gap-3 flex-wrap">
          {players.map((p) => (
            <div key={p.id} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${p.connected === false ? 'bg-gray-500' : 'bg-green-500'}`} />
              <span className={`text-sm ${p.id === playerId ? 'text-white font-medium' : 'text-gray-400'}`}>
                {p.displayName}
                {p.id === ownerId && <span className="ml-1 text-yellow-400 text-xs">♛</span>}
              </span>
              {isOwner && p.id !== playerId && (
                <button
                  onClick={() => handleTransferOwnership(p.id)}
                  className="text-[10px] text-gray-600 hover:text-gray-300 px-1 transition-colors"
                  title="Transfer ownership"
                >
                  make host
                </button>
              )}
            </div>
          ))}
          {!isOwner && (
            <span className="ml-auto text-xs text-gray-600">Waiting for host to start…</span>
          )}
        </div>
      )}

      <GameTable
        gameState={gameState}
        lobbyPlayers={players}
        myId={playerId}
        onAction={handleAction}
      />
    </div>
  );
}
