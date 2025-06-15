
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import heroImg from "/lovable-uploads/4605de8a-f1a2-408b-83a7-6687db4469f0.png";
import { Link } from "react-router-dom";

const bgVideo =
  "https://assets.mixkit.co/videos/preview/mixkit-driving-on-a-mountain-road-1504-large.mp4"; // Stock drone shot fallback

export default function HeroSection() {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      <video 
        className="absolute inset-0 w-full h-full object-cover z-0 brightness-50" 
        src={bgVideo}
        autoPlay
        playsInline
        loop
        muted
        poster={heroImg}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] z-10" />
      <div className="relative z-20 flex flex-col md:flex-row items-center justify-between max-w-6xl w-full mx-auto h-full px-4">
        <div className="flex-1 flex flex-col justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-extrabold text-4xl md:text-6xl leading-tight mb-4 font-poppins drop-shadow-2xl"
          >
            Drive Your Dream <span className="text-blue-400">—</span><br />
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Rent or Own, the Smart Way</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8 text-lg text-slate-200 font-medium max-w-xl"
          >
            India’s #1 platform for cars, bikes, and all the rides you love—buy, rent, or accessorize in seconds.
          </motion.p>
          <div className="flex gap-4">
            <Link to="/vehicles">
              <Button size="lg" className="bg-gradient-to-r from-blue-700 to-purple-600 shadow-xl text-lg px-8 py-4 font-bold rounded-full animate-fade-in hover:scale-105 transition">
                <Car className="mr-2" /> Browse Vehicles
              </Button>
            </Link>
            <Link to="/accessories">
              <Button size="lg" variant="outline" className="border-white/50 bg-white/10 text-white px-8 py-4 rounded-full hover:bg-white/20 font-bold shadow-xl animate-fade-in">
                Explore Accessories
              </Button>
            </Link>
          </div>
        </div>
        <motion.div
          className="hidden md:block flex-1 flex justify-end h-full ml-8"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <img
            src={heroImg}
            alt="Car on mountain road"
            className="rounded-3xl shadow-2xl w-[420px] h-auto object-contain glass morph"
            loading="eager"
            style={{ border: "3px solid rgba(255,255,255,.05)" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
