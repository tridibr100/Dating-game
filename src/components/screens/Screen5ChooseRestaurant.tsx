import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Heart } from 'lucide-react';
import { Restaurant } from '../../types';
import { playSoftClick, playSparkleChime, triggerHaptic } from '../../utils/audio';

interface Screen5ChooseRestaurantProps {
  restaurants: Restaurant[];
  selectedRestaurantId: string;
  onSelectRestaurant: (restaurantId: string) => void;
  onContinue: () => void;
  dateTime: string;
}

export const Screen5ChooseRestaurant: React.FC<Screen5ChooseRestaurantProps> = ({
  restaurants,
  selectedRestaurantId,
  onSelectRestaurant,
  onContinue,
  dateTime: _dateTime,
}) => {
  const [selectedId, setSelectedId] = useState<string>(selectedRestaurantId);

  const selectedRestaurant = restaurants.find((r) => r.id === selectedId);

  const handleCardClick = (restaurant: Restaurant) => {
    setSelectedId(restaurant.id);
    onSelectRestaurant(restaurant.id);
    playSparkleChime();
    triggerHaptic(25);
  };

  return (
    <div className="w-full flex flex-col px-5 py-2 select-none">
      {/* Header section (Artistic Flair layout) */}
      <div className="mb-4 text-left">
        <h1 className="text-2xl sm:text-3xl font-serif text-[#800020] leading-tight mb-1.5">
          Okay, you can choose one thing.
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Since I’m such a generous boyfriend, I’ll let you decide where we’re having dinner.
        </p>
      </div>

      {/* Restaurant Selection List */}
      <div className="flex flex-col gap-3 my-1">
        {restaurants.map((rest) => {
          const isSelected = selectedId === rest.id;
          const isOtherSelected = Boolean(selectedId && !isSelected);

          return (
            <motion.div
              key={rest.id}
              id={`restaurant-card-${rest.id}`}
              onClick={() => handleCardClick(rest)}
              whileHover={{ scale: isSelected ? 1.02 : 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`rounded-3xl p-3.5 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-white border-2 border-[#800020] shadow-md shadow-[#800020]/10 transform scale-[1.02] z-10'
                  : isOtherSelected
                  ? 'bg-white border border-gray-100 opacity-60 grayscale-[0.35] hover:opacity-90 hover:grayscale-0'
                  : 'bg-white border border-gray-200/80 shadow-xs hover:border-[#800020]/40'
              }`}
            >
              {/* Top right heart badge on selected card */}
              {isSelected && (
                <div className="absolute top-3 right-3 text-[#800020]">
                  <Heart className="w-4 h-4 fill-[#800020]" />
                </div>
              )}

              <div className="flex gap-3 items-center">
                {/* Thumbnail / Visual Box */}
                <div className="w-16 h-16 bg-[#FDFBF7] rounded-2xl shrink-0 flex items-center justify-center border border-[#800020]/10 overflow-hidden relative shadow-inner">
                  <img
                    src={rest.imageUrl}
                    alt={rest.imageAlt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end justify-center pb-0.5">
                    <span className="text-xs drop-shadow-sm">{rest.vibeIcon}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="font-bold text-[#800020] text-sm truncate">
                    {rest.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">
                    {rest.cuisine} • {rest.vibe}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">
                    📍 {rest.address}
                  </p>

                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                        isSelected
                          ? 'bg-[#800020] text-white'
                          : 'bg-[#ffd1dc]/50 text-[#800020]'
                      }`}
                    >
                      {isSelected ? 'Perfect Choice' : 'Great Pick'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">
                      {rest.rating} ★
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Restaurant Feedback & Confirmation Button */}
      <AnimatePresence>
        {selectedRestaurant && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-center"
          >
            <p className="text-xs italic text-[#800020]/70 mb-3 font-medium">
              "I was hoping you’d pick that one. 😌"
            </p>

            <button
              id="screen5-continue-btn"
              onClick={() => {
                playSoftClick();
                onContinue();
              }}
              className="tactile-btn w-full bg-[#800020] text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-[#800020]/20 flex items-center justify-center gap-2 hover:bg-[#570013] transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
