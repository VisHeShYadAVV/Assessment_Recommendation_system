import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, RotateCcw, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export const SmartKoachChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: "Hello! I'm SmartKoach, your AI Interview Coach. Which domain would you like to practice today? (e.g., DSA, ML, DBMS, OS)" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [domain, setDomain] = useState('DSA');
  const [difficulty, setDifficulty] = useState('Medium');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          domain: domain,
          difficulty: difficulty
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      const aiMessage: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: "Sorry, I'm having trouble connecting to the server. Please ensure the backend is running and OPENAI_API_KEY is configured." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      await fetch('http://127.0.0.1:8000/reset', { method: 'POST' });
      setMessages([{ id: Date.now().toString(), sender: 'ai', text: "Conversation reset. Let's start fresh! Which domain would you like to practice?" }]);
    } catch (error) {
      console.error('Error resetting chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 h-[32rem] bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100">SmartKoach</h3>
                  <p className="text-xs text-purple-400 font-medium">AI Interview Coach</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleReset}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  title="Reset Chat"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Settings Bar */}
            <div className="flex gap-2 p-3 border-b border-white/5 bg-black/20">
              <select 
                value={domain} 
                onChange={(e) => setDomain(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs font-medium text-zinc-300 w-1/2 outline-none focus:border-purple-500/50 appearance-none"
              >
                <option value="DSA" className="bg-zinc-800">DSA</option>
                <option value="ML" className="bg-zinc-800">Machine Learning</option>
                <option value="DBMS" className="bg-zinc-800">DBMS</option>
                <option value="OS" className="bg-zinc-800">Operating Systems</option>
              </select>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs font-medium text-zinc-300 w-1/2 outline-none focus:border-purple-500/50 appearance-none"
              >
                <option value="Easy" className="bg-zinc-800">Easy</option>
                <option value="Medium" className="bg-zinc-800">Medium</option>
                <option value="Hard" className="bg-zinc-800">Hard</option>
              </select>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === 'ai' 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {msg.sender === 'ai' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className={`max-w-[75%] px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600/20 text-blue-50 border border-blue-500/20 rounded-2xl rounded-tr-sm'
                      : 'bg-white/5 text-zinc-200 border border-white/10 rounded-2xl rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white/5 text-zinc-200 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-4 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your answer..."
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-3 pl-4 pr-12 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-purple-600 hover:bg-purple-500 disabled:bg-white/10 disabled:text-zinc-500 text-white rounded-lg transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-full shadow-lg shadow-purple-500/25 flex items-center justify-center z-50 border border-white/10 ${isOpen ? 'w-14' : 'px-6 gap-3'}`}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
            <Bot size={24} />
            <span className="font-semibold whitespace-nowrap">Practice Interview</span>
          </>
        )}
      </motion.button>
    </>
  );
};
