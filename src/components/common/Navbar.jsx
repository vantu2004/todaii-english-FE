import LogoDark from '../../assets/landing_page/logo-dark.svg';
const Navbar = () => {
  return (
    <nav className="w-[90%] max-w-[1100px] ml-auto mr-auto ">
      <div className="flex justify-between items-center mt-4">
        <a href="#">
          <img src={LogoDark} alt="skilled logo" className="mt-[1rem]" />
        </a>
        <a href="#">
          <button className="max-[320px]:w-32 max-[320px]:h-10 max-[320px]:text-[14px]  font-bold text-white text-[18px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] w-[167px] h-[56px] bg-[#13183f] rounded-[28px] hover:opacity-80 transition">
            Get Started
          </button>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
