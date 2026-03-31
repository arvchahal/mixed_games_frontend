'use client';

import { useState, useRef, useEffect } from 'react';

export type ChatMessage = { displayName: string; text: string; sentAt: number };

interface ChatProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
}

export default function Chat({ messages, onSend }: ChatProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  function send() {
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput('');
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 bg-[#1e1e1e] text-gray-300 text-sm hover:border-gray-500 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.83L3 20l1.13-3.38A7.946 7.946 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Chat
        {messages.length > 0 && !open && (
          <span className="ml-0.5 text-xs text-gray-500">{messages.length}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-gray-700 bg-[#1a1a1a] shadow-2xl z-50 flex flex-col overflow-hidden" style={{ height: '380px' }}>
          <div className="px-4 py-2.5 border-b border-gray-700 text-sm font-medium text-white">Chat</div>

          <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1.5 min-h-0">
            {messages.length === 0 && (
              <p className="text-xs text-gray-600 text-center mt-4">No messages yet</p>
            )}
            {messages.map((m) => (
              m.displayName === "Game"
                ? (
                  <div key={`${m.sentAt}-${m.displayName}-${m.text}`} className="text-xs text-indigo-300/80 italic break-words py-0.5">
                    {m.text}
                  </div>
                ) : (
                  <div key={`${m.sentAt}-${m.displayName}-${m.text}`} className="text-sm break-words">
                    <span className="text-gray-400 font-medium">{m.displayName}: </span>
                    <span className="text-gray-300">{m.text}</span>
                  </div>
                )
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="px-2 py-2 border-t border-gray-700 flex gap-1.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Message…"
              autoFocus
              className="flex-1 min-w-0 px-2.5 py-1.5 text-sm rounded-lg bg-[#111] border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
            />
            <button
              onClick={send}
              className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors"
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
