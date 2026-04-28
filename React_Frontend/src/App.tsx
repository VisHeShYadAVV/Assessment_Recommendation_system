import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { SearchBar } from './components/SearchBar';
import type { Assessment } from './components/AssessmentCard';
import { AssessmentCard } from './components/AssessmentCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bot, Sparkles } from 'lucide-react';
import { SmartKoachPage } from './components/SmartKoachPage';

function Home() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setError(null);

    try {
      const url = `http://127.0.0.1:8000/recommend?query=${encodeURIComponent(query)}&k=6`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const maxScore = Math.max(...data.map((item: any) => item.score), 0.1);
      const normalizedData = data.map((item: any, index: number) => {
        let finalScore: number;
        if (item.score > 0) {
          finalScore = (item.score / maxScore) * 0.85 + 0.12;
        } else {
          finalScore = Math.max(0.05, 0.15 - (index * 0.02));
        }
        return { ...item, score: finalScore };
      });

      setAssessments(normalizedData);
    } catch (err: any) {
      console.error("Failed to fetch recommendations:", err);
      setError(err.message || "Failed to fetch recommendations. Please ensuring the backend is running.");
      setAssessments([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative selection:bg-indigo-500/30 w-full font-sans">

      {/* ══ HERO SECTION ══ */}
      <section className="relative w-full min-h-[96vh] flex flex-col overflow-hidden">

        {/* ── Background ── */}
        <div className="absolute inset-0 z-0">
          {/* Photo */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000")' }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: 'rgba(8,8,20,0.72)' }} />
          {/* Subtle colour vignette — top purple tint for depth */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 70%)' }} />
          {/* Bottom fade into dark body */}
          <div
            className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(8,8,20,0.9) 75%, #0a0a18 100%)' }}
          />
        </div>

        {/* ── Navbar ── */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative z-50 flex justify-between items-center w-full px-6 md:px-10 pt-7"
          style={{ maxWidth: '1200px', margin: '0 auto', alignSelf: 'center', width: '100%' }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-white text-xl font-bold tracking-tight">AssessMe</span>
          </div>

          {/* Nav actions */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate('/practice')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.14)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <Bot size={16} />
              <span>Practice Interview</span>
            </motion.button>
          </div>
        </motion.header>

        {/* ── Hero Body ── */}
        <div
          className="relative z-10 flex flex-col items-center justify-center flex-1 text-center px-5"
          style={{ paddingTop: '80px', paddingBottom: '140px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}
        >
          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 mb-7"
          >
            <span
              className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full"
              style={{
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.3)',
                color: '#a5b4fc',
                letterSpacing: '0.1em',
              }}
            >
              <Sparkles size={12} />
              AI-Powered Assessment Discovery
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' }}
            className="font-extrabold leading-tight mb-5"
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 3.6rem)',
              color: '#f1f5f9',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 24px rgba(0,0,0,0.5)',
            }}
          >
            Find Your{' '}
            <span
              style={{
                backgroundImage: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Perfect Assessment
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32, ease: 'easeOut' }}
            className="mb-10 leading-relaxed"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: 'rgba(203,213,225,0.9)',
              maxWidth: '600px',
              textShadow: '0 1px 8px rgba(0,0,0,0.3)',
            }}
          >
            Discover and practice tech assessments intelligently matched to your dream role — powered by AI.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.44, ease: 'easeOut' }}
            className="w-full"
            style={{ maxWidth: '680px' }}
          >
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </motion.div>

          {/* Popular searches */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.56, ease: 'easeOut' }}
            className="mt-5 flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-xs font-medium" style={{ color: 'rgba(148,163,184,0.8)' }}>Try:</span>
            {['Software Engineer', 'Data Analyst', 'Machine Learning'].map((term) => (
              <motion.button
                key={term}
                onClick={() => handleSearch(term)}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.12)' }}
                whileTap={{ scale: 0.96 }}
                className="text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(203,213,225,0.9)',
                }}
              >
                {term}
              </motion.button>
            ))}
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.68, ease: 'easeOut' }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            {[
              { icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, label: 'Verified Assessments', color: '#4ade80' },
              { icon: <Bot size={14} />, label: '24×7 AI Coach', color: '#c084fc' },
              { icon: <Sparkles size={13} />, label: 'Smart Matching', color: '#fbbf24' },
            ].map(({ icon, label, color }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full cursor-default transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(226,232,240,0.85)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span style={{ color }}>{icon}</span>
                {label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Results Section ── overlaps hero with rounded top + shadow */}
      <main
        className="w-full relative z-20"
        style={{
          marginTop: '-80px',
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
          background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.25)',
        }}
      >
        <div className="w-full">
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 mb-8 text-center bg-red-50 border border-red-200 rounded-2xl text-red-700 shadow-sm"
            >
              <p>{error}</p>
            </motion.div>
          )}

          {!isLoading && hasSearched && assessments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="results-header"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight text-center">
                Recommended Assessments
              </h2>
              <p className="text-gray-500 text-center text-base mt-2">Tailored matches based on your search</p>
              <div className="flex justify-center mt-4">
                <span className="inline-flex items-center gap-2 text-indigo-600 font-bold bg-indigo-50 px-5 py-2 rounded-full border border-indigo-100 text-sm">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  {assessments.length} matches found
                </span>
              </div>
            </motion.div>
          )}

          {isLoading ? (
            <div className="assessments-container">
              <div className="assessments-grid">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 h-72 animate-pulse flex flex-col justify-between shadow-sm">
                      <div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                      <div className="h-12 bg-gray-200 rounded-xl w-full mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            hasSearched && (
              <AnimatePresence mode="wait">
                {assessments.length > 0 ? (
                  <motion.div 
                     layout
                     className="assessments-container"
                  >
                    <div className="assessments-grid">
                      {assessments.map((item, i) => (
                        <div key={`${item.assessment_name}-${i}`}>
                          <AssessmentCard assessment={item} index={i} />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : !error ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-24 px-4 bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-white"
                    style={{ maxWidth: '480px', margin: '40px auto' }}
                  >
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-indigo-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-2">No matches found</p>
                    <p className="text-gray-500 text-sm">Try adjusting your search terms or using different keywords to find your perfect assessment.</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            )
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/practice" element={<SmartKoachPage />} />
    </Routes>
  );
}

export default App;
