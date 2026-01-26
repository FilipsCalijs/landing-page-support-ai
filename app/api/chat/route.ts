import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8569371024:AAFcNaxdWrSxuyzZlU2G-cS_mry1v6GCdeM';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

interface ChatRequest {
  message: string;
  chatId?: string | null;
  userName?: string;
  userEmail?: string;
  locale: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, chatId, userName, userEmail, locale } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // If we have user info, include it in the message to bot
    let fullMessage = message;
    if (userName && userEmail) {
      fullMessage = `[Lead: ${userName} <${userEmail}>]\n\n${message}`;
    }

    // For demo purposes, we'll use a fixed chat ID with the bot owner
    // In production, you'd want to configure this as an environment variable
    const targetChatId = chatId || process.env.TELEGRAM_CHAT_ID || '5428924890';

    // Send message to Telegram
    const telegramResponse = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: fullMessage,
        parse_mode: 'HTML',
      }),
    });

    const telegramData = await telegramResponse.json();

    if (!telegramData.ok) {
      console.error('Telegram API error:', {
        ok: telegramData.ok,
        error_code: telegramData.error_code,
        description: telegramData.description,
        targetChatId,
        message: fullMessage,
      });
      return NextResponse.json(
        { 
          error: 'Failed to send message to bot',
          details: telegramData.description || 'Unknown error',
          chatId: targetChatId 
        },
        { status: 500 }
      );
    }

    // For now, return a mock response based on common questions
    // In production, you'd poll for the bot's response or use webhooks
    const reply = generateMockReply(message, locale);

    return NextResponse.json({
      success: true,
      reply,
      chatId: targetChatId,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateMockReply(message: string, locale: string): string {
  const lowerMessage = message.toLowerCase();

  // English responses
  if (locale === 'en') {
    if (lowerMessage.includes('channel') || lowerMessage.includes('integration')) {
      return 'Odly supports multiple channels:\n\n📧 Email (IMAP/SMTP)\n💬 Telegram\n💼 Slack\n📱 WhatsApp\n🌐 Web widget\n\nAll messages unified in one intelligent inbox!';
    }
    
    if (lowerMessage.includes('ai') || lowerMessage.includes('work') || lowerMessage.includes('how')) {
      return 'Here\'s how Odly works:\n\n1️⃣ Messages arrive from any channel\n2️⃣ Embeddings search our knowledge base\n3️⃣ AI decides category & priority\n4️⃣ Smart routing or auto-reply\n\nOur knowledge base learns from every resolution! 🧠';
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('plan')) {
      return 'We have 3 plans:\n\n🆓 Starter: Free for small teams\n💼 Business: $49/user/month\n🚀 Enterprise: Custom pricing\n\nAll plans include AI-powered features. Want to schedule a demo?';
    }
    
    if (lowerMessage.includes('spam')) {
      return 'Odly blocks 90% of spam automatically! 🛡️\n\nThe remaining 10% is marked as suspicious. AI learns your patterns and gets smarter over time.';
    }
    
    if (lowerMessage.includes('department')) {
      return 'Odly handles ALL departments:\n\n✅ Support\n✅ Sales\n✅ HR\n✅ Billing\n\nEverything in one unified platform with smart routing!';
    }

    return 'Great question! Let me connect you with our team for a detailed answer. Meanwhile, you can:\n\n• Check our pricing\n• See supported channels\n• Learn about AI features\n\nWhat interests you most?';
  }

  // Russian responses
  if (lowerMessage.includes('канал') || lowerMessage.includes('интеграц')) {
    return 'Odly поддерживает множество каналов:\n\n📧 Email (IMAP/SMTP)\n💬 Telegram\n💼 Slack\n📱 WhatsApp\n🌐 Веб-виджет\n\nВсе сообщения в одном умном inbox!';
  }
  
  if (lowerMessage.includes('работа') || lowerMessage.includes('как')) {
    return 'Вот как работает Odly:\n\n1️⃣ Сообщение из любого канала\n2️⃣ Поиск похожих решений в базе знаний\n3️⃣ AI определяет категорию и приоритет\n4️⃣ Умная маршрутизация или автоответ\n\nНаша база знаний учится на каждом решении! 🧠';
  }
  
  if (lowerMessage.includes('цен') || lowerMessage.includes('стоимост') || lowerMessage.includes('тариф')) {
    return 'У нас 3 тарифа:\n\n🆓 Starter: Бесплатно для малых команд\n💼 Business: $49/пользователь/месяц\n🚀 Enterprise: Индивидуальная цена\n\nВсе тарифы включают AI. Хотите демо?';
  }
  
  if (lowerMessage.includes('спам')) {
    return 'Odly блокирует 90% спама автоматически! 🛡️\n\nОстальные 10% помечаются как подозрительные. AI учится и становится умнее.';
  }
  
  if (lowerMessage.includes('отдел')) {
    return 'Odly работает для ВСЕХ отделов:\n\n✅ Поддержка\n✅ Продажи\n✅ HR\n✅ Бухгалтерия\n\nВсё на одной платформе с умной маршрутизацией!';
  }

  return 'Отличный вопрос! Я свяжу вас с нашей командой для детального ответа. А пока вы можете:\n\n• Посмотреть цены\n• Узнать про каналы\n• Изучить AI возможности\n\nЧто вас больше интересует?';
}
