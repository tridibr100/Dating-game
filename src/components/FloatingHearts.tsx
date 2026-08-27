import React, { useMemo } from 'react';

interface FloatingHeartsProps {
  density?: 'low' | 'high';
  theme?: 'light' | 'dark';
}

export const FloatingHearts: React.FC<FloatingHeartsProps> = ({
  density = 'low',
  theme = 'light',
}) => {
  const count = density === 'high' ? 18 : 8;

  const hearts = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(i * 100) / count + (Math.sin(i) * 5 + 5)}%`,
      size: 10 + ((i * 7) % 16),
      delay: (i * 0.8) % 6,
      duration: 7 + (i % 5) * 2,
      opacity: theme === 'dark' ? 0.15 + (i % 3) * 0.08 : 0.08 + (i % 3) * 0.05,
    }));
  }, [count, theme]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute text-[#e40d5d]"
          style={{
            left: h.left,
            bottom: '-20px',
            fontSize: `${h.size}px`,
            opacity: h.opacity,
            animation: `floatUpwards ${h.duration}s ease-in-out infinite`,
            animationDelay: `${h.delay}s`,
          }}
        >
          ❤
        </div>
      ))}
      <style>{`
        @keyframes floatUpwards {
          0% {
            transform: translateY(0) translateX(0) scale(0.8);
            opacity: 0;
          }
          20% {
            opacity: 0.7;
          }
          80% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-110vh) translateX(${Math.random() > 0.5 ? '25px' : '-25px'}) scale(1.15);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
