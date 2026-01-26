'use client';

import { Button } from './ui/Button';

interface ChatTriggerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ChatTrigger({ children, className, size = 'lg' }: ChatTriggerProps) {
  const handleClick = () => {
    const event = new CustomEvent('openChat');
    window.dispatchEvent(event);
  };

  return (
    <Button size={size} className={className} onClick={handleClick}>
      {children}
    </Button>
  );
}
