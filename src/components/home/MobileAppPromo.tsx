
import { Button } from "@/components/ui/button";
import { Apple, Play } from "lucide-react";

export default function MobileAppPromo() {
  return (
    <section className="py-20 flex flex-wrap md:flex-nowrap items-center gap-10 justify-center">
      <div className="flex-1 flex flex-col max-w-lg">
        <h2 className="text-3xl font-bold mb-4">Get Our Mobile App</h2>
        <p className="text-lg text-blue-100 mb-7">
          Book, rent, or buy vehicles and accessories on the go! Download AutoMart for seamless experience and instant notifications.
        </p>
        <div className="flex gap-3">
          <Button className="bg-black text-white px-6 text-lg rounded-lg flex gap-2 shadow-xl">
            <Play className="w-6 h-6" />
            Play Store
          </Button>
          <Button className="bg-white text-black px-6 text-lg rounded-lg flex gap-2 shadow-xl">
            <Apple className="w-6 h-6" />
            App Store
          </Button>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center">
        {/* App Mockup */}
        <div className="relative w-[230px] h-[470px] rounded-[2.2rem] bg-gradient-to-br from-blue-900/80 to-purple-800/90 shadow-2xl glass morph pt-6 pb-2 px-3">
          <div className="absolute left-1/2 -translate-x-1/2 top-1 bg-slate-300/80 w-24 h-1 rounded-lg" />
          <img src="https://ui8-fc-assets.imgix.net/app-mockup-multicolor.png?w=600" alt="App mockup" className="w-full h-full object-contain rounded-[1.7rem]" />
        </div>
      </div>
    </section>
  );
}
