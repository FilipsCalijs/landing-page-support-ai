'use client';

import { MessageCircle } from 'lucide-react';

interface ChatButtonProps {
  onClick: () => void;
}

export function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-r from-[#0070F3] to-[#0052CC] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-200 group"
      aria-label="Open chat"
    >
      <MessageCircle className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
    </button>
  );
}
