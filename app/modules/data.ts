// modules/data.ts
import {
  MailWarning,
  Pointer,
  MessageSquareDashed,
  Signal,
  Bot,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

export const problemItems = [
  { id: 1, text: 'Inbox overload', icon: MailWarning, bgColor: 'bg-orange-50', color: 'text-orange-500' },
  { id: 2, text: 'Manual sorting', icon: Pointer, bgColor: 'bg-orange-50', color: 'text-orange-500' },
  { id: 3, text: 'Missed requests', icon: MessageSquareDashed, bgColor: 'bg-orange-50', color: 'text-orange-500' },
  { id: 4, text: 'Noise instead of signal', icon: Signal, bgColor: 'bg-orange-50', color: 'text-orange-500' },
];

export const solutionItems = [
  { id: 1, text: 'AI automated replies', icon: Bot, bgColor: 'bg-blue-50', color: 'text-blue-500' },
  { id: 2, text: 'Smart categorization', icon: Zap, bgColor: 'bg-blue-50', color: 'text-blue-500' },
  { id: 3, text: 'Instant response', icon: Sparkles, bgColor: 'bg-blue-50', color: 'text-blue-500' },
  { id: 4, text: 'Clear signal only', icon: CheckCircle2, bgColor: 'bg-blue-50', color: 'text-blue-500' },
];

export const steps = [
  { id: 1, title: 'Intent detected' },
  { id: 2, title: 'Classification' },
  { id: 3, title: 'Information extraction' },
  { id: 4, title: 'Action triggered' },
];

// data.ts
export const channelLogos = [
  { id: 1, name: 'chat', src: '/logos/chat.png' },
  { id: 2, name: 'discord', src: '/logos/discord.png' },
  { id: 3, name: 'email', src: '/logos/email.png' },
  { id: 4, name: 'meets', src: '/logos/meets.png' },
  { id: 5, name: 'messanger', src: '/logos/messanger.png' },
  { id: 6, name: 'slack', src: '/logos/slack.png' },
  { id: 7, name: 'telegram', src: '/logos/telegram.png' },
  { id: 8, name: 'whatsapp', src: '/logos/whatsapp.png' },
  { id: 9, name: 'zoom', src: '/logos/zoom.png' },
];

// добавляем placeholder actions
export const channelActions = [
  { id: 1, name: 'Route to department', icon: '/icons/route.png' },
  { id: 2, name: 'Create Jira task', icon: '/icons/plus.png' },
  { id: 3, name: 'Notify responsible', icon: '/icons/bell.png' },
  { id: 4, name: 'Auto-reply', icon: '/icons/reply.png' },
  { id: 5, name: 'Delete spam', icon: '/icons/trash.png' },
];
