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
import type { Dictionary } from '@/i18n/dictionaries';

export const getProblemItems = (dictionary: Dictionary) => [
  { id: 1, text: dictionary.Main.Cards.BadgeBefore.feature1, icon: MailWarning },
  { id: 2, text: dictionary.Main.Cards.BadgeBefore.feature2, icon: Pointer },
  { id: 3, text: dictionary.Main.Cards.BadgeBefore.feature3, icon: MessageSquareDashed },
  { id: 4, text: dictionary.Main.Cards.BadgeBefore.feature4, icon: Signal },
];

export const getSolutionItems = (dictionary: Dictionary) => [
  { id: 1, text: dictionary.Main.Cards.BadgeAfter.feature1, icon: Bot },
  { id: 2, text: dictionary.Main.Cards.BadgeAfter.feature2, icon: Zap },
  { id: 3, text: dictionary.Main.Cards.BadgeAfter.feature3, icon: Sparkles },
  { id: 4, text: dictionary.Main.Cards.BadgeAfter.feature4, icon: CheckCircle2 },
];

export const getSteps = (dictionary: Dictionary) => [
  { id: 1, title: dictionary.Main.HowItWorks.steps.text1 },
  { id: 2, title: dictionary.Main.HowItWorks.steps.text2 },
  { id: 3, title: dictionary.Main.HowItWorks.steps.text3 },
  { id: 4, title: dictionary.Main.HowItWorks.steps.text4 },
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

export const getChannelActions = (dictionary: Dictionary) => [
  { id: 1, name: dictionary.Main.Actions.functions.function1, icon: '/icons/route.png' },
  { id: 2, name: dictionary.Main.Actions.functions.function2, icon: '/icons/plus.png' },
  { id: 3, name: dictionary.Main.Actions.functions.function3, icon: '/icons/bell.png' },
  { id: 4, name: dictionary.Main.Actions.functions.function4, icon: '/icons/reply.png' },
  { id: 5, name: dictionary.Main.Actions.functions.function5, icon: '/icons/trash.png' },
];
