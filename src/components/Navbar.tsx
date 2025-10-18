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
          <img src={logo} alt="logo" className=" w-6 h-6 object-contain" />
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
        </ul>
        <div className="sm:hidden flex flex-1 justify-end items-center">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-[28px] h-[28px] object-contain cursor-pointer"
            onClick={() => setToggle(!toggle)}
          />
          <div
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
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
