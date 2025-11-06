import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-[90%] max-w-[1100px] mx-auto mt-4 relative z-[100]">
      <div className="flex justify-between items-center">
        {/* Logo text */}
        <a
          href="/"
          className="text-2xl font-extrabold tracking-tight select-none"
        >
          <span className="text-[#13183f]">Todaii</span>
          <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
            English
          </span>
        </a>

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => navigate("/client/register")}
            className="px-5 py-2.5 rounded-full font-semibold text-white bg-[#13183f] hover:bg-indigo-600 hover:scale-105 transition-all duration-200"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-5 py-2.5 rounded-full font-semibold border border-[#13183f] text-[#13183f] hover:bg-[#13183f] hover:text-white hover:scale-105 transition-all duration-200"
          >
            Dashboard
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#13183f] font-semibold"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="flex flex-col items-center gap-3 mt-4 md:hidden">
          <button
            onClick={() => {
              navigate("/client/register");
              setOpen(false);
            }}
            className="w-[80%] py-2 rounded-full font-semibold text-white bg-[#13183f] hover:bg-indigo-600 hover:scale-105 transition-all duration-200"
          >
            Get Started
          </button>
          <button
            onClick={() => {
              navigate("/admin/dashboard");
              setOpen(false);
            }}
            className="w-[80%] py-2 rounded-full font-semibold border border-[#13183f] text-[#13183f] hover:bg-[#13183f] hover:text-white hover:scale-105 transition-all duration-200"
          >
            Dashboard
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
