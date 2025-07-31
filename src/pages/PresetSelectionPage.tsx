import React, { useContext, useMemo, useState, useEffect } from "react";
import { useAppLogic } from "../hooks/useAppLogic";
import type { BreathingExercise } from "../types";
import { getExercises } from "../services/firestoreService";
import { AppContext } from "../context/AppContext";
import { AuthContext } from "../context/AuthContext";
import {
  FaHeart,
  FaRegHeart,
  FaBrain,
  FaMoon,
  FaSun,
  FaLeaf,
  FaFeatherAlt,
  FaWater,
  FaWind,
  FaHeartbeat,
} from "react-icons/fa";

// Swiper imports for mobile carousel
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";

import "swiper/swiper-bundle.css";

// A single, flexible card component that works for both layouts
const PresetCard: React.FC<{
  exercise: BreathingExercise;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  className?: string; // Optional className for grid spanning
}> = ({ exercise, onSelect, isFavorite, onToggleFavorite, className = "" }) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    "just-center": <FaBrain className="text-sky-400" size={56} />,
    "just-sleep": <FaMoon className="text-indigo-400" size={56} />,
    "just-awaken": <FaSun className="text-amber-400" size={56} />,
    "just-release": <FaFeatherAlt className="text-rose-400" size={56} />,
    "just-flow": <FaWater className="text-teal-400" size={56} />,
    "just-balance": <FaWind className="text-slate-400" size={56} />,
    "just-settle": <FaLeaf className="text-emerald-400" size={56} />,
    "just-be": <FaHeartbeat className="text-pink-400" size={56} />,
  };

  return (
    <div
      className={`backdrop-blur-xs relative flex size-full flex-col rounded-2xl border border-slate-700 bg-slate-800/50 p-6 text-center font-quicksand shadow-lg transition-all duration-300 hover:border-sky-400 hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-sky-400 ${className}`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(e);
        }}
        className="absolute right-4 top-4 z-10 p-2 font-quicksand text-rose-400 transition-colors hover:text-rose-300"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? <FaHeart size={22} /> : <FaRegHeart size={22} />}
      </button>

      <div className="flex grow flex-col items-center justify-center space-y-6">
        <div className="font-quicksand text-2xl sm:text-5xl">
          {iconMap[exercise.id]}
        </div>
        <div className="space-y-6">
          <p className="font-quicksand text-sm font-semibold uppercase tracking-wider text-sky-400 sm:text-base">
            {exercise.mood}
          </p>
          <h3 className="font-quicksand text-xl font-bold text-slate-100 sm:text-2xl">
            {exercise.title}
          </h3>
          <p className="mx-auto max-w-[220px] font-quicksand text-sm leading-relaxed text-slate-200/90 sm:text-base">
            {exercise.description}
          </p>
        </div>
      </div>
      <button onClick={onSelect} className="btn btn-primary mb-4 mt-6 w-full">
        Start
      </button>
    </div>
  );
};

const PresetSelectionPage: React.FC = () => {
  const { handleSelectExercise } = useAppLogic();
  const appContext = useContext(AppContext);
  const authContext = useContext(AuthContext);
  const [breathingExercises, setBreathingExercises] = useState<
    BreathingExercise[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const exercises = await getExercises();
        setBreathingExercises(exercises);
      } catch (error) {
        console.error("Failed to load exercises:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExercises();
  }, []);

  // The key prop on Swiper will handle re-initialization when data loads

  if (!appContext) return null;

  const { settings, toggleFavorite } = appContext;

  const favoriteExercises = useMemo(
    () =>
      breathingExercises.filter((ex) =>
        settings.favoriteExercises.includes(ex.id)
      ),
    [settings.favoriteExercises, breathingExercises]
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
    <div className="animate-fade-in flex w-full grow flex-col  justify-center">
      <h1 className="text-center font-quicksand text-4xl font-bold text-slate-200">
        Hi {authContext?.currentUser?.displayName || ""}
      </h1>
      <h2 className="mb-8 text-center  font-quicksand text-lg font-semibold tracking-tighter text-slate-200 md:mt-8">
        Choose Your Session
      </h2>

      {/* Mobile View: 3D Carousel (hidden on medium screens and up) */}
      <div className="h-[60vh] w-full md:hidden">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="font-quicksand text-lg text-slate-400">
              Loading exercises...
            </div>
          </div>
        ) : (
          <Swiper
            key={`swiper-${breathingExercises.length}`} // Force re-render when data loads
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            loop={breathingExercises.length > 1}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 40,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            modules={[EffectCoverflow, Pagination, Navigation]}
            className="size-full"
            onSwiper={() => {
              // Swiper will initialize properly with the key prop
            }}
          >
            {breathingExercises.map((exercise) => (
              <SwiperSlide
                key={exercise.id}
                className="h-full w-3/4 max-w-[280px]"
              >
                <PresetCard
                  exercise={exercise}
                  onSelect={() => handleSelectExercise(exercise)}
                  isFavorite={settings.favoriteExercises.includes(exercise.id)}
                  onToggleFavorite={(e) => handleToggleFavorite(e, exercise.id)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Desktop View: Bento Grid (visible on medium screens and up) */}
      <div className="mx-auto hidden w-full max-w-7xl space-y-8 md:block">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="font-quicksand text-lg text-slate-400">
              Loading exercises...
            </div>
          </div>
        ) : (
          <>
            {favoriteExercises.length > 0 && (
              <div>
                <h3 className="mb-4 pl-2 font-quicksand text-xl font-bold text-slate-200">
                  Favorites
                </h3>
                <div className="grid gap-4 md:auto-rows-fr md:grid-cols-4">
                  {favoriteExercises.map((exercise) => (
                    <div key={`fav-${exercise.id}`} className="md:col-span-1">
                      <PresetCard
                        exercise={exercise}
                        onSelect={() => handleSelectExercise(exercise)}
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
              <h3 className="mb-4 pl-2 font-quicksand text-xl font-bold text-slate-200">
                All Exercises
              </h3>
              <div className="grid gap-4 md:auto-rows-fr md:grid-cols-4">
                {breathingExercises.map((exercise, index) => (
                  <div key={exercise.id} className={bentoLayoutClasses[index]}>
                    <PresetCard
                      exercise={exercise}
                      onSelect={() => handleSelectExercise(exercise)}
                      isFavorite={settings.favoriteExercises.includes(
                        exercise.id
                      )}
                      onToggleFavorite={(e) =>
                        handleToggleFavorite(e, exercise.id)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PresetSelectionPage;
