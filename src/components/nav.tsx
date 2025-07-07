import { FaHome, FaUser, FaCog } from "react-icons/fa";

const Nav = () => {
  return (
    <div>
      <div className="sm:hidden fixed bottom-0 left-0 right-0 w-3/4 mx-auto bg-slate-900/50 backdrop-blur-md border-t border-slate-700 rounded-t-full">
        <div className="flex justify-between items-center p-4">
          <div className="flex justify-between items-center gap-12  mx-auto">
            <FaHome
              className="text-slate-400 hover:text-slate-300 transition-colors"
              size={24}
            />
            <FaUser
              className="text-slate-400 hover:text-slate-300 transition-colors"
              size={24}
            />
            <FaCog
              className="text-slate-400 hover:text-slate-300 transition-colors"
              size={24}
            />
          </div>
        </div>
      </div>

      <div className="hidden sm:block fixed  top-0 left-0  right-0 w-1/2 mx-auto bg-slate-900/50 backdrop-blur-md border-t border-slate-700">
        <div className="flex-row justify-between items-center p-4 w-3/4 mx-auto">
          <div className="flex justify-between items-center gap-4  mx-auto">
            <FaHome
              className="text-slate-400 hover:text-slate-300 transition-colors"
              size={24}
            />
            <FaUser
              className="text-slate-400 hover:text-slate-300 transition-colors"
              size={24}
            />
            <FaCog
              className="text-slate-400 hover:text-slate-300 transition-colors"
              size={24}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
