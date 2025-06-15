import { HomeIcon, Car, Wrench, Users, Phone, ShoppingCart, Heart, UserIcon } from "lucide-react";
import Index from "./pages/Index";
import Vehicles from "./pages/Vehicles";
import Accessories from "./pages/Accessories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Vehicles",
    to: "/vehicles",
    icon: <Car className="h-4 w-4" />,
    page: <Vehicles />,
  },
  {
    title: "Accessories",
    to: "/accessories",
    icon: <Wrench className="h-4 w-4" />,
    page: <Accessories />,
  },
  {
    title: "About",
    to: "/about",
    icon: <Users className="h-4 w-4" />,
    page: <About />,
  },
  {
    title: "Contact",
    to: "/contact",
    icon: <Phone className="h-4 w-4" />,
    page: <Contact />,
  },
  {
    title: "Auth",
    to: "/auth",
    icon: <UserIcon className="h-4 w-4" />,
    page: <Auth />,
  },
  {
    title: "Profile",
    to: "/profile",
    icon: <UserIcon className="h-4 w-4" />,
    page: <Profile />,
  },
  {
    title: "Not Found",
    to: "*",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <NotFound />,
  },
];
