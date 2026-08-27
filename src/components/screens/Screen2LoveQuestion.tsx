import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gavel, Check, ArrowRight, Heart } from 'lucide-react';
import {
  playSoftClick,
  playSparkleChime,
  playGavelStrike,
} from '../../utils/audio';

interface Screen2LoveQuestionProps {
  onContinue: () => void;
  savedChoice: 'obviously' | 'maybe' | 'refuse' | null;
  onSelectChoice: (choice: 'obviously' | 'maybe' | 'refuse') => void;
}

export const Screen2LoveQuestion: React.FC<Screen2LoveQuestionProps> = ({
  onContinue,
  savedChoice,
  onSelectChoice,
}) => {
  const [selectedOption, setSelectedOption] = useState<
    'obviously' | 'maybe' | 'refuse' | null
  >(savedChoice);
  const [showVerdict, setShowVerdict] = useState(!!savedChoice);

  const options = [
    { id: 'obviously', label: 'Obviously ❤️', emoji: '❤️' },
    { id: 'maybe', label: 'Maybe… 🙄', emoji: '🙄' },
    { id: 'refuse', label: 'I refuse to answer 🤐', emoji: '🤐' },
  ] as const;

  const handleSelect = (id: 'obviously' | 'maybe' | 'refuse') => {
    setSelectedOption(id);
    onSelectChoice(id);
    if (id === 'obviously') {
      playSparkleChime();
    } else {
      playGavelStrike();
    }
    setTimeout(() => {
      setShowVerdict(true);
    }, 350);
  };

  return (
    <div className="w-full flex flex-col items-center text-center px-5 py-2 select-none">
      {/* Heading */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1"
      >
        Choose carefully.
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-serif text-3xl sm:text-4xl font-bold text-[#800020] tracking-tight mb-2"
      >
        Do you love me?
      </motion.h1>

      {/* Decorative heart divider */}
      <div className="flex items-center justify-center gap-2 w-32 my-3 opacity-60">
        <div className="h-px bg-gradient-to-r from-transparent to-[#800020] flex-1"></div>
        <Heart className="w-3 h-3 text-[#800020] fill-current" />
        <div className="h-px bg-gradient-to-l from-transparent to-[#800020] flex-1"></div>
      </div>

      {/* Choice Cards */}
      <div className="w-full max-w-sm flex flex-col gap-3 my-2">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          return (
            <motion.button
              key={opt.id}
              id={`screen2-option-${opt.id}`}
              onClick={() => handleSelect(opt.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`tactile-btn w-full p-4 rounded-3xl flex items-center justify-between text-left transition-all border ${
                isSelected
                  ? 'bg-white border-2 border-[#800020] shadow-md shadow-[#800020]/10 scale-[1.02]'
                  : 'bg-white border border-gray-200/80 hover:border-[#800020]/40 shadow-xs'
              }`}
            >
              <span className="font-bold text-base text-[#1c1c17]">
                {opt.label}
              </span>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-[#800020] text-white'
                    : 'border border-gray-200 text-transparent'
                }`}
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Verdict / Outcome Revelation */}
      {showVerdict && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm mt-3 bg-white border-2 border-[#800020] rounded-3xl p-5 shadow-xl shadow-[#800020]/10 text-center space-y-3"
        >
          {/* Gavel Icon */}
          <div className="w-12 h-12 rounded-full bg-[#FFD1DC] text-[#800020] mx-auto flex items-center justify-center shadow-inner">
            <Gavel className="w-6 h-6 transform -rotate-12" />
          </div>

          <div>
            <h3 className="font-serif text-2xl font-bold text-[#800020] tracking-tight">
              RULING: YES.
            </h3>
            <p className="font-serif italic text-xs text-[#800020]/80 mt-0.5">
              The Court of Love has reached a final verdict.
            </p>
          </div>

          <p className="text-xs text-gray-600 font-medium leading-relaxed px-1">
            {selectedOption === 'obviously'
              ? 'Correct response entered into permanent record. The jury is thoroughly pleased.'
              : "The jury (me) has officially determined that your answer is legally defined as 'Yes' in this jurisdiction."}
          </p>

          <button
            id="screen2-continue-btn"
            onClick={() => {
              playSoftClick();
              onContinue();
            }}
            className="tactile-btn w-full bg-[#800020] text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-lg shadow-[#800020]/20 hover:bg-[#570013] flex items-center justify-center gap-2"
          >
            <span>Continue to Sentencing</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
