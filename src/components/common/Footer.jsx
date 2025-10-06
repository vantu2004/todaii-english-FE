
import LogoLight from '../../assets/landing_page/logo-light.svg';
const Footer = () => {
  return (
    <footer className="bg-[#13183f] py-4">
      <div className='w-[90%] max-w-[1100px] ml-auto mr-auto '>
        <div className="flex justify-between items-center">
          <a href="#">
            <img src={LogoLight} alt="skilled logo light"/>
          </a>
          <a href="#">
            <button className="max-[320px]:w-32 max-[320px]:h-10 max-[320px]:text-[14px] w-40 h-14 text-[18px] bg-gradient-to-b from-[#4851FF] to-[#F02AA6] text-white px-6 py-3 rounded-full font-bold shadow-md hover:opacity-80 transition">
              Get Started
            </button>
          </a>
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;
