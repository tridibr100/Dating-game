import React, { useState } from 'react';
import { X, Sparkles, RotateCcw, Heart, Calendar } from 'lucide-react';
import { GameCustomization, GameStep } from '../types';
import { playSoftClick, playSparkleChime } from '../utils/audio';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customization: GameCustomization;
  onSaveCustomization: (updated: GameCustomization) => void;
  onResetGame: () => void;
  onJumpToStep: (step: GameStep) => void;
  currentStep: GameStep;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  customization,
  onSaveCustomization,
  onResetGame,
  onJumpToStep,
  currentStep,
}) => {
  const [herName, setHerName] = useState(customization.herName);
  const [hisName, setHisName] = useState(customization.hisName);
  const [dateDay, setDateDay] = useState(customization.dateDay);
  const [dateTime, setDateTime] = useState(customization.dateTime);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playSparkleChime();
    onSaveCustomization({
      herName: herName.trim() || 'Miss Vashishtha',
      hisName: hisName.trim() || 'Mr Roy',
      dateDay: dateDay.trim() || 'FRIDAY NIGHT',
      dateTime: dateTime.trim() || '9:30 PM',
    });
    onClose();
  };

  return (
    <div
      id="customizer-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="customizer-modal-content"
        className="bg-[#FDFBF7] text-[#1c1c17] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-[#800020]">
            <Sparkles className="w-5 h-5 text-[#800020]" />
            <h3 className="font-serif text-xl font-bold">Game Personalizer</h3>
          </div>
          <button
            id="close-settings-modal-btn"
            onClick={() => {
              playSoftClick();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="mt-4 space-y-3 text-left">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Her Name (Person Reserved For)
            </label>
            <div className="relative">
              <input
                id="input-her-name"
                type="text"
                value={herName}
                onChange={(e) => setHerName(e.target.value)}
                placeholder="e.g. Miss Vashishtha"
                className="w-full bg-white border border-gray-200 focus:border-[#800020] rounded-2xl px-3.5 py-2.5 text-sm font-medium text-[#1c1c17] outline-none shadow-xs transition-colors"
              />
              <Heart className="w-4 h-4 text-[#800020] absolute right-3 top-3 opacity-40" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Your Name (Companion)
            </label>
            <input
              id="input-his-name"
              type="text"
              value={hisName}
              onChange={(e) => setHisName(e.target.value)}
              placeholder="e.g. Mr Roy"
              className="w-full bg-white border border-gray-200 focus:border-[#800020] rounded-2xl px-3.5 py-2.5 text-sm font-medium text-[#1c1c17] outline-none shadow-xs transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Date Night
              </label>
              <input
                id="input-date-day"
                type="text"
                value={dateDay}
                onChange={(e) => setDateDay(e.target.value)}
                placeholder="FRIDAY NIGHT"
                className="w-full bg-white border border-gray-200 focus:border-[#800020] rounded-2xl px-3 py-2 text-sm font-medium text-[#1c1c17] outline-none shadow-xs transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Dinner Time
              </label>
              <input
                id="input-date-time"
                type="text"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                placeholder="8:00 PM"
                className="w-full bg-white border border-gray-200 focus:border-[#800020] rounded-2xl px-3 py-2 text-sm font-medium text-[#1c1c17] outline-none shadow-xs transition-colors"
              />
            </div>
          </div>

          {/* Quick Jump / Screen Test */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Jump to Screen (Tester)
            </label>
            <div className="grid grid-cols-6 gap-1">
              {([1, 2, 3, 4, 5, 6] as GameStep[]).map((step) => (
                <button
                  key={step}
                  type="button"
                  id={`jump-step-${step}-btn`}
                  onClick={() => {
                    playSoftClick();
                    onJumpToStep(step);
                    onClose();
                  }}
                  className={`py-1 rounded-xl text-xs font-bold transition-all ${
                    currentStep === step
                      ? 'bg-[#800020] text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>
          </div>

          {/* Save & Reset actions */}
          <div className="pt-3 flex items-center gap-2">
            <button
              id="modal-reset-game-btn"
              type="button"
              onClick={() => {
                playSoftClick();
                onResetGame();
                onClose();
              }}
              className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-500 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-white active:scale-95 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Game
            </button>
            <button
              id="modal-save-custom-btn"
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-[#800020] text-white font-bold text-xs shadow-lg shadow-[#800020]/20 flex items-center justify-center gap-1.5 hover:bg-[#570013] active:scale-95 transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              Save & Play
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
