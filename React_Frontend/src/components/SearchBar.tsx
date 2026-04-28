import { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <motion.div
      animate={{ scale: isFocused ? 1.015 : 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="w-full"
      style={{
        borderRadius: '999px',
        boxShadow: isFocused
          ? '0 0 0 3px rgba(99,102,241,0.25), 0 20px 60px rgba(0,0,0,0.18)'
          : '0 8px 40px rgba(0,0,0,0.18)',
        transition: 'box-shadow 0.25s ease',
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-full bg-white/95 backdrop-blur-md"
        style={{
          borderRadius: '999px',
          border: isFocused ? '1.5px solid rgba(99,102,241,0.5)' : '1.5px solid rgba(255,255,255,0.15)',
          transition: 'border-color 0.25s ease',
          overflow: 'hidden',
        }}
      >
        {/* Search Icon */}
        <div className="pl-6 flex-shrink-0">
          <Search
            size={20}
            style={{
              color: isFocused ? '#6366f1' : '#9ca3af',
              transition: 'color 0.25s ease',
            }}
          />
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search by role, skill, or assessment name…"
          className="flex-1 bg-transparent border-none outline-none text-gray-900 text-base md:text-lg placeholder-gray-400 py-4 px-4"
          disabled={isLoading}
        />

        {/* Submit Button */}
        <div className="pr-2 py-2 flex-shrink-0">
          <motion.button
            type="submit"
            disabled={isLoading || !query.trim()}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-2 text-white font-semibold text-sm px-6 py-3 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
              transition: 'box-shadow 0.2s ease',
            }}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};
