'use client'

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import NavBar from "../components/NavBar";

type State = "idle" | "creating" | "error";

export default function NewRoom() {
  const [name, setName] = useState("");
  const [stack, setStack] = useState(100);
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    return () => { socketRef.current?.disconnect(); };
  }, []);

  function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed || stack <= 0) return;

    setState("creating");
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);
    socketRef.current = socket;

    socket.once("room_created", ({ roomId, playerId }: { roomId: string; playerId: string }) => {
      localStorage.setItem(`pid_${roomId}`, playerId);
      localStorage.setItem(`stack_${roomId}`, String(stack));
      router.push(`/room/${roomId}`);
    });

    socket.once("error", ({ message }: { message: string }) => {
      setErrorMsg(message);
      setState("error");
      socket.disconnect();
    });

    socket.once("connect", () => {
      socket.emit("create_room", { display_name: trimmed, game_type: "indianPoker", settings: { stake: 100, smallBlind: 0.5, bigBlind: 1 }, stack });
    });
  }

  const canCreate = name.trim().length > 0 && stack > 0 && state !== "creating";

  return (
    <div className="flex flex-col min-h-screen bg-[#151515]">
      <NavBar src="/cardlogo.svg" />
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col gap-4 w-72">
          <h1 className="text-xl font-semibold text-white">Create a room</h1>
          <input
            type="text"
            placeholder="Your display name"
            value={name}
            disabled={state === "creating"}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && canCreate && handleCreate()}
            className="px-3 py-2 rounded-lg bg-[#1e1e1e] border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 disabled:opacity-40 transition-colors"
            autoFocus
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Starting stack</label>
            <input
              type="number"
              min={1}
              value={stack}
              disabled={state === "creating"}
              onChange={(e) => setStack(Number(e.target.value))}
              className="px-3 py-2 rounded-lg bg-[#1e1e1e] border border-gray-700 text-white focus:outline-none focus:border-violet-500 disabled:opacity-40 transition-colors"
            />
          </div>
          {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
          <button
            onClick={handleCreate}
            disabled={!canCreate}
            className="py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors"
          >
            {state === "creating" ? "Creating..." : "Create Room"}
          </button>
        </div>
      </main>
    </div>
  );
}
