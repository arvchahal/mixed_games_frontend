'use client';

import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

type ChatMessage = { displayName: string; text: string };

interface ChatProps {
  socket: Socket | null;
  roomId: string;
  playerId: string | null;
}

export default function Chat({ socket, roomId, playerId }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;
    const handler = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on('chat_message', handler);
    return () => { socket.off('chat_message', handler); };
  }, [socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function send() {
    const text = input.trim();
    if (!text || !socket || !playerId) return;
    socket.emit('chat_message', { room_id: roomId, player_id: playerId, text });
    setInput('');
  }

  return (
    <div className="flex flex-col w-60 shrink-0 border-r border-gray-800 bg-[#111111] h-full">
      <div className="px-3 py-2 border-b border-gray-800 text-xs text-gray-500 font-medium uppercase tracking-wider">
        Chat
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1.5 min-h-0">
        {messages.map((m, i) => (
          <div key={i} className="text-sm break-words">
            <span className="text-gray-400 font-medium">{m.displayName}: </span>
            <span className="text-gray-300">{m.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="px-2 py-2 border-t border-gray-800 flex gap-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Message…"
          className="flex-1 min-w-0 px-2 py-1.5 text-sm rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
        />
        <button
          onClick={send}
          className="px-2 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
