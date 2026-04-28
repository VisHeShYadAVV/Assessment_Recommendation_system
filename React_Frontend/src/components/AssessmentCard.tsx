import { motion } from 'framer-motion';
import { Clock, Monitor, ExternalLink, Zap } from 'lucide-react';

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

// Accent color palette — each card gets a unique theme
const ACCENTS = [
  {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    light: '#f0edff',
    text: '#5b4fcf',
    border: 'rgba(102, 126, 234, 0.35)',
    glow: 'rgba(102, 126, 234, 0.18)',
    badgeBg: 'rgba(102, 126, 234, 0.1)',
    badgeText: '#5b4fcf',
    btnHover: '#667eea',
  },
  {
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    light: '#fff0f6',
    text: '#c62a6b',
    border: 'rgba(245, 87, 108, 0.35)',
    glow: 'rgba(245, 87, 108, 0.18)',
    badgeBg: 'rgba(245, 87, 108, 0.1)',
    badgeText: '#c62a6b',
    btnHover: '#f5576c',
  },
  {
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    light: '#e8f8ff',
    text: '#0373b7',
    border: 'rgba(79, 172, 254, 0.35)',
    glow: 'rgba(79, 172, 254, 0.18)',
    badgeBg: 'rgba(79, 172, 254, 0.1)',
    badgeText: '#0373b7',
    btnHover: '#4facfe',
  },
  {
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    light: '#eafff7',
    text: '#0d7a56',
    border: 'rgba(67, 233, 123, 0.35)',
    glow: 'rgba(67, 233, 123, 0.18)',
    badgeBg: 'rgba(67, 233, 123, 0.1)',
    badgeText: '#0d7a56',
    btnHover: '#43e97b',
  },
  {
    gradient: 'linear-gradient(135deg, #fa8231 0%, #f7b731 100%)',
    light: '#fff7e8',
    text: '#b35a00',
    border: 'rgba(250, 130, 49, 0.35)',
    glow: 'rgba(250, 130, 49, 0.18)',
    badgeBg: 'rgba(250, 130, 49, 0.1)',
    badgeText: '#b35a00',
    btnHover: '#fa8231',
  },
  {
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    light: '#faf0ff',
    text: '#7c3aed',
    border: 'rgba(161, 140, 209, 0.35)',
    glow: 'rgba(161, 140, 209, 0.18)',
    badgeBg: 'rgba(161, 140, 209, 0.12)',
    badgeText: '#7c3aed',
    btnHover: '#a18cd1',
  },
];

const getInitials = (name: string) => {
  if (!name) return 'A';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment, index }) => {
  const accent = ACCENTS[index % ACCENTS.length];
  const isHighMatch = assessment.score > 0.65;
  const matchPercentage = Math.round(assessment.score * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.07 * index, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      style={
        {
          '--accent-glow': accent.glow,
          '--accent-border': accent.border,
        } as React.CSSProperties
      }
      className="assessment-card group relative flex flex-col h-full cursor-pointer"
    >
      {/* Card Shell */}
      <div
        className="relative flex flex-col h-full rounded-[20px] overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #ffffff 0%, #f8faff 100%)',
          border: `1.5px solid ${accent.border}`,
          boxShadow: `0 4px 20px ${accent.glow}, 0 1px 4px rgba(0,0,0,0.04)`,
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        }}
      >
        {/* Decorative top-right blob */}
        <div
          className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-[0.12] pointer-events-none"
          style={{ background: accent.gradient }}
        />

        <div className="relative flex flex-col h-full p-6">

          {/* ── Header ── */}
          <div className="flex items-start justify-between mb-5">
            {/* Initials Avatar */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-md flex-shrink-0"
              style={{ background: accent.gradient, boxShadow: `0 4px 14px ${accent.glow}` }}
            >
              {getInitials(assessment.assessment_name)}
            </div>

            {/* Match Badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide"
              style={{
                background: isHighMatch ? accent.badgeBg : 'rgba(100,100,100,0.07)',
                color: isHighMatch ? accent.badgeText : '#6b7280',
              }}
            >
              {isHighMatch && <Zap size={11} className="flex-shrink-0" />}
              {matchPercentage}% Match
            </div>
          </div>

          {/* ── Title ── */}
          <h3
            className="text-[1.05rem] font-bold leading-snug mb-2 transition-colors duration-300"
            style={{ color: '#111827' }}
          >
            {assessment.assessment_name}
          </h3>

          {/* Accent underline */}
          <div
            className="h-[3px] w-10 rounded-full mb-4 transition-all duration-300 group-hover:w-16"
            style={{ background: accent.gradient }}
          />

          {/* ── Description ── */}
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-grow mb-5">
            {assessment.description ||
              'No description provided. Explore this assessment to discover the skills it evaluates.'}
          </p>

          {/* ── Meta Tags ── */}
          <div className="flex flex-wrap gap-2 mb-5">
            {assessment.duration && (
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: accent.badgeBg, color: accent.badgeText }}
              >
                <Clock size={11} />
                {assessment.duration}
              </span>
            )}
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{
                background:
                  assessment.remote_testing_support === 'Yes'
                    ? 'rgba(16,185,129,0.1)'
                    : 'rgba(107,114,128,0.08)',
                color:
                  assessment.remote_testing_support === 'Yes' ? '#047857' : '#6b7280',
              }}
            >
              <Monitor size={11} />
              {assessment.remote_testing_support === 'Yes' ? 'Remote Ready' : 'In-Person'}
            </span>
            {assessment.adaptive_irt_support === 'Yes' && (
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(245,158,11,0.1)', color: '#b45309' }}
              >
                <Zap size={11} />
                Adaptive
              </span>
            )}
          </div>

          {/* ── CTA Button ── */}
          <a
            href={assessment.url !== 'nan' ? assessment.url : '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (assessment.url === 'nan') {
                e.preventDefault();
                alert('No URL available for this assessment');
              }
            }}
            className="assessment-cta-btn group/btn mt-auto flex items-center justify-between w-full px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300"
            style={
              {
                '--btn-hover': accent.btnHover,
                background: accent.light,
                color: accent.text,
              } as React.CSSProperties
            }
          >
            <span>View Assessment</span>
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{ background: accent.badgeBg }}
            >
              <ExternalLink
                size={14}
                className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
              />
            </div>
          </a>

        </div>
      </div>
    </motion.div>
  );
};
