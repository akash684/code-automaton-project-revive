
import HeroSection from "@/components/home/HeroSection";
import VehicleSearchPanel from "@/components/home/VehicleSearchPanel";
import TrendingVehiclesCarousel from "@/components/home/TrendingVehiclesCarousel";
import AccessoriesHighlights from "@/components/home/AccessoriesHighlights";
import VehicleComparison from "@/components/home/VehicleComparison";
import TrustSection from "@/components/home/TrustSection";
import MobileAppPromo from "@/components/home/MobileAppPromo";

export default function Home() {
  return (
    <div className="bg-gradient-to-tr from-blue-950 via-gray-900 to-black min-h-screen text-white transition-colors duration-300">
      <HeroSection />
      <div className="container mx-auto px-2 -mt-12 relative z-20">
        <VehicleSearchPanel />
        <TrendingVehiclesCarousel />
        <AccessoriesHighlights />
        <VehicleComparison />
        <TrustSection />
        <MobileAppPromo />
      </div>
    </div>
  );
}
