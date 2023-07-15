"use client";
import React, { useDeferredValue, useEffect } from "react";
import { useState } from "react";
import { FaHome, FaRocket, FaBars } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { RiMailFill, RiSettings5Fill } from "react-icons/ri";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isSidebarOpen, toggleSidebar }: SidebarProps) => {
  const [active, setActive] = useState("/");
  const [isNavOpen, setIsNavOpen] = useState(isSidebarOpen);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    setIsNavOpen(isSidebarOpen);
  }, [isSidebarOpen]);

  const navHoverEffect = () => {
    if(isSidebarOpen){
      return;
    }
    setHover(!hover);
  };

  const handleNavigate = (path: string) => {
    if(isSidebarOpen){
      return;
    }
    setActive(path);
  };
  return (
    <header
    className={`lg:block h-screen text-slate-700 max-w-[300px] z-50 ${
      isSidebarOpen ? "md:fixed sm:fixed lg:block" : "hidden"
    }`}
  >
    {isSidebarOpen && (
      <div
        className="fixed lg:hidden inset-0 bg-black opacity-50 z-40"
        onClick={toggleSidebar}
      />
    )}
    <nav
      onMouseEnter={navHoverEffect}
      onMouseLeave={navHoverEffect}
      className={`fixed w-auto h-screen bg-slate-200 z-50 ${
        !isNavOpen && !hover
          ? "hover:w-[300px] transition-width ease-in-out duration-300 hover:shadow-xl"
          : "min-w-[300px] hover:shadow-lg"
      }`}>
        <div className="w-full flex items-center justify-between my-4 p-4 gap-2 font-semibold h-16">
          <span className={`${!isNavOpen && !hover && "hidden"} text-xl font-bold`}>Stay Stats</span>
          <span
            className="cursor-pointer"
            onClick={() => {
              console.log("toggle sidebar");
              toggleSidebar();
            }}
          >
            <FaBars size={20} />
          </span>
        </div>
        <div className="flex flex-col items-center justify-between h-screen w-full">
          <ul className=" w-full px-2 flex flex-col gap-4 font-semibold">
            <li
              onClick={() => handleNavigate("/")}
              className={`flex items-center justify-start gap-2 p-2 hover:cursor-pointer  ${
                active === "/"
                  ? "bg-white text-primary hover:none"
                  : "hover:bg-slate-300"
              } rounded-xl`}
            >
              <FaHome size={20} />{" "}
              <p className={`text-sm ${!isNavOpen && !hover && "hidden"}`}>
                Home
              </p>
            </li>
            <li
              onClick={() => handleNavigate("prospects")}
              className={`flex items-center justify-start gap-2 p-2 hover:cursor-pointer ${
                active === "prospects"
                  ? "bg-white text-primary"
                  : "hover:bg-slate-300"
              } rounded-xl`}
            >
              <HiUserGroup size={20} />{" "}
              <p className={`text-sm ${!isNavOpen && !hover && "hidden"}`}>
                Prospects
              </p>
            </li>
            <li
              onClick={() => handleNavigate("campaign")}
              className={`flex items-center justify-start gap-2 p-2 hover:cursor-pointer ${
                active === "campaign"
                  ? "bg-white text-primary"
                  : "hover:bg-slate-300"
              } rounded-xl`}
            >
              <FaRocket size={20} />{" "}
              <p className={`text-sm ${!isNavOpen && !hover && "hidden"}`}>
                Campaigns
              </p>
            </li>
            <li
              onClick={() => handleNavigate("inbox")}
              className={`flex text-center items-center justify-start gap-2 p-2 hover:cursor-pointer ${
                active === "inbox"
                  ? "bg-white text-primary"
                  : "hover:bg-slate-300"
              } rounded-xl`}
            >
              <RiMailFill size={20} />{" "}
              <p className={`text-sm ${!isNavOpen && !hover && "hidden"}`}>
                Inbox
              </p>
            </li>
          </ul>
          <div className="absolute bottom-10 w-full px-2 font-semibold">
            <li
              onClick={() => handleNavigate("settings")}
              className={`flex  items-center justify-start gap-2 p-2 hover:cursor-pointer ${
                active === "settings"
                  ? "bg-white text-primary"
                  : "hover:bg-slate-300"
              } rounded-xl`}
            >
              <RiSettings5Fill size={20} />{" "}
              <p className={`text-sm ${!isNavOpen && !hover && "hidden"}`}>
                Settings
              </p>
            </li>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Sidebar;