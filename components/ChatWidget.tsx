'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Loader2 } from 'lucide-react';
import { Typography } from './ui/Typography';
import { Button } from './ui/Button';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export function ChatWidget({ isOpen, onClose, locale }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [hasCollectedInfo, setHasCollectedInfo] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '0',
        text: locale === 'ru' 
          ? 'Привет! 👋 Я Odly. Расскажу всё о нашей платформе. Как вас зовут?' 
          : 'Hi! 👋 I\'m Odly. I\'ll tell you everything about our platform. What\'s your name?',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, locale, messages.length]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      if (!hasCollectedInfo) {
        if (!userName) {
          setUserName(inputValue);
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: locale === 'ru' 
              ? `Приятно познакомиться, ${inputValue}! 😊 Какой у вас email?` 
              : `Nice to meet you, ${inputValue}! 😊 What's your email?`,
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botResponse]);
          setIsLoading(false);
          return;
        } else if (!userEmail) {
          setUserEmail(inputValue);
          setHasCollectedInfo(true);
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: locale === 'ru' 
              ? 'Отлично! Теперь спрашивайте что угодно об Odly. 🚀\n\nНапример:\n• Какие каналы поддерживает Odly?\n• Как работает AI?\n• Сколько стоит?'
              : 'Perfect! Now ask me anything about Odly. 🚀\n\nFor example:\n• What channels does Odly support?\n• How does the AI work?\n• How much does it cost?',
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botResponse]);
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          chatId,
          userName,
          userEmail,
          locale,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (!chatId && data.chatId) {
          setChatId(data.chatId);
        }

        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.reply || (locale === 'ru' ? 'Извините, произошла ошибка.' : 'Sorry, an error occurred.'),
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: locale === 'ru' 
          ? 'Извините, не удалось отправить сообщение. Попробуйте снова.' 
          : 'Sorry, failed to send message. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-[#0070F3] to-[#0052CC] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <Typography variant="body3" weight="bold" className="text-white">
              Odly Assistant
            </Typography>
            <Typography variant="body4" className="text-white/80 text-sm">
              {locale === 'ru' ? 'Онлайн' : 'Online'}
            </Typography>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-[#0070F3] text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <Typography 
                variant="body4" 
                className={`whitespace-pre-wrap ${message.sender === 'user' ? 'text-white' : 'text-gray-800'}`}
              >
                {message.text}
              </Typography>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              <Typography variant="body4" className="text-gray-400">
                {locale === 'ru' ? 'Печатает...' : 'Typing...'}
              </Typography>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={locale === 'ru' ? 'Напишите сообщение...' : 'Type a message...'}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:border-transparent"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="lg"
            className="rounded-xl px-4"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
