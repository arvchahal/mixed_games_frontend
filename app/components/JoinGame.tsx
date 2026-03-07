'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinGame() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const router = useRouter();

  function join() {
    const trimmed = code.trim();
    if (!trimmed) return;
    router.push(`/room/${trimmed}`);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="p-3 rounded-lg border-2 border-gray-600 w-56 flex justify-center text-gray-300 cursor-pointer hover:bg-gray-800 text-base transition-colors"
      >
        Join a game
      </button>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        autoFocus
        placeholder="Room code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && join()}
        className="px-3 py-2.5 rounded-lg bg-[#1e1e1e] border border-gray-600 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 text-sm w-36"
      />
      <button
        onClick={join}
        disabled={!code.trim()}
        className="px-4 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white text-sm font-medium transition-colors"
      >
        Join
      </button>
      <button
        onClick={() => { setOpen(false); setCode(''); }}
        className="text-gray-600 hover:text-gray-400 text-sm transition-colors"
      >
        ✕
      </button>
    </div>
  );
}
