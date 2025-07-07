import React from "react";
import type { BreathingExercise } from "../types";
import { breathingExercises } from "../data/exercises";

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
  className?: string; // Optional className for grid spanning
}> = ({ exercise, onSelect, className = "" }) => {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/50 p-6 text-center backdrop-blur-xs shadow-lg transition-all duration-300 hover:border-sky-400 hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-sky-400 ${className}`}
    >
      <div className="mb-12">{exercise.icon}</div>
      <div className="flex flex-col">
        <p className="font-semibold uppercase tracking-wider text-sky-400">
          {exercise.mood}
        </p>
        <h3 className="mt-2 text-xl font-bold text-slate-100">
          {exercise.title}
        </h3>
        <p className="mt-4 text-sm text-slate-200/90">{exercise.description}</p>
      </div>
      <button onClick={onSelect} className="btn btn-primary mt-12">
        Start
      </button>
    </div>
  );
};

const PresetSelectionPage: React.FC<PresetSelectionProps> = ({
  onSelectExercise,
}) => {
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

  return (
    <div className="w-full flex-grow flex flex-col justify-center  animate-fade-in">
      <img
        src="/just-beLogo.png"
        alt="Just Be"
        className="w-24 h-24 mx-auto -mt-24 mb-4 md:mt-8 md:ml-2"
      />
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
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop View: Bento Grid (visible on medium screens and up) */}
      <div className="hidden md:block w-full max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 md:auto-rows-fr gap-4">
          {breathingExercises.map((exercise, index) => (
            <div key={exercise.id} className={bentoLayoutClasses[index]}>
              <PresetCard
                exercise={exercise}
                onSelect={() => onSelectExercise(exercise)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PresetSelectionPage;
