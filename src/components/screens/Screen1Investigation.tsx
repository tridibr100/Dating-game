import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, CheckCircle2, XCircle, ArrowRight, FolderOpen, Heart } from 'lucide-react';
import {
  playSoftClick,
  playSparkleChime,
  playPlayfulReject,
} from '../../utils/audio';

interface Screen1InvestigationProps {
  onContinue: () => void;
  savedChoice: 'accept' | 'disagree' | null;
  onSelectChoice: (choice: 'accept' | 'disagree') => void;
}

export const Screen1Investigation: React.FC<Screen1InvestigationProps> = ({
  onContinue,
  savedChoice,
  onSelectChoice,
}) => {
  const [revealedIndex, setRevealedIndex] = useState(0);
  const [outcome, setOutcome] = useState<'accept' | 'disagree' | null>(savedChoice);
  const [isShaking, setIsShaking] = useState(false);

  const investigationLines = [
    'I have conducted extensive research.',
    'I have considered the evidence.',
    'I have consulted absolutely nobody.',
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setRevealedIndex(1), 600);
    const timer2 = setTimeout(() => setRevealedIndex(2), 1400);
    const timer3 = setTimeout(() => setRevealedIndex(3), 2200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleChoice = (choice: 'accept' | 'disagree') => {
    if (choice === 'disagree') {
      playPlayfulReject();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } else {
      playSparkleChime();
    }
    setOutcome(choice);
    onSelectChoice(choice);
  };

  return (
    <div className="w-full flex flex-col items-center text-center px-5 py-2 select-none">
      {/* Case Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#800020]/15 text-[#800020] shadow-xs text-[11px] font-bold tracking-widest uppercase mb-3"
      >
        <FolderOpen className="w-3.5 h-3.5 text-[#800020]" />
        <span>CASE #FRIDAY</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-serif text-3xl sm:text-4xl font-bold text-[#800020] tracking-tight mb-4"
      >
        We need to talk.
      </motion.h1>

      {/* Cute Detective / Investigation Visual */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mb-5 flex items-center justify-center"
      >
        <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-[#FFD1DC] via-[#FCFAFA] to-white border-4 border-white shadow-xl shadow-[#800020]/10 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Magnifying Glass badge */}
          <div className="absolute top-2 right-2 p-1.5 rounded-full bg-[#FFD1DC] text-[#800020] shadow-xs">
            <Search className="w-3.5 h-3.5" />
          </div>

          {/* Heart Detective Icon */}
          <div className="relative flex flex-col items-center">
            {/* Fedora Hat styling */}
            <div className="w-12 h-2.5 bg-[#411b24] rounded-full mb-[-2px] z-10"></div>
            <div className="w-8 h-4 bg-[#411b24] rounded-t-lg mb-[-4px] z-10"></div>

            {/* Heart Face */}
            <div className="relative">
              <Heart className="w-16 h-16 text-[#800020] fill-[#800020] animate-heart-beat drop-shadow-md" />
              {/* Cute detective eyes */}
              <div className="absolute top-6 left-3 w-2 h-2 rounded-full bg-[#FCFAFA]"></div>
              <div className="absolute top-6 right-3 w-2 h-2 rounded-full bg-[#FCFAFA]"></div>
              <div className="absolute top-8 left-6 w-3 h-1.5 rounded-full border-b-2 border-[#FCFAFA]"></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* The Evidence Text Stack */}
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-5 space-y-2.5">
        <div className="space-y-1.5 text-sm text-gray-600 font-medium leading-relaxed text-left">
          {investigationLines.map((line, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: revealedIndex > idx ? 1 : 0,
                x: revealedIndex > idx ? 0 : -10,
              }}
              transition={{ duration: 0.4 }}
              className="text-gray-600"
            >
              • {line}
            </motion.p>
          ))}
        </div>

        <AnimatePresence>
          {revealedIndex >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="pt-2 border-t border-gray-100"
            >
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                And I have reached a very serious conclusion:
              </p>
              <div className="py-2.5 px-3 rounded-2xl bg-[#FFD1DC]/30 border border-[#FFD1DC]">
                <span className="font-serif text-2xl font-bold text-[#800020] tracking-wide block">
                  You’re extremely cute.
                </span>
              </div>
              <p className="text-xs text-gray-400 italic mt-2">
                Unfortunately, you don’t get to disagree with this assessment.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Outcome Resolution Card OR Action Buttons */}
      <div className="w-full max-w-sm">
        {!outcome ? (
          <div
            className={`flex flex-col gap-2.5 transition-all ${
              isShaking ? 'animate-shake' : ''
            }`}
          >
            <button
              id="screen1-accept-truth-btn"
              onClick={() => handleChoice('accept')}
              className="tactile-btn w-full bg-[#800020] text-white py-4 px-6 rounded-2xl font-bold text-sm shadow-lg shadow-[#800020]/20 hover:bg-[#570013] flex items-center justify-center gap-2"
            >
              <span>Accept the truth</span>
              <CheckCircle2 className="w-4 h-4 text-[#FFD1DC]" />
            </button>

            <button
              id="screen1-disagree-btn"
              onClick={() => handleChoice('disagree')}
              className="tactile-btn w-full bg-white text-gray-500 hover:text-[#800020] py-3.5 px-6 rounded-2xl font-bold text-sm border border-gray-200 hover:bg-[#FDFBF7] shadow-xs flex items-center justify-center gap-2"
            >
              <span>I disagree</span>
              <XCircle className="w-4 h-4 opacity-50" />
            </button>
          </div>
        ) : (
          /* When she clicked either button */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full bg-white border-2 border-[#800020] rounded-3xl p-5 text-center shadow-md shadow-[#800020]/10 space-y-3"
          >
            {outcome === 'accept' ? (
              <div className="space-y-1">
                <div className="inline-flex p-2 rounded-full bg-[#FFD1DC] text-[#800020] mb-1">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#800020]">
                  CORRECT.
                </h3>
                <p className="text-xs text-gray-600 font-semibold italic">
                  I knew there was a genius behind that pretty face.
                </p>
                <p className="text-xs text-gray-400">
                  The data is undeniable. Moving on to question two...
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="inline-flex p-2 rounded-full bg-[#FFD1DC] text-[#800020] mb-1">
                  <XCircle className="w-5 h-5 text-[#800020]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#800020]">
                  INCORRECT.
                </h3>
                <p className="text-xs text-gray-600 font-semibold italic">
                  After a thorough re-investigation, the evidence is still conclusive...
                </p>
                <p className="text-xs text-gray-400">
                  You’re still cute. There is no escape from the truth.
                </p>
              </div>
            )}

            <button
              id="screen1-continue-btn"
              onClick={() => {
                playSoftClick();
                onContinue();
              }}
              className="tactile-btn w-full bg-[#800020] text-white py-4 px-6 rounded-2xl font-bold text-sm shadow-lg shadow-[#800020]/20 hover:bg-[#570013] flex items-center justify-center gap-2"
            >
              <span>{outcome === 'disagree' ? 'Fine, I accept it' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
