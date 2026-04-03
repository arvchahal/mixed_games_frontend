'use client';

import { useState, useRef, useEffect } from 'react';
import { RoomSettings } from '../settings';

interface SettingsDropdownProps {
  settings: RoomSettings;
  isOwner: boolean;
  onSave?: (updated: RoomSettings) => void;
}

export default function SettingsDropdown({ settings, isOwner, onSave }: SettingsDropdownProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<RoomSettings>(settings);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Sync draft when settings prop changes
  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  function handleSave() {
    onSave?.(draft);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 bg-[#1e1e1e] text-gray-300 text-sm hover:border-gray-500 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Settings
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-700 bg-[#1a1a1a] shadow-2xl z-[9999] overflow-hidden">
          <div className="p-4 flex flex-col gap-4">
            <SettingRow
              label="Stake (buy-in)"
              value={draft.stake}
              disabled={!isOwner}
              onChange={(v) => setDraft((d) => ({ ...d, stake: v }))}
            />
            <SettingRow
              label="Small Blind"
              value={draft.smallBlind}
              disabled={!isOwner}
              onChange={(v) => setDraft((d) => ({ ...d, smallBlind: v }))}
            />
            <SettingRow
              label="Big Blind"
              value={draft.bigBlind}
              disabled={!isOwner}
              onChange={(v) => setDraft((d) => ({ ...d, bigBlind: v }))}
            />

            {!isOwner && (
              <p className="text-xs text-gray-600 text-center">Only the room owner can change settings.</p>
            )}

            {isOwner && (
              <button
                onClick={handleSave}
                className="mt-1 w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
              >
                Save
              </button>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

function SettingRow({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  disabled: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-gray-400 shrink-0">{label}</span>
      <input
        type="number"
        min={1}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-28 px-2.5 py-1.5 rounded-md bg-[#111] border border-gray-700 text-white text-sm text-right
          disabled:opacity-40 disabled:cursor-not-allowed
          focus:outline-none focus:border-violet-500 transition-colors"
      />
    </div>
  );
}
