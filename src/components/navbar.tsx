import { Link, useLocation } from "react-router-dom";
import ProfileBadge from "./profileBadge";

export default function Navbar() {
  const { pathname } = useLocation();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Cart", path: "/cart" },
    { label: "Orders", path: "/orders" },
    { label: "About", path: "/about" },
  ];

  return (
    <>
      <nav className="flex justify-between items-center px-16 py-2 border-b border-gray-800">
        <div className="flex justify-center items-center gap-8 font-medium font-sans">
          {navItems.map((item, index) => {
            const isActive = pathname === item.path;

            return (
              <div
                key={index}
                className={`px-4 py-1 ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } rounded-full`}
              >
                <Link to={item.path}>
                  <p> {item.label} </p>
                </Link>
              </div>
            );
          })}
        </div>

        <div>
            <div className="relative profilebadge rounded-full w-16 h-16 flex justify-center items-center bg-gray-900 cursor-pointer">
                <p className="text-2xl font-bold text-white">
                    S
                </p>
                <ProfileBadge/>
            </div>
        </div>
      </nav>
    </>
  );
}
