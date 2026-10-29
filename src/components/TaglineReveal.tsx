import React, { useRef, useEffect, useState } from 'react';

interface TaglineRevealProps {
  phrase?: string;
  highlightWords?: string[];
  subtitle?: string;
  className?: string;
}

export const TaglineReveal: React.FC<TaglineRevealProps> = ({
  phrase = "High-ticket dental treatments shouldn't stop at the front desk. Clinaza turns ₹1,00,000 implants into ₹2,400 monthly EMIs in two minutes flat.",
  highlightWords = ['Clinaza', '₹2,400', 'monthly', 'EMIs', 'two', 'minutes'],
  subtitle = 'Point-of-care patient financing across 21+ banks and cardless lenders.',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start reveal when container enters lower 85% of viewport
      // Complete reveal when container reaches upper 35% of viewport
      const start = windowHeight * 0.85;
      const end = windowHeight * 0.35;

      const current = rect.top;
      if (current > start) {
        setProgress(0);
      } else if (current < end) {
        setProgress(1);
      } else {
        const ratio = (start - current) / (start - end);
        setProgress(Math.min(1, Math.max(0, ratio)));
      }
    };

    const throttledScroll = () => {
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const words = phrase.split(' ');
  const totalWords = words.length;

  return (
    <section
      ref={containerRef}
      aria-label="Clinaza Value Proposition"
      className={`py-16 sm:py-24 px-4 sm:px-6 max-w-4xl mx-auto text-center ${className}`}
    >
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 mb-6 sm:mb-8">
        <span className="w-2 h-2 rounded-full bg-[#0867E8]" />
        <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
          The Clinaza Standard
        </span>
      </div>

      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.18] [text-wrap:balance]">
        {words.map((word, index) => {
          const wordThreshold = index / totalWords;
          const isRevealed = progress >= wordThreshold;
          const isHighlighted = highlightWords.some(hw =>
            word.toLowerCase().replace(/[^a-z0-9₹,]/g, '') === hw.toLowerCase().replace(/[^a-z0-9₹,]/g, '')
          );

          return (
            <span
              key={index}
              className={`inline-block mr-[0.28em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isRevealed
                  ? isHighlighted
                    ? 'text-[#0867E8] opacity-100 scale-100'
                    : 'text-[#0B2450] opacity-100'
                  : 'text-slate-300 opacity-30 scale-[0.98]'
              }`}
            >
              {word}
            </span>
          );
        })}
      </h2>

      {subtitle && (
        <p className="mt-6 sm:mt-8 text-sm sm:text-base text-slate-500 font-medium max-w-xl mx-auto [text-wrap:pretty]">
          {subtitle}
        </p>
      )}
    </section>
  );
};
