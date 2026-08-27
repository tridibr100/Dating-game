import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Heart, PartyPopper, CheckCircle, ArrowRight } from 'lucide-react';
import {
  playSoftClick,
  playSparkleChime,
  triggerHaptic,
} from '../../utils/audio';

interface Screen3TheTrapProps {
  onContinue: () => void;
  savedChoice: 'yes' | 'absolutely' | 'fine' | null;
  onSelectChoice: (choice: 'yes' | 'absolutely' | 'fine') => void;
  dateDay?: string;
  herName?: string;
  hisName?: string;
}

export const Screen3TheTrap: React.FC<Screen3TheTrapProps> = ({
  onContinue,
  savedChoice,
  onSelectChoice,
  dateDay = 'FRIDAY',
  herName = 'Miss Vashishtha',
  hisName = 'Mr Roy',
}) => {
  const [selectedChoice, setSelectedChoice] = useState<
    'yes' | 'absolutely' | 'fine' | null
  >(savedChoice);
  const [confirmed, setConfirmed] = useState(!!savedChoice);

  const handleChoose = (choice: 'yes' | 'absolutely' | 'fine') => {
    setSelectedChoice(choice);
    onSelectChoice(choice);
    playSparkleChime();
    triggerHaptic(30);
    setConfirmed(true);
  };

  return (
    <div className="w-full flex flex-col items-center text-center px-5 py-2 select-none">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#800020]/15 text-[#800020] shadow-xs text-[11px] font-bold tracking-widest uppercase mb-2"
      >
        <PartyPopper className="w-3.5 h-3.5" />
        <span>CONGRATULATIONS 🎉</span>
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-serif text-2xl sm:text-3xl font-bold text-[#800020] tracking-tight mb-4 max-w-xs"
      >
        {herName}, you have been selected for a date with {hisName}.
      </motion.h1>

      {/* The Reservation / Calendar Ticket Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-white rounded-3xl border border-gray-200/80 shadow-md shadow-[#800020]/5 overflow-hidden relative mb-4"
      >
        {/* Calendar top bar */}
        <div className="w-full bg-[#800020] py-2.5 px-4 flex items-center justify-center gap-2 text-white">
          <Calendar className="w-4 h-4 text-[#FFD1DC]" />
          <span className="text-xs font-bold tracking-widest uppercase">
            Official Summons
          </span>
        </div>

        <div className="p-6 flex flex-col items-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            SCHEDULED EVENT
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#800020] tracking-tight">
            {dateDay}
          </h2>

          {/* Heart divider */}
          <div className="flex items-center justify-center gap-2 w-32 my-3 opacity-60">
            <div className="h-px bg-gradient-to-r from-transparent to-[#800020] flex-1"></div>
            <Heart className="w-3.5 h-3.5 text-[#800020] fill-current" />
            <div className="h-px bg-gradient-to-l from-transparent to-[#800020] flex-1"></div>
          </div>

          <div className="px-4 py-1 rounded-full bg-[#FFD1DC]/40 border border-[#FFD1DC] text-[#800020] text-xs font-bold tracking-wider uppercase">
            ♡ RESERVED FOR {herName.toUpperCase()} ♡
          </div>
        </div>

        {/* Notched ticket dots decoration */}
        <div className="relative flex items-center justify-between px-[-12px]">
          <div className="w-5 h-5 rounded-full bg-[#FCFAFA] -ml-2.5 border-r border-gray-200" />
          <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-2" />
          <div className="w-5 h-5 rounded-full bg-[#FCFAFA] -mr-2.5 border-l border-gray-200" />
        </div>

        <div className="p-4 bg-[#FDFBF7] text-xs text-gray-600 font-medium">
          {confirmed ? (
            <div className="space-y-1">
              <span className="text-[#800020] font-bold block text-sm">
                ✓ BOOKING CONFIRMED
              </span>
              <p>Your presence is mandatory. No cancellations permitted.</p>
            </div>
          ) : (
            <p className="text-gray-400 italic">
              "Your available choices have been calibrated for 100% accuracy."
            </p>
          )}
        </div>
      </motion.div>

      {/* Interactive Options or Confirmed Next Step */}
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          {!confirmed ? (
            <motion.div
              key="options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2.5"
            >
              <button
                id="trap-option-yes"
                onClick={() => handleChoose('yes')}
                className="tactile-btn w-full bg-[#800020] text-white py-4 px-6 rounded-2xl font-bold text-sm shadow-lg shadow-[#800020]/20 hover:bg-[#570013] flex items-center justify-center gap-2"
              >
                <span>Yes</span>
                <Heart className="w-4 h-4 text-[#FFD1DC] fill-current" />
              </button>

              <button
                id="trap-option-absolutely"
                onClick={() => handleChoose('absolutely')}
                className="tactile-btn w-full bg-white text-[#800020] py-3.5 px-6 rounded-2xl font-bold text-sm border border-[#800020]/30 hover:border-[#800020] shadow-xs hover:bg-[#FFD1DC]/20 flex items-center justify-center gap-2"
              >
                <span>Absolutely yes 🎉</span>
              </button>

              <button
                id="trap-option-fine"
                onClick={() => handleChoose('fine')}
                className="tactile-btn w-full bg-white text-gray-500 hover:text-[#800020] py-3 px-6 rounded-2xl font-semibold text-xs border border-gray-200 hover:bg-[#FDFBF7] shadow-xs flex items-center justify-center gap-2"
              >
                <span>Fine, I guess 😒</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-2 border-[#800020] rounded-3xl p-5 text-center space-y-3 shadow-md shadow-[#800020]/10"
            >
              <div className="flex items-center justify-center gap-2 text-[#800020]">
                <CheckCircle className="w-5 h-5 text-[#800020]" />
                <span className="font-serif font-bold text-lg">
                  I knew you’d make the right choice.
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {selectedChoice === 'fine'
                  ? 'Your reluctant acceptance has been recorded with extra love.'
                  : 'Your enthusiastic acceptance has warmed my entire heart.'}
              </p>

              <button
                id="screen3-continue-btn"
                onClick={() => {
                  playSoftClick();
                  onContinue();
                }}
                className="tactile-btn w-full bg-[#800020] text-white py-4 px-6 rounded-2xl font-bold text-sm shadow-lg shadow-[#800020]/20 hover:bg-[#570013] flex items-center justify-center gap-2"
              >
                <span>Proceed to Upgrades</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
