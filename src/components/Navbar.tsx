import { useState } from "react";

import { Link } from "react-router-dom";
import styles from "../styles";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";
const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  // mx-auto 14
  return (
    <nav
      className={`${styles.styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 bg-primary border-b border-blue-900/50 backdrop-blur-sm`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <img src={logo} alt="Luis Ortiz - Software Engineer logo" className=" w-6 h-6 object-contain" />
          <p className="text-white text-[18px] font-bold cursor-pointer flex">
            Luis &nbsp;{" "}
            <span className="sm:block hidden"> | Software Engineer</span>
          </p>
        </Link>
        <ul className="list-none hidden sm:flex flex-row gap-10">
          {navLinks.map((link: any) => (
            <li
              key={link.id}
              className={`${
                active === link.title ? "text-white border-b-2 border-blue-400" : "text-secondary"
              } hover:text-blue-400 text-[18px] font-medium cursor-pointer transition-all duration-300 pb-1`}
              onClick={() => setActive(link.title)}
            >
              <a href={`#${link.id}`}>{link.title}</a>
            </li>
          ))}
          <li className="text-secondary hover:text-blue-400 text-[18px] font-medium transition-all duration-300 pb-1">
            <a
              href="/resume.pdf"
              download="Luis_Ortiz_Resume.pdf"
              className="flex items-center gap-2"
              onClick={() => {
                // Optional: Track download event
                console.log('Resume downloaded');
              }}
            >
              Resume
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </a>
          </li>
        </ul>
        <div className="sm:hidden flex flex-1 justify-end items-center">
          <button
            onClick={() => setToggle(!toggle)}
            className="w-[44px] h-[44px] flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
            aria-label={toggle ? "Close menu" : "Open menu"}
            aria-expanded={toggle}
            aria-controls="mobile-menu"
          >
            <img
              src={toggle ? close : menu}
              alt=""
              className="w-[28px] h-[28px] object-contain"
            />
          </button>
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 bg-gradient-to-br from-tertiary to-black-100 border border-blue-900/50 absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl shadow-lg shadow-blue-900/50`}
          >
            <ul className="list-none flex justify-end items-start flex-col gap-4">
              {navLinks.map((link: any) => (
                <li
                  key={link.id}
                  className={`${
                    active === link.title ? "text-white" : "text-secondary"
                  } font-poppins font-medium cursor-pointer text-[16px] hover:text-blue-400 transition-colors duration-300`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(link.title);
                  }}
                >
                  <a href={`#${link.id}`}>{link.title}</a>
                </li>
              ))}
              <li className="text-secondary font-poppins font-medium cursor-pointer text-[16px] hover:text-blue-400 transition-colors duration-300">
                <a
                  href="/resume.pdf"
                  download="Luis_Ortiz_Resume.pdf"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setToggle(!toggle);
                    console.log('Resume downloaded');
                  }}
                >
                  Resume
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
