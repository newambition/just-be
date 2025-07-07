import React from "react";

const SplashScreen: React.FC = () => {
  return (
    <div className="flex mx-auto h-dvh w-full flex-col items-center justify-center bg-primary">
      <div className="animate-pulse transition-all duration-500 ease-out">
        {/* You could place a logo or an icon here */}
        <p className="text-neutral text-xl font-quicksand">
          Just Be Breathing ... 🌿
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
