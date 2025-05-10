import { useEffect, useState } from "react";
import { FaLinkedinIn } from "react-icons/fa";
import { TbLanguage } from "react-icons/tb";
import logo from "/logo.webp";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setIsVisible(currentScrollY <= lastScrollY);
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-white z-50 transition-transform duration-300 shadow-md ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between p-5">
        <img src={logo} alt="Logo" className="h-10 w-auto" />

        <div className="items-center space-x-8 hidden lg:flex">
          <button className="bg-[#5CD6FF] hover:bg-[#5CD6FF70] text-black font-regular py-2 px-7 rounded-full">
            Contact Us
          </button>
          <SocialLink
            href="https://www.linkedin.com"
            icon={<FaLinkedinIn size={20} />}
          />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

const SocialLink = ({ href, icon }: SocialLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-700 hover:text-blue-600"
  >
    {icon}
  </a>
);

const LanguageSwitcher = () => (
  <button className="text-gray-700 hover:text-blue-600 flex items-center gap-2 font-bold">
    <TbLanguage size={20} />
    ENG
  </button>
);

export default Header;
