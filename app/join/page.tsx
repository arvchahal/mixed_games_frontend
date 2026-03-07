'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinPage() {
  const [code, setCode] = useState('');
  const router = useRouter();

  function join() {
    const trimmed = code.trim();
    if (!trimmed) return;
    router.push(`/room/${trimmed}`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#151515] items-center justify-center">
      <div className="flex flex-col gap-4 w-72">
        <h1 className="text-xl font-semibold text-white">Join a game</h1>
        <input
          type="text"
          autoFocus
          placeholder="Room code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && join()}
          className="px-3 py-2 rounded-lg bg-[#1e1e1e] border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
        />
        <button
          onClick={join}
          disabled={!code.trim()}
          className="py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors"
        >
          Join
        </button>
      </div>
    </div>
  );
}
