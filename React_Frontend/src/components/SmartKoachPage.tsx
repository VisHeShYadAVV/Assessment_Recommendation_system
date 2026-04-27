import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, RotateCcw, Bot, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export const SmartKoachPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: "Hello! I'm SmartKoach, your AI Interview Coach. I'm ready when you are. Please type 'Start' to begin." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [domain, setDomain] = useState('');
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [difficulty, setDifficulty] = useState('Medium');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: userText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (step === 0) {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: "Great! Which subject would you like to practice? (e.g., DSA, ML, DBMS, OS, English, Botany, Math)" }]);
        setStep(1);
        setIsLoading(false);
      }, 500);
      return;
    }

    if (step === 1) {
      setDomain(userText);
      setStep(2);
      
      const initialMessage = `I want to practice ${userText}. Please ask me the first question.`;
      
      try {
        const response = await fetch('http://127.0.0.1:8000/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: initialMessage, domain: userText, difficulty }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: data.reply }]);
      } catch (error) {
        console.error('Error in chat:', error);
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: "Sorry, I'm having trouble connecting to the server. Please ensure the backend is running and OPENAI_API_KEY is configured." }]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
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
      setMessages([{ id: Date.now().toString(), sender: 'ai', text: "Conversation reset! Please type 'Start' to begin a new interview." }]);
      setStep(0);
      setDomain('');
    } catch (error) {
      console.error('Error resetting chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative selection:bg-pink-500/30 overflow-hidden bg-gray-50/50">
      {/* Colorful background elements */}
      <div className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-pink-400/20 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-cyan-400/20 blur-[100px] pointer-events-none" />
      <div className="fixed top-[40%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-violet-400/10 blur-[80px] pointer-events-none" />
      
      <main className="container mx-auto px-4 py-8 flex flex-col items-center h-screen relative z-10 max-h-screen">
        
        {/* Header Section */}
        <div className="w-full max-w-4xl flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Recommendations</span>
          </button>
          
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm cursor-default">
            <Bot className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-violet-600">AI Interview Coach</span>
          </div>
        </div>

        {/* Chat Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl flex-1 bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col overflow-hidden"
        >
          {/* Settings Bar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white/50">
            <div className="flex gap-4">
              <div className="flex flex-col">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Difficulty</label>
                <select 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-800 outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 appearance-none min-w-[120px] shadow-sm cursor-pointer"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all shadow-sm"
            >
              <RotateCcw size={16} />
              Reset Session
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent" ref={scrollRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.sender === 'ai' 
                    ? 'bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600 border border-pink-200' 
                    : 'bg-gradient-to-br from-cyan-100 to-blue-100 text-cyan-700 border border-cyan-200'
                }`}>
                  {msg.sender === 'ai' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className={`max-w-[80%] px-5 py-4 text-base whitespace-pre-wrap leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl rounded-tr-sm'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm shadow-md'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600 border border-pink-200 flex items-center justify-center shadow-sm">
                  <Bot size={20} />
                </div>
                <div className="bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm px-6 py-5 flex items-center gap-2 shadow-md">
                  <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-100 bg-white/50 backdrop-blur-md">
            <div className="relative flex items-center max-w-4xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your answer or ask for a question..."
                className="w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-pink-400 focus:ring-1 focus:ring-pink-400 rounded-2xl py-4 pl-6 pr-16 text-base text-gray-900 placeholder-gray-400 outline-none transition-all shadow-sm"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-3 p-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 text-white rounded-xl transition-all shadow-md"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-center text-[11px] text-gray-400 mt-4 font-medium">
              SmartKoach can make mistakes. Consider verifying important technical details.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
