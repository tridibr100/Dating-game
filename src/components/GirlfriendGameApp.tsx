import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameStep, GameCustomization, GameState, Restaurant } from '../types';
import { DEFAULT_RESTAURANTS } from '../data/restaurants';
import { setSoundEnabled } from '../utils/audio';
import { recordGameEvent } from '../services/tracker';

import { FloatingHearts } from './FloatingHearts';
import { TopHeader } from './TopHeader';
import { CustomizerModal } from './CustomizerModal';

import { Screen1Investigation } from './screens/Screen1Investigation';
import { Screen2LoveQuestion } from './screens/Screen2LoveQuestion';
import { Screen3TheTrap } from './screens/Screen3TheTrap';
import { Screen4DateUpgrade } from './screens/Screen4DateUpgrade';
import { Screen5ChooseRestaurant } from './screens/Screen5ChooseRestaurant';
import { Screen6FinalConfirmation } from './screens/Screen6FinalConfirmation';

export const GirlfriendGameApp: React.FC = () => {
  const [restaurants] = useState<Restaurant[]>(DEFAULT_RESTAURANTS);
  const [soundActive, setSoundActive] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const [customization, setCustomization] = useState<GameCustomization>({
    herName: 'Miss Vashishtha',
    hisName: 'Mr Roy',
    dateDay: 'FRIDAY NIGHT',
    dateTime: '9:30 PM',
  });

  const [gameState, setGameState] = useState<GameState>({
    currentStep: 1,
    screen1Choice: null,
    screen2Choice: null,
    screen3Choice: null,
    screen4Upgraded: false,
    selectedRestaurantId: 'pizza-4ps',
    screen6Confirmed: false,
  });

  // Record game start on initial mount
  useEffect(() => {
    recordGameEvent('game_started');
  }, []);

  const handleToggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    setSoundEnabled(next);
  };

  const handleNextStep = () => {
    setGameState((prev) => ({
      ...prev,
      currentStep: Math.min(6, prev.currentStep + 1) as GameStep,
    }));
  };

  const handlePrevStep = () => {
    setGameState((prev) => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1) as GameStep,
    }));
  };

  const handleResetGame = () => {
    setGameState({
      currentStep: 1,
      screen1Choice: null,
      screen2Choice: null,
      screen3Choice: null,
      screen4Upgraded: false,
      selectedRestaurantId: 'pizza-4ps',
      screen6Confirmed: false,
    });
    recordGameEvent('game_started');
  };

  const handleJumpToStep = (step: GameStep) => {
    setGameState((prev) => ({
      ...prev,
      currentStep: step,
    }));
  };

  const selectedRestaurant =
    restaurants.find((r) => r.id === gameState.selectedRestaurantId) ||
    restaurants[0];

  const isDarkMode = gameState.currentStep === 6;

  return (
    <div
      className={`min-h-screen min-h-[100dvh] w-full flex flex-col items-center justify-center transition-colors duration-700 relative overflow-hidden artistic-canvas-bg ${
        isDarkMode
          ? 'bg-[#3b0b14] text-[#FDFBF7]'
          : 'bg-[#FDFBF7] text-[#1c1c17]'
      }`}
    >
      {/* Background Artistic Atmosphere Elements */}
      <div className="absolute top-[-100px] left-[-100px] w-[450px] h-[450px] bg-[#FFD1DC] rounded-full opacity-30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[550px] h-[550px] bg-[#800020] rounded-full opacity-10 blur-3xl pointer-events-none" />

      {/* Large faint watermark typography for the Artistic Flair aesthetic */}
      <div className="absolute top-16 left-12 opacity-5 rotate-[-12deg] pointer-events-none hidden lg:block select-none">
        <p className="text-9xl font-serif text-[#800020] font-bold tracking-tighter">
          LOVE
        </p>
        <p className="text-3xl font-serif text-[#800020] mt-2 italic">
          Investigation Case #Friday
        </p>
      </div>

      <div className="absolute bottom-16 right-12 opacity-5 rotate-[8deg] pointer-events-none hidden lg:block select-none text-right">
        <p className="text-8xl font-serif text-[#800020] font-bold">
          FRIDAY
        </p>
        <p className="text-2xl font-serif text-[#800020] mt-1 italic">
          Reserved For You
        </p>
      </div>

      {/* Floating Hearts background particles */}
      <FloatingHearts
        density={isDarkMode ? 'high' : 'low'}
        theme={isDarkMode ? 'dark' : 'light'}
      />

      {/* Main 9:16 Phone Device Enclosure */}
      <div
        id="app-container"
        className={`w-full max-w-[400px] min-h-screen min-h-[100dvh] sm:min-h-[740px] sm:max-h-[870px] sm:rounded-[48px] shadow-[0_20px_60px_-15px_rgba(128,0,32,0.15)] sm:border-[10px] sm:border-[#1A1A1A] flex flex-col justify-between relative z-10 transition-all duration-500 overflow-hidden ${
          isDarkMode
            ? 'bg-[#570013]'
            : 'bg-[#FCFAFA]'
        }`}
      >
        {/* Sleek Hardware Top Notch (Artistic Flair Device frame) */}
        <div className="h-5 w-28 bg-[#1A1A1A] absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-50 hidden sm:block pointer-events-none" />

        {/* Top Navigation & Status Header */}
        <TopHeader
          currentStep={gameState.currentStep}
          onBack={handlePrevStep}
          soundEnabled={soundActive}
          onToggleSound={handleToggleSound}
          onOpenSettings={() => setIsSettingsOpen(true)}
          isDarkMode={isDarkMode}
        />

        {/* Dynamic Screen Content Area */}
        <div className="flex-1 flex flex-col justify-center overflow-y-auto no-scrollbar py-2 sm:px-1">
          <AnimatePresence mode="wait">
            {gameState.currentStep === 1 && (
              <motion.div
                key="screen-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full"
              >
                <Screen1Investigation
                  savedChoice={gameState.screen1Choice}
                  onSelectChoice={(choice) => {
                    setGameState((prev) => ({ ...prev, screen1Choice: choice }));
                  }}
                  onContinue={handleNextStep}
                />
              </motion.div>
            )}

            {gameState.currentStep === 2 && (
              <motion.div
                key="screen-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full"
              >
                <Screen2LoveQuestion
                  savedChoice={gameState.screen2Choice}
                  onSelectChoice={(choice) => {
                    setGameState((prev) => ({ ...prev, screen2Choice: choice }));
                    recordGameEvent('love_question_answered');
                  }}
                  onContinue={handleNextStep}
                />
              </motion.div>
            )}

            {gameState.currentStep === 3 && (
              <motion.div
                key="screen-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full"
              >
                <Screen3TheTrap
                  savedChoice={gameState.screen3Choice}
                  onSelectChoice={(choice) => {
                    setGameState((prev) => ({ ...prev, screen3Choice: choice }));
                    recordGameEvent('date_accepted');
                  }}
                  dateDay={customization.dateDay}
                  herName={customization.herName}
                  hisName={customization.hisName}
                  onContinue={handleNextStep}
                />
              </motion.div>
            )}

            {gameState.currentStep === 4 && (
              <motion.div
                key="screen-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full"
              >
                <Screen4DateUpgrade
                  herName={customization.herName}
                  hisName={customization.hisName}
                  dateDay={customization.dateDay}
                  isUpgraded={gameState.screen4Upgraded}
                  onUpgrade={() => {
                    setGameState((prev) => ({ ...prev, screen4Upgraded: true }));
                    recordGameEvent('date_upgraded');
                  }}
                  onContinue={handleNextStep}
                />
              </motion.div>
            )}

            {gameState.currentStep === 5 && (
              <motion.div
                key="screen-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full"
              >
                <Screen5ChooseRestaurant
                  restaurants={restaurants}
                  selectedRestaurantId={gameState.selectedRestaurantId}
                  onSelectRestaurant={(id) => {
                    setGameState((prev) => ({
                      ...prev,
                      selectedRestaurantId: id,
                    }));
                    const found = restaurants.find((r) => r.id === id);
                    recordGameEvent('restaurant_selected', {
                      restaurantId: id,
                      restaurantName: found?.name || id,
                      location: found?.address || '',
                      cuisineVibe: `${found?.cuisine || ''} • ${found?.vibe || ''}`,
                    });
                  }}
                  dateTime={customization.dateTime}
                  onContinue={handleNextStep}
                />
              </motion.div>
            )}

            {gameState.currentStep === 6 && (
              <motion.div
                key="screen-6"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="w-full"
              >
                <Screen6FinalConfirmation
                  restaurant={selectedRestaurant}
                  herName={customization.herName}
                  hisName={customization.hisName}
                  dateDay={customization.dateDay}
                  dateTime={customization.dateTime}
                  isConfirmed={gameState.screen6Confirmed}
                  onConfirm={() => {
                    setGameState((prev) => ({
                      ...prev,
                      screen6Confirmed: true,
                    }));
                    recordGameEvent('game_completed', {
                      restaurantId: selectedRestaurant.id,
                      restaurantName: selectedRestaurant.name,
                      location: selectedRestaurant.address,
                      cuisineVibe: `${selectedRestaurant.cuisine} • ${selectedRestaurant.vibe}`,
                    });
                  }}
                  onRestart={handleResetGame}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Subtle in-app footer signature */}
        <div
          className={`py-2.5 px-4 text-center text-[10px] tracking-widest uppercase font-bold transition-colors ${
            isDarkMode ? 'text-white/30' : 'text-[#800020]/30'
          }`}
        >
          {gameState.currentStep < 6
            ? 'Case File #Friday · Confidential'
            : 'Case File #Friday Closed · No Appeal Permitted ❤️'}
        </div>
      </div>

      {/* Exterior desktop footer watermark */}
      <div className="mt-4 text-[#800020]/30 text-[10px] tracking-widest uppercase font-bold hidden sm:block">
        Case File #Friday &copy; 2026
      </div>

      {/* Settings / Personalization Modal */}
      <CustomizerModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        customization={customization}
        onSaveCustomization={(updated) => setCustomization(updated)}
        onResetGame={handleResetGame}
        onJumpToStep={handleJumpToStep}
        currentStep={gameState.currentStep}
      />
    </div>
  );
};
