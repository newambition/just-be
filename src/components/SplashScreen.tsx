import React from "react";

const SplashScreen: React.FC = () => {
  return (
    <div className="flex mx-auto h-dvh w-full flex-col items-center justify-center bg-primary">
      <div className="logo-animate transition-all duration-700  ease-in-out">
        {/* You could place a logo or an icon here */}
        <img src="/all.png" alt="Just Be" className="w-16 h-16 mx-auto mb-4 " />
      </div>
    </div>
  );
};

export default SplashScreen;
