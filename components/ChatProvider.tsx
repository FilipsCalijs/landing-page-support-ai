'use client';

import { useState, useEffect } from 'react';
import { ChatWidget } from './ChatWidget';
import { ChatButton } from './ChatButton';

interface ChatProviderProps {
  locale: string;
}

export function ChatProvider({ locale }: ChatProviderProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleOpenChat = () => {
      setIsChatOpen(true);
    };

    window.addEventListener('openChat', handleOpenChat);
    return () => window.removeEventListener('openChat', handleOpenChat);
  }, []);

  return (
    <>
      {!isChatOpen && <ChatButton onClick={() => setIsChatOpen(true)} />}
      <ChatWidget 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        locale={locale}
      />
    </>
  );
}
