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
    <div className="min-h-screen bg-gray-50 relative selection:bg-red-500/30 w-full font-sans">
      
      {/* Hero Section */}
      <div className="relative w-full min-h-[100vh] flex flex-col items-center justify-center pb-20 pt-24">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000")' }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Top Navbar */}
        <header className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="text-white text-3xl font-bold tracking-tight">AssessMe</div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/practice')}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/40 px-6 py-2 flex items-center gap-2 transition-colors font-medium backdrop-blur-sm shadow-sm"
            >
              <Bot size={18} />
              <span>Practice Interview</span>
            </button>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 w-full flex flex-col items-center mt-12">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-white leading-tight drop-shadow-md">
            Find your perfect assessment
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 drop-shadow">
            Discover and practice tech assessments tailored for your dream role globally.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full px-4 py-2 text-white/90 text-sm border border-white/10">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Verified Assessments
            </div>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full px-4 py-2 text-white/90 text-sm border border-white/10">
              <Bot className="w-4 h-4 text-purple-400" />
              24x7 AI Coach
            </div>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full px-4 py-2 text-white/90 text-sm border border-white/10">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Smart Matching
            </div>
          </div>

          {/* Search Bar Container */}
          <div className="w-full max-w-4xl mx-auto">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-white/80">
              <span>Popular Searches:</span>
              <button onClick={() => handleSearch('Software Engineer')} className="bg-black/30 hover:bg-black/50 border border-white/10 rounded-full px-4 py-1 transition-colors">Software Engineer &gt;</button>
              <button onClick={() => handleSearch('Data Analyst')} className="bg-black/30 hover:bg-black/50 border border-white/10 rounded-full px-4 py-1 transition-colors">Data Analyst &gt;</button>
              <button onClick={() => handleSearch('Machine Learning')} className="bg-black/30 hover:bg-black/50 border border-white/10 rounded-full px-4 py-1 transition-colors">Machine Learning &gt;</button>
            </div>
          </div>
        </div>
      </div>

      <main className="w-full max-w-6xl mx-auto px-8 py-12 flex flex-col items-center relative z-10">
        {/* Results Section */}
        <div className="w-full relative z-10 pt-8 mt-4">
          
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-4 mb-10 pb-6 border-b border-gray-100"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight text-center">
                Continue Where You Left From
              </h2>
              <span className="text-[#ff4a5a] font-bold bg-red-50/50 px-6 py-2 rounded-full border border-red-100 text-sm">
                Found {assessments.length} matches
              </span>
            </motion.div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 h-72 animate-pulse flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="h-12 bg-gray-200 rounded-xl w-full mt-4"></div>
                </div>
              ))}
            </div>
          ) : (
            hasSearched && (
              <AnimatePresence mode="wait">
                {assessments.length > 0 ? (
                  <motion.div 
                     layout
                     className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
                  >
                    {assessments.map((item, i) => (
                      <div key={`${item.assessment_name}-${i}`} className="w-full">
                        <AssessmentCard assessment={item} index={i} />
                      </div>
                    ))}
                  </motion.div>
                ) : !error ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-24 px-4 bg-white rounded-2xl shadow-sm border border-gray-100"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-2">No recommendations found</p>
                    <p className="text-gray-500">Try adjusting your search terms or using different keywords to find your perfect assessment.</p>
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
