// Removed empty react import
import { motion } from 'framer-motion';
import { Clock, Monitor, ExternalLink } from 'lucide-react';

export interface Assessment {
  assessment_name: string;
  url: string;
  description: string;
  duration: string;
  remote_testing_support: string;
  adaptive_irt_support: string;
  score: number;
}

interface AssessmentCardProps {
  assessment: Assessment;
  index: number;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment, index }) => {
  const isHighMatch = assessment.score > 0.65;
  const matchPercentage = Math.round(assessment.score * 100);

  const gradients = [
    'from-pink-500 to-rose-500',
    'from-purple-500 to-indigo-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-amber-500'
  ];
  const bgGradient = gradients[index % gradients.length];

  // Helper to extract initials from the assessment name (e.g. "Java Coding Test" -> "JC")
  const getInitials = (name: string) => {
    if (!name) return "A";
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-[2rem] p-6 flex flex-col h-full transition-all duration-500 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] overflow-hidden"
    >
      {/* Accent Background Pattern */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${bgGradient} opacity-[0.03] rounded-bl-[5rem] -mr-8 -mt-8 transition-transform duration-700 group-hover:scale-150`}></div>

      {/* Header: Icon & Match Badge */}
      <div className="flex justify-between items-start mb-6">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${bgGradient} p-[1px] shadow-lg shadow-gray-200/50`}>
          <div className="w-full h-full bg-white rounded-[0.9rem] flex items-center justify-center">
            <span className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br ${bgGradient}`}>
              {getInitials(assessment.assessment_name)}
            </span>
          </div>
        </div>
        
        <div className={`px-4 py-2 rounded-2xl text-[0.7rem] font-bold uppercase tracking-wider shadow-sm border ${
          isHighMatch 
            ? 'bg-green-50 text-green-600 border-green-100/50' 
            : 'bg-indigo-50 text-indigo-600 border-indigo-100/50'
        }`}>
          {matchPercentage}% Match
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-[#ff4a5a] transition-colors duration-300">
          {assessment.assessment_name}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
          {assessment.description || "No description provided for this assessment. Explore the details to learn more about the skills covered."}
        </p>
      </div>

      {/* Meta Specs */}
      <div className="flex items-center gap-4 mb-8 py-4 border-t border-gray-50">
        <div className="flex items-center gap-2 text-gray-400">
          <Clock size={16} className="text-gray-300" />
          <span className="text-xs font-semibold text-gray-600 tracking-tight">{assessment.duration || "N/A"}</span>
        </div>
        <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
        <div className="flex items-center gap-2 text-gray-400">
          <Monitor size={16} className="text-gray-300" />
          <span className="text-xs font-semibold text-gray-600 tracking-tight">
            {assessment.remote_testing_support === 'Yes' ? 'Remote Ready' : 'In-Person'}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <a
        href={assessment.url !== "nan" ? assessment.url : "#"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (assessment.url === "nan") {
            e.preventDefault();
            alert("No URL available for this assessment");
          }
        }}
        className={`group/btn w-full flex items-center justify-between bg-gray-50 hover:bg-gray-900 text-gray-900 hover:text-white p-4 rounded-2xl transition-all duration-300 font-bold text-sm shadow-sm`}
      >
        <span>View Details</span>
        <div className="w-8 h-8 rounded-xl bg-white/0 group-hover/btn:bg-white/10 flex items-center justify-center transition-colors">
          <ExternalLink size={16} className="transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
        </div>
      </a>
    </motion.div>
  );
};
