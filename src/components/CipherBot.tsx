import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Bot, Send, Sparkles } from 'lucide-react';
import { saveToHistory } from '@/lib/history';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const responses: Record<string, string> = {
  'caesar': 'Caesar Cipher is perfect for beginners! It shifts each letter by a fixed number. Try it with shift value 3 for the classic Caesar cipher.',
  'vigenere': 'Vigenère Cipher is more secure than Caesar! It uses a keyword where each letter determines a different shift. Great for protecting sensitive text.',
  'aes': 'AES is military-grade encryption! It\'s the gold standard used by governments worldwide. Perfect for securing highly sensitive data.',
  'best': 'For maximum security, use AES encryption with a strong key. For learning, start with Caesar or Vigenère ciphers.',
  'secure': 'The most secure algorithm here is AES. It uses 256-bit encryption and is virtually unbreakable with current technology.',
  'hello': 'Hello! I\'m CipherBot, your cryptography assistant. Ask me about any encryption algorithm or how to secure your messages!',
  'help': 'I can help you understand different encryption methods, suggest the best algorithm for your needs, or explain how cryptography works. Just ask!',
  'default': 'Interesting question! Each encryption method has its strengths. Caesar is simple, Vigenère is classic, XOR is fast, and AES is ultra-secure. What would you like to know?',
};

const suggestions = [
  'What is Caesar Cipher?',
  'Which algorithm is best?',
  'How does AES work?',
  'Which cipher is most secure?',
];

export function CipherBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: '👋 Hi! I\'m CipherBot, your crypto assistant. Ask me anything about encryption!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    const userInput = input;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerInput = userInput.toLowerCase();
      let response = responses.default;

      for (const [key, value] of Object.entries(responses)) {
        if (lowerInput.includes(key)) {
          response = value;
          break;
        }
      }

      const botMessage: Message = { role: 'bot', content: response };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Save chat interaction to history
      saveToHistory({
        algorithm: 'base64', // Using base64 as placeholder for chat
        input: `Chat: ${userInput}`,
        output: `Bot: ${response}`,
        mode: 'encrypt'
      });
    }, 1000);
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="glass-strong rounded-2xl p-6 space-y-4 animate-fade-in h-full flex flex-col">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Bot className="w-6 h-6 text-accent animate-float" />
          <Sparkles className="w-3 h-3 text-accent absolute -top-1 -right-1 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-accent">CipherBot</h2>
      </div>

      <ScrollArea className="flex-1 pr-4 h-[400px]">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'glass border border-accent/30'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="glass border border-accent/30 rounded-lg p-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestion(suggestion)}
              className="text-xs border-accent/30 hover:bg-accent/10"
            >
              {suggestion}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="glass border-accent/30 focus:border-accent"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-accent hover:bg-accent/80"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
