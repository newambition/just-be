import { FaHome, FaUser, FaCog } from "react-icons/fa";

interface NavProps {
  activePage: "home" | "history";
  onNavigate: (page: "home" | "history") => void;
  onToggleSettings: () => void;
}

const Nav: React.FC<NavProps> = ({
  activePage,
  onNavigate,
  onToggleSettings,
}) => {
  const getIconClasses = (page: "home" | "history") =>
    `cursor-pointer transition-colors ${
      activePage === page
        ? "text-sky-400"
        : "text-slate-400 hover:text-slate-300"
    }`;

  return (
    <div>
      <div className="sm:hidden fixed bottom-0 left-0 right-0 w-3/4 mx-auto bg-slate-900/50 backdrop-blur-md rounded-t-full">
        <div className="flex justify-between items-center p-4">
          <div className="flex justify-between items-center gap-12 mx-auto">
            <FaHome
              className={getIconClasses("home")}
              size={24}
              onClick={() => onNavigate("home")}
            />
            <FaUser
              className={getIconClasses("history")}
              size={24}
              onClick={() => onNavigate("history")}
            />
            <FaCog
              className="text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
              size={24}
              onClick={onToggleSettings}
            />
          </div>
        </div>
      </div>

      <div className="hidden sm:block fixed top-0 left-0 bottom-0 h-1/4 my-auto w-16 bg-slate-900/50 backdrop-blur-md rounded-r-2xl">
        <div className="flex flex-col h-full justify-center items-center p-4">
          <div className="flex flex-col justify-center items-center gap-12">
            <FaHome
              className={getIconClasses("home")}
              size={24}
              onClick={() => onNavigate("home")}
            />
            <FaUser
              className={getIconClasses("history")}
              size={24}
              onClick={() => onNavigate("history")}
            />
            <FaCog
              className="text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
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
