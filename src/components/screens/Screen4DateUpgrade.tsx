import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Sparkles, UtensilsCrossed, ArrowRight, Heart } from 'lucide-react';
import {
  playSoftClick,
  playSparkleChime,
  triggerHaptic,
} from '../../utils/audio';

interface Screen4DateUpgradeProps {
  onContinue: () => void;
  herName: string;
  hisName: string;
  dateDay: string;
  isUpgraded: boolean;
  onUpgrade: () => void;
}

export const Screen4DateUpgrade: React.FC<Screen4DateUpgradeProps> = ({
  onContinue,
  herName,
  hisName,
  dateDay,
  isUpgraded,
  onUpgrade,
}) => {
  const [upgraded, setUpgraded] = useState(isUpgraded);

  const handleUpgradeClick = () => {
    playSparkleChime();
    triggerHaptic(40);
    setUpgraded(true);
    onUpgrade();
  };

  return (
    <div className="w-full flex flex-col items-center text-center px-5 py-2 select-none">
      {/* Top Star/Upgrade Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-white border border-[#800020]/15 text-[#800020] shadow-xs text-[11px] font-bold tracking-widest uppercase mb-2"
      >
        <Star className="w-3.5 h-3.5 fill-[#800020]" />
        <span>DATE UPGRADE</span>
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-serif text-2xl sm:text-3xl font-bold text-[#800020] tracking-tight mb-1"
      >
        A Friday date is nice…
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-serif italic text-base text-[#800020]/80 mb-4"
      >
        "But I feel like we can do better."
      </motion.p>

      {/* Luxury Reservation Upgrade Card */}
      <motion.div
        key={upgraded ? 'upgraded-card' : 'standard-card'}
        initial={{ opacity: 0, scale: 0.95, rotateY: 15 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.5, type: 'spring', damping: 15 }}
        className={`w-full max-w-sm rounded-3xl p-5 relative overflow-hidden transition-all shadow-md ${
          upgraded
            ? 'bg-white border-2 border-[#800020] shadow-xl shadow-[#800020]/15 ring-4 ring-[#FFD1DC]/40'
            : 'bg-white border border-gray-200/80 shadow-xs'
        }`}
      >
        {/* Shimmer / Glow effect when upgraded */}
        {upgraded && (
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FFD1DC] rounded-full blur-2xl opacity-40 pointer-events-none" />
        )}

        {/* Tier indicator */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span
            className={`w-2 h-2 rounded-full ${
              upgraded ? 'bg-[#800020] animate-ping' : 'bg-gray-400'
            }`}
          />
          <span
            className={`text-[10px] font-bold uppercase tracking-widest ${
              upgraded ? 'text-[#800020]' : 'text-gray-400'
            }`}
          >
            {upgraded ? '★ LUXURY TIER UNLOCKED ★' : 'STANDARD TIER'}
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              upgraded ? 'bg-[#800020]' : 'bg-gray-400'
            }`}
          />
        </div>

        {/* Big Card Title */}
        <div className="my-2">
          <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
            {dateDay}
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#800020] tracking-tight mt-0.5">
            {upgraded ? 'DINNER DATE' : 'CASUAL HANGOUT'}
          </h2>
        </div>

        {/* Heart Divider */}
        <div className="flex items-center justify-center gap-2 w-32 mx-auto my-3 opacity-60">
          <div className="h-px bg-gradient-to-r from-transparent to-[#800020] flex-1"></div>
          <Heart className="w-3.5 h-3.5 text-[#800020] fill-current" />
          <div className="h-px bg-gradient-to-l from-transparent to-[#800020] flex-1"></div>
        </div>

        {/* Attendee Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-left mb-2">
          <div className="bg-[#FDFBF7] rounded-2xl p-3 border border-gray-100">
            <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
              Reserved for
            </span>
            <span className="font-bold text-sm text-[#800020] truncate block">
              {herName || 'Cutie'}
            </span>
          </div>

          <div className="bg-[#FDFBF7] rounded-2xl p-3 border border-gray-100">
            <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
              Companion
            </span>
            <span className="font-bold text-sm text-[#800020] truncate block">
              {hisName || 'Me'}
            </span>
          </div>
        </div>

        {/* Perks list for upgraded tier */}
        <AnimatePresence>
          {upgraded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 pt-3 border-t border-gray-100 text-left text-xs space-y-1.5 text-gray-600"
            >
              <div className="flex items-center gap-1.5 text-[#800020] font-semibold">
                <UtensilsCrossed className="w-3.5 h-3.5 text-[#800020]" />
                <span>Includes: Romantic Dinner + Drinks + My Undivided Attention</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <Sparkles className="w-3.5 h-3.5 text-[#800020]" />
                <span>Guaranteed to make you smile all evening</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Upgrade CTA or Proceed */}
      <div className="w-full max-w-sm mt-4">
        {!upgraded ? (
          <button
            id="screen4-upgrade-btn"
            onClick={handleUpgradeClick}
            className="tactile-btn w-full bg-[#800020] text-white py-4 px-6 rounded-2xl font-bold text-sm shadow-lg shadow-[#800020]/20 hover:bg-[#570013] flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-4 h-4 text-[#FFD1DC] group-hover:rotate-12 transition-transform" />
            <span>Upgrade my date</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="text-center">
              <span className="font-serif font-bold text-xl text-[#800020] block">
                DINNER DATE UNLOCKED ❤️
              </span>
              <p className="text-xs text-gray-500 mt-1">
                There’s just one tiny decision left for you to make.
              </p>
            </div>

            <button
              id="screen4-choose-wisely-btn"
              onClick={() => {
                playSoftClick();
                onContinue();
              }}
              className="tactile-btn w-full bg-[#800020] text-white py-4 px-6 rounded-2xl font-bold text-sm shadow-lg shadow-[#800020]/20 hover:bg-[#570013] flex items-center justify-center gap-2"
            >
              <span>Choose wisely</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
