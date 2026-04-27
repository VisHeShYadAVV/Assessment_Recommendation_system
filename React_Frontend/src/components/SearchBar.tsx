import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto shadow-2xl rounded-full bg-white flex items-center px-4 py-2 border border-gray-100/50 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="w-full flex items-center">
        <div className="pl-3 text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by role, skill, or assessment name"
          className="flex-1 bg-transparent border-none outline-none text-gray-900 text-lg placeholder-gray-400 py-3 pl-4"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="ml-2 bg-[#ff4a5a] hover:bg-[#ff3043] text-white w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 active:scale-95"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Search className="w-6 h-6" />
          )}
        </button>
      </form>
    </div>
  );
};
