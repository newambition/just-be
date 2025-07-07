import React, { useContext, useMemo } from "react";
import type { BreathingExercise } from "../types";
import { breathingExercises } from "../data/exercises";
import { AppContext } from "../context/AppContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

// Swiper imports for mobile carousel
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";

interface PresetSelectionProps {
  onSelectExercise: (exercise: BreathingExercise) => void;
}

// A single, flexible card component that works for both layouts
const PresetCard: React.FC<{
  exercise: BreathingExercise;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  className?: string; // Optional className for grid spanning
}> = ({ exercise, onSelect, isFavorite, onToggleFavorite, className = "" }) => {
  return (
    <div
      className={`relative flex h-full w-full flex-col rounded-2xl border border-slate-700 bg-slate-800/50 p-6 text-center backdrop-blur-xs shadow-lg transition-all duration-300 hover:border-sky-400 hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-sky-400 font-quicksand ${className}`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(e);
        }}
        className="absolute top-4 right-4 text-rose-400 hover:text-rose-300 transition-colors z-10 p-2 font-quicksand"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? <FaHeart size={22} /> : <FaRegHeart size={22} />}
      </button>

      <div className="flex flex-col items-center justify-center flex-grow space-y-6">
        <div className="text-2xl sm:text-5xl font-quicksand">
          {exercise.icon}
        </div>
        <div className="space-y-6">
          <p className="font-semibold uppercase tracking-wider text-sky-400 text-sm sm:text-base font-quicksand">
            {exercise.mood}
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-100 font-quicksand">
            {exercise.title}
          </h3>
          <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed max-w-[220px] mx-auto font-quicksand">
            {exercise.description}
          </p>
        </div>
      </div>
      <button onClick={onSelect} className="btn btn-primary mt-6 mb-4 w-full">
        Start
      </button>
    </div>
  );
};

const PresetSelectionPage: React.FC<PresetSelectionProps> = ({
  onSelectExercise,
}) => {
  const appContext = useContext(AppContext);
  if (!appContext) return null;

  const { settings, toggleFavorite } = appContext;

  const favoriteExercises = useMemo(
    () =>
      breathingExercises.filter((ex) =>
        settings.favoriteExercises.includes(ex.id)
      ),
    [settings.favoriteExercises]
  );

  // Define the layout classes for the bento grid
  // This will make some cards wider than others
  const bentoLayoutClasses = [
    "md:col-span-2", // Just... Center
    "md:col-span-2", // Just... Sleep
    "md:col-span-1", // Just... Awaken
    "md:col-span-3", // Just... Release
    "md:col-span-3", // Just... Flow
    "md:col-span-1", // Just... Balance
    "md:col-span-2", // Just... Settle
    "md:col-span-2", // Just... Be
  ];

  const handleToggleFavorite = (e: React.MouseEvent, exerciseId: string) => {
    e.stopPropagation();
    toggleFavorite(exerciseId);
  };

  return (
    <div className="w-full flex-grow flex flex-col justify-center  animate-fade-in">
      <h2 className="mb-8  text-center text-lg font-semibold tracking-tighter text-slate-200 font-quicksand">
        Choose Your Session
      </h2>

      {/* Mobile View: 3D Carousel (hidden on medium screens and up) */}
      <div className="md:hidden h-[60vh] w-full">
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[EffectCoverflow, Pagination, Navigation]}
          className="h-full w-full"
        >
          {breathingExercises.map((exercise) => (
            <SwiperSlide
              key={exercise.id}
              className="w-3/4 max-w-[280px] h-full"
            >
              <PresetCard
                exercise={exercise}
                onSelect={() => onSelectExercise(exercise)}
                isFavorite={settings.favoriteExercises.includes(exercise.id)}
                onToggleFavorite={(e) => handleToggleFavorite(e, exercise.id)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop View: Bento Grid (visible on medium screens and up) */}
      <div className="hidden md:block w-full max-w-7xl mx-auto space-y-8">
        {favoriteExercises.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-slate-200 mb-4 pl-2 font-quicksand">
              Favorites
            </h3>
            <div className="grid md:grid-cols-4 md:auto-rows-fr gap-4">
              {favoriteExercises.map((exercise) => (
                <div key={`fav-${exercise.id}`} className="md:col-span-1">
                  <PresetCard
                    exercise={exercise}
                    onSelect={() => onSelectExercise(exercise)}
                    isFavorite={true}
                    onToggleFavorite={(e) =>
                      handleToggleFavorite(e, exercise.id)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-xl font-bold text-slate-200 mb-4 pl-2 font-quicksand">
            All Exercises
          </h3>
          <div className="grid md:grid-cols-4 md:auto-rows-fr gap-4">
            {breathingExercises.map((exercise, index) => (
              <div key={exercise.id} className={bentoLayoutClasses[index]}>
                <PresetCard
                  exercise={exercise}
                  onSelect={() => onSelectExercise(exercise)}
                  isFavorite={settings.favoriteExercises.includes(exercise.id)}
                  onToggleFavorite={(e) => handleToggleFavorite(e, exercise.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresetSelectionPage;
