import React from "react";

const SplashScreen: React.FC = () => {
  return (
    <div className="mx-auto flex h-dvh w-full flex-col items-center justify-center bg-slate-900">
      <div className="logo-animate transition-all duration-700  ease-in-out">
        <img src="/all.png" alt="Just Be" className="mx-auto mb-4 size-16 " />
      </div>
    </div>
  );
};

export default SplashScreen;
