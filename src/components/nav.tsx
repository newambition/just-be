import { FaHome, FaUser, FaCog } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

interface NavProps {
  onToggleSettings: () => void;
}

const Nav: React.FC<NavProps> = ({ onToggleSettings }) => {
  const location = useLocation();
  const getIconClasses = (path: string) =>
    `cursor-pointer transition-colors ${
      location.pathname === path
        ? "text-sky-400"
        : "text-slate-400 hover:text-slate-300"
    }`;

  return (
    <div>
      <div className="fixed inset-x-0 bottom-0 mx-auto w-3/4 rounded-t-full bg-slate-900/50 backdrop-blur-md sm:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="mx-auto flex items-center justify-between gap-12">
            <Link to="/">
              <FaHome className={getIconClasses("/")} size={24} />
            </Link>
            <Link to="/history">
              <FaUser className={getIconClasses("/history")} size={24} />
            </Link>
            <FaCog
              className="cursor-pointer text-slate-400 transition-colors hover:text-slate-300"
              size={24}
              onClick={onToggleSettings}
            />
          </div>
        </div>
      </div>

      <div className="h-1/f fixed inset-y-0 left-0 my-auto hidden w-16 rounded-r-2xl bg-slate-900/50 backdrop-blur-md sm:block">
        <div className="flex h-full flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center justify-center gap-12">
            <Link to="/">
              <FaHome className={getIconClasses("/")} size={24} />
            </Link>
            <Link to="/history">
              <FaUser className={getIconClasses("/history")} size={24} />
            </Link>
            <FaCog
              className="cursor-pointer text-slate-400 transition-colors hover:text-slate-300"
              size={24}
              onClick={onToggleSettings}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
