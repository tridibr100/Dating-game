import React from 'react';
import { ArrowLeft, Volume2, VolumeX, Settings, Heart } from 'lucide-react';
import { GameStep } from '../types';
import { playSoftClick } from '../utils/audio';

interface TopHeaderProps {
  currentStep: GameStep;
  onBack: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  isDarkMode?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentStep,
  onBack,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  isDarkMode = false,
}) => {
  return (
    <header
      className={`w-full z-40 px-6 pt-5 pb-2 flex items-center justify-between transition-colors duration-500 ${
        isDarkMode ? 'text-[#FDFBF7]' : 'text-[#800020]'
      }`}
    >
      {/* Left button: Back or subtle Heart icon */}
      <div className="w-10 flex items-center justify-start">
        {currentStep > 1 ? (
          <button
            id="header-back-btn"
            onClick={() => {
              playSoftClick();
              onBack();
            }}
            aria-label="Go back to previous screen"
            className={`p-2 rounded-full transition-transform active:scale-90 hover:opacity-80 ${
              isDarkMode
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-[#800020]/5 text-[#800020] hover:bg-[#800020]/10'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <div
            className={`p-1.5 rounded-full ${
              isDarkMode ? 'text-[#ffb2bd]' : 'text-[#800020]'
            }`}
          >
            <Heart className="w-4 h-4 fill-current animate-pulse" />
          </div>
        )}
      </div>

      {/* Center: Step Indicator with 3 Dots (Artistic Flair Spec) */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold tracking-[0.2em] uppercase ${
              isDarkMode ? 'text-[#ffb2bd]' : 'text-[#800020]/60'
            }`}
          >
            0{currentStep} / 06
          </span>
          <div className="flex gap-1 items-center">
            <div
              className={`w-1 h-1 rounded-full ${
                isDarkMode ? 'bg-[#ffb2bd]' : 'bg-[#800020]'
              }`}
            />
            <div
              className={`w-1 h-1 rounded-full ${
                isDarkMode ? 'bg-[#ffb2bd]' : 'bg-[#800020]'
              }`}
            />
            <div
              className={`w-1 h-1 rounded-full ${
                isDarkMode ? 'bg-[#ffb2bd]' : 'bg-[#800020]'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Right buttons: Sound toggle & settings */}
      <div className="w-16 flex items-center justify-end gap-1.5">
        <button
          id="header-sound-toggle-btn"
          onClick={() => {
            playSoftClick();
            onToggleSound();
          }}
          aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          className={`p-2 rounded-full transition-transform active:scale-90 ${
            isDarkMode
              ? 'bg-white/10 text-white hover:bg-white/20'
              : 'bg-[#800020]/5 text-[#800020] hover:bg-[#800020]/10'
          }`}
          title={soundEnabled ? 'Sound is on' : 'Sound is muted'}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 opacity-60" />
          )}
        </button>

        <button
          id="header-settings-btn"
          onClick={() => {
            playSoftClick();
            onOpenSettings();
          }}
          aria-label="Customize settings"
          className={`p-2 rounded-full transition-transform active:scale-90 ${
            isDarkMode
              ? 'bg-white/10 text-white hover:bg-white/20'
              : 'bg-[#800020]/5 text-[#800020] hover:bg-[#800020]/10'
          }`}
          title="Customize names & game settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
