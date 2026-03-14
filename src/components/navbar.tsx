import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import ProfileBadge from "./profileBadge";
import { useAppSelector } from "../redux/hooks";

export default function Navbar() {
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState(false);
  const user = useAppSelector(state => state.User.user);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Cart", path: "/cart" },
    { label: "Orders", path: "/orders" },
    { label: "Contact Us", path: "/contact-us" },
    { label: "About", path: "/about" },
  ];

  return (
    <nav className="relative w-full border-b border-gray-800 bg-white">
      <div className="flex justify-between items-center px-4 sm:px-8 lg:px-16 py-3">
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 font-medium font-sans">
          {navItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <div
                key={item.path}
                className={`px-4 py-1 text-sm lg:text-base transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } rounded-full`}
              >
                <Link to={item.path}>{item.label}</Link>
              </div>
            );
          })}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setOpenMenu((prev) => !prev)}>
            {openMenu ? (
              <HiX className="text-2xl" />
            ) : (
              <HiMenu className="text-2xl" />
            )}
          </button>
        </div>

        {/* Profile Badge */}
        <div
          className="relative profilebadge rounded-full 
                        w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 
                        flex justify-center items-center 
                        bg-gray-900 cursor-pointer"
        >
          <p className="text-sm sm:text-lg md:text-xl font-bold text-white">
            { (user as any).name.charAt(0).toUpperCase() }
          </p>
          <ProfileBadge />
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {openMenu && (
        <div className="absolute left-0 top-full w-full md:hidden z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setOpenMenu(false)}
          />

          {/* Menu Panel */}
          <div className="relative bg-white border-t border-gray-200 shadow-lg flex flex-col gap-3 px-4 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpenMenu(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
