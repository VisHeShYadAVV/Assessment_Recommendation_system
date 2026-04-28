import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RotateCcw, Bot, User, ArrowLeft, Zap, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Easy:   { bg: 'rgba(16,185,129,0.1)',  text: '#059669', dot: '#10b981' },
  Medium: { bg: 'rgba(245,158,11,0.1)',  text: '#d97706', dot: '#f59e0b' },
  Hard:   { bg: 'rgba(239,68,68,0.1)',   text: '#dc2626', dot: '#ef4444' },
};

export const SmartKoachPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: "Hello! I'm SmartKoach, your AI Interview Coach. I'm ready when you are. Please type 'Start' to begin." }
  ]);
  const [input, setInput]           = useState('');
  const [isLoading, setIsLoading]   = useState(false);
  const [domain, setDomain]         = useState('');
  const [step, setStep]             = useState<0 | 1 | 2>(0);
  const [difficulty, setDifficulty] = useState('Medium');
  const [inputFocused, setInputFocused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

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
        setMessages(prev => [...prev, {
          id: Date.now().toString(), sender: 'ai',
          text: "Great! Which subject would you like to practice?\n\nFor example: DSA, Machine Learning, DBMS, Operating Systems, System Design, English, Math…"
        }]);
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
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: data.reply }]);
      } catch {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: "Sorry, I'm having trouble connecting. Please ensure the backend is running." }]);
      } finally { setIsLoading(false); }
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, domain, difficulty }),
      });
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: "Sorry, I'm having trouble connecting. Please ensure the backend is running." }]);
    } finally { setIsLoading(false); }
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      await fetch('http://127.0.0.1:8000/reset', { method: 'POST' });
      setMessages([{ id: Date.now().toString(), sender: 'ai', text: "Session reset! Type 'Start' to begin a new interview." }]);
      setStep(0);
      setDomain('');
    } catch { /* silent */ } finally { setIsLoading(false); }
  };

  const diffStyle = DIFFICULTY_COLORS[difficulty] ?? DIFFICULTY_COLORS.Medium;

  return (
    <div
      className="min-h-screen w-full flex flex-col relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4c1d95 55%, #7c3aed 80%, #be185d 100%)' }}
    >
      {/* Decorative mesh orbs */}
      <div className="fixed top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="fixed bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)', filter: 'blur(70px)' }} />
      <div className="fixed top-[40%] right-[10%] w-[30vw] h-[30vw] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      {/* ── Top bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full px-6 py-4 flex items-center justify-between relative z-10"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,10,60,0.55)', backdropFilter: 'blur(16px)' }}
      >
        {/* Left: back */}
        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft size={17} />
          Back
        </motion.button>

        {/* Centre: title */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-white">SmartKoach</span>
            <span className="text-xs text-indigo-300 ml-2 font-medium">AI Interview Coach</span>
          </div>
        </div>

        {/* Right: difficulty + reset */}
        <div className="flex items-center gap-3">
          {/* Difficulty pill selector */}
          <div className="relative">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="appearance-none text-xs font-semibold pl-6 pr-7 py-1.5 rounded-full outline-none cursor-pointer transition-all"
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            {/* Coloured dot + chevron overlays */}
            <span
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
              style={{ background: diffStyle.dot }}
            />
            <ChevronDown
              size={11}
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: diffStyle.text }}
            />
          </div>

          {/* Reset */}
          <motion.button
            onClick={handleReset}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full text-gray-600 hover:text-gray-900 transition-colors"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}
          >
            <RotateCcw size={13} />
            Reset
          </motion.button>
        </div>
      </motion.div>

      {/* ── Chat column ── */}
      <div className="flex-1 flex flex-col items-center px-4 py-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="w-full flex flex-col overflow-hidden relative z-10"
          style={{
            maxWidth: '860px',
            height: 'calc(100vh - 130px)',
            background: 'rgba(255,255,255,0.07)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(20px)',
          }}
        >

          {/* Status strip — shows domain + step */}
          {domain && (
            <div
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-medium"
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.35))',
                color: '#e0e7ff',
              }}
            >
              <Zap size={12} />
              Practising <strong className="mx-1">{domain}</strong> · Difficulty: <strong className="ml-1">{difficulty}</strong>
            </div>
          )}

          {/* Messages scroll area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-6 py-6"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}
          >
            <div className="flex flex-col gap-5">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`flex items-end gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={
                        msg.sender === 'ai'
                          ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }
                          : { background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', boxShadow: '0 2px 8px rgba(14,165,233,0.3)' }
                      }
                    >
                      {msg.sender === 'ai'
                        ? <Bot size={15} className="text-white" />
                        : <User size={15} className="text-white" />
                      }
                    </div>

                    {/* Bubble */}
                    <div
                      className="px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap"
                      style={{
                        maxWidth: '72%',
                        borderRadius: msg.sender === 'ai' ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                        ...(msg.sender === 'ai'
                          ? {
                              background: 'rgba(255,255,255,0.12)',
                              color: '#f1f5f9',
                              border: '1px solid rgba(255,255,255,0.12)',
                              backdropFilter: 'blur(8px)',
                            }
                          : {
                              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                              color: '#ffffff',
                              boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
                            }),
                      }}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                  >
                    <Bot size={15} className="text-white" />
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-4 py-3.5 rounded-[18px] rounded-bl-[4px]"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
                  >
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ background: '#c4b5fd', animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* ── Input area ── */}
          <div
            className="px-5 py-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              animate={{
                boxShadow: inputFocused
                  ? '0 0 0 3px rgba(99,102,241,0.2), 0 2px 12px rgba(0,0,0,0.06)'
                  : '0 1px 4px rgba(0,0,0,0.06)',
              }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 rounded-2xl px-4 py-2"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: inputFocused ? '1.5px solid rgba(167,139,250,0.7)' : '1.5px solid rgba(255,255,255,0.12)',
                transition: 'border-color 0.2s ease',
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="Type your answer…"
                disabled={isLoading}
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/40 py-2"
              />
              <motion.button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all"
                style={{
                  background: input.trim() && !isLoading
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    : 'rgba(0,0,0,0.08)',
                  boxShadow: input.trim() && !isLoading ? '0 2px 10px rgba(99,102,241,0.35)' : 'none',
                  transition: 'background 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <Send size={15} style={{ color: input.trim() && !isLoading ? '#fff' : '#9ca3af' }} />
              </motion.button>
            </motion.div>

            <p className="text-center text-[11px] text-white/30 mt-2.5 font-medium">
              SmartKoach may make mistakes — verify important technical details independently.
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
};
