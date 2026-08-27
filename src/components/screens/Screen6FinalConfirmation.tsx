import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  MapPin,
  Clock,
  Heart,
  Sparkles,
  Utensils,
  Share2,
  Check,
  RotateCcw,
  Download,
  ExternalLink,
} from 'lucide-react';
import { Restaurant } from '../../types';
import { playCelebration, playSoftClick, triggerHaptic } from '../../utils/audio';

interface Screen6FinalConfirmationProps {
  restaurant: Restaurant;
  herName: string;
  hisName: string;
  dateDay: string;
  dateTime: string;
  isConfirmed: boolean;
  onConfirm: () => void;
  onRestart: () => void;
}

export const Screen6FinalConfirmation: React.FC<Screen6FinalConfirmationProps> = ({
  restaurant,
  herName,
  hisName,
  dateDay,
  dateTime,
  isConfirmed,
  onConfirm,
  onRestart,
}) => {
  const [confirmed, setConfirmed] = useState(isConfirmed);
  const [copied, setCopied] = useState(false);

  const fireConfetti = () => {
    // Left burst
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 65,
      origin: { x: 0.15, y: 0.7 },
      colors: ['#FFD1DC', '#800020', '#ffdada', '#ffffff', '#b80048'],
    });
    // Right burst
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 65,
      origin: { x: 0.85, y: 0.7 },
      colors: ['#FFD1DC', '#800020', '#ffdada', '#ffffff', '#b80048'],
    });
    // Center heart rain
    confetti({
      particleCount: 40,
      spread: 100,
      origin: { y: 0.5 },
      shapes: ['star', 'circle'],
      colors: ['#FFD1DC', '#800020', '#ffffff'],
    });
  };

  const handleFinalConfirm = () => {
    setConfirmed(true);
    onConfirm();
    playCelebration();
    triggerHaptic(50);
    fireConfetti();
  };

  const handleCopyDateSummary = () => {
    const summary = `💌 Date Confirmed!\n🗓 When: ${dateDay} at ${dateTime}\n📍 Where: ${restaurant.name} (${restaurant.address})\n👗 Dress Code: Cute\n✨ See you there, ${herName}! - ${hisName}`;
    navigator.clipboard?.writeText(summary).then(() => {
      setCopied(true);
      playSoftClick();
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownloadICS = () => {
    playSoftClick();
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CaseFriday//RomanticMiniGame//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Dinner Date at ${restaurant.name} ❤️`,
      `DESCRIPTION:Dinner Date with ${hisName}. Dress code: Cute. Attendance: Mandatory.`,
      `LOCATION:${restaurant.name}, ${restaurant.address}`,
      'DTSTART;VALUE=DATE-TIME:20260821T213000',
      'DTEND;VALUE=DATE-TIME:20260821T233000',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Date_at_${restaurant.name.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col items-center text-center px-5 py-2 select-none text-white relative z-10 pb-8">
      {/* Top Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFD1DC] text-[11px] font-bold tracking-widest uppercase mb-2"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#FFD1DC]" />
        <span>RESERVATION LOCKED</span>
      </motion.div>

      {/* Hero Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3 drop-shadow-md flex items-center justify-center gap-2"
      >
        <span>See you Friday, {herName || 'cutie'}</span>
        <Heart className="w-7 h-7 text-[#FFD1DC] fill-[#FFD1DC] inline-block animate-heart-beat" />
      </motion.h1>

      {/* Elegant Reservation Card (Artistic Flair Spec) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-sm bg-[#FDFBF7] text-[#1c1c17] rounded-3xl p-5 shadow-2xl shadow-black/40 border border-white/40 relative overflow-hidden"
      >
        {/* Ticket notch cutouts */}
        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#570013] rounded-full -translate-y-1/2 border-r border-[#FFD1DC]/40" />
        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#570013] rounded-full -translate-y-1/2 border-l border-[#FFD1DC]/40" />

        {/* Top restaurant badge */}
        <div className="flex flex-col items-center mb-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFD1DC] text-[#800020] flex items-center justify-center mb-2 shadow-inner">
            <Utensils className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            CONFIRMED RESERVATION
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#800020] mt-0.5">
            {restaurant.name}
          </h2>
          <span className="text-xs text-[#800020]/80 font-semibold mt-0.5">
            {restaurant.cuisine} · {restaurant.vibe}
          </span>
        </div>

        {/* Heart Divider */}
        <div className="flex items-center justify-center gap-2 w-32 mx-auto my-2.5 opacity-60">
          <div className="h-px bg-gradient-to-r from-transparent to-[#800020] flex-1"></div>
          <Heart className="w-3 h-3 text-[#800020] fill-current" />
          <div className="h-px bg-gradient-to-l from-transparent to-[#800020] flex-1"></div>
        </div>

        {/* Detail Rows */}
        <div className="space-y-2 my-3 text-left">
          {/* Reserved For */}
          <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#FFD1DC]/30 border border-[#FFD1DC]">
            <Heart className="w-4 h-4 text-[#800020] fill-[#800020] shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-[9px] uppercase font-bold text-[#800020]/70 block">
                RESERVED FOR (GUEST OF HONOR)
              </span>
              <span className="text-xs font-bold text-[#800020] truncate block">
                {herName || 'Miss Vashishtha'}
              </span>
            </div>
          </div>

          {/* Companion */}
          <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-gray-100">
            <Utensils className="w-4 h-4 text-[#800020] shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-[9px] uppercase font-bold text-gray-400 block">
                COMPANION & ESCORT
              </span>
              <span className="text-xs font-bold text-[#1c1c17] truncate block">
                {hisName || 'Mr Roy'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-gray-100">
            <Calendar className="w-4 h-4 text-[#800020] shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-[9px] uppercase font-bold text-gray-400 block">
                DATE
              </span>
              <span className="text-xs font-bold text-[#1c1c17] truncate block">
                {dateDay}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-gray-100">
            <Clock className="w-4 h-4 text-[#800020] shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-[9px] uppercase font-bold text-gray-400 block">
                TIME
              </span>
              <span className="text-xs font-bold text-[#1c1c17] truncate block">
                {dateTime || restaurant.defaultTime}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-gray-100">
            <MapPin className="w-4 h-4 text-[#800020] shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-[9px] uppercase font-bold text-gray-400 block">
                LOCATION
              </span>
              <span className="text-xs font-bold text-[#1c1c17] truncate block">
                {restaurant.address}
              </span>
            </div>
            {restaurant.mapsUrl && (
              <a
                href={restaurant.mapsUrl}
                target="_blank"
                rel="noreferrer"
                id="maps-link-btn"
                className="p-1.5 rounded-xl bg-[#FDFBF7] hover:bg-[#FFD1DC]/40 text-[#800020] border border-gray-200 transition-colors shrink-0 flex items-center gap-1 text-[10px] font-bold"
                title="View on Google Maps"
              >
                <span>Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Playful terms & conditions */}
        <div className="pt-2.5 border-t border-gray-100 text-xs text-left space-y-1 font-medium">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Dress code:</span>
            <span className="font-bold text-[#800020]">Cute.</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Attendance:</span>
            <span className="font-bold text-[#800020]">Mandatory.</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Escape:</span>
            <span className="font-bold text-[#800020]">Impossible.</span>
          </div>
        </div>
      </motion.div>

      {/* Main Action Button & Confirmed state */}
      <div className="w-full max-w-sm mt-4 space-y-3">
        {!confirmed ? (
          <button
            id="screen6-confirm-btn"
            onClick={handleFinalConfirm}
            className="tactile-btn w-full bg-[#FFD1DC] hover:bg-white text-[#800020] py-4 px-8 rounded-2xl font-bold text-sm shadow-xl shadow-black/20 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
          >
            <span>YES, I’LL BE THERE</span>
            <Heart className="w-4 h-4 fill-[#800020]" />
          </button>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-3"
            >
              {/* Sweet verdict text */}
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-1">
                <div className="text-xs font-bold text-[#FFD1DC]">
                  ✓ Correct answer.
                </div>
                <p className="font-serif text-base font-bold text-white">
                  I knew you’d make the right choice. 😌❤️
                </p>
                <p className="text-xs text-[#FFD1DC] opacity-90">
                  A confirmation has been saved. See you Friday, {herName}.
                </p>
              </div>

              {/* Utility actions: Calendar + Copy + Replay */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="screen6-add-calendar-btn"
                  onClick={handleDownloadICS}
                  className="py-3 px-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Add to Calendar
                </button>

                <button
                  id="screen6-share-summary-btn"
                  onClick={handleCopyDateSummary}
                  className="py-3 px-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-300" />
                      <span className="text-green-200">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Copy Card</span>
                    </>
                  )}
                </button>
              </div>

              <button
                id="screen6-replay-btn"
                onClick={() => {
                  playSoftClick();
                  onRestart();
                }}
                className="text-xs font-semibold text-[#FFD1DC] hover:text-white flex items-center justify-center gap-1.5 mx-auto py-1 opacity-80 hover:opacity-100 transition-opacity"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Play from beginning
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
