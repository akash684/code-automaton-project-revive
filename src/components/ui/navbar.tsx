
import { Link } from "react-router-dom";
import { Sun, Moon, Car, ShoppingCart } from "lucide-react";
import { useState } from "react";

export function Navbar({ onToggleDark }: { onToggleDark: () => void }) {
  const [dark, setDark] = useState(false);

  const handleToggleDark = () => {
    setDark((d) => !d);
    onToggleDark();
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/70 dark:bg-gray-950/70 backdrop-blur-md shadow flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
      <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-blue-700 dark:text-blue-200 tracking-tight">
        <Car className="w-7 h-7" />
        AutoMart
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/vehicles" className="hover:underline underline-offset-8">
          Vehicles
        </Link>
        <Link to="/accessories" className="hover:underline underline-offset-8">
          Accessories
        </Link>
        <Link to="/cart" className="relative">
          <ShoppingCart className="w-6 h-6" />
        </Link>
        <button
          onClick={handleToggleDark}
          className="ml-2 rounded-full hover:bg-blue-100 dark:hover:bg-gray-800 p-2 transition"
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <Sun /> : <Moon />}
        </button>
      </div>
    </nav>
  );
}
