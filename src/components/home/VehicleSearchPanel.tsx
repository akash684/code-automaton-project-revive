
import { useState } from "react";
import { SearchBar } from "@/components/ui/search-bar";
import { Button } from "@/components/ui/button";
import { Car, Bike, Search, ChevronDown } from "lucide-react";

export default function VehicleSearchPanel() {
  const [query, setQuery] = useState("");
  // Placeholder for filters (to expand)
  return (
    <div className="z-30 w-full max-w-3xl mx-auto bg-white/20 dark:bg-black/40 shadow-xl backdrop-blur-lg rounded-2xl p-5 flex flex-col md:flex-row items-center gap-4 -mt-20 mb-12 sticky top-4 border border-white/10">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Find cars, bikes, or models (e.g. Nexon EV, Duke)"
      />
      <Button variant="secondary" className="rounded-lg px-4 bg-blue-500/20 hover:bg-blue-600/30 flex gap-2 border border-blue-400/10">
        <Car className="w-5 h-5" />
        Cars
        <ChevronDown className="w-4 h-4" />
      </Button>
      <Button variant="secondary" className="rounded-lg px-4 bg-purple-500/20 hover:bg-purple-600/30 flex gap-2 border border-purple-400/10">
        <Bike className="w-5 h-5" />
        Bikes
        <ChevronDown className="w-4 h-4" />
      </Button>
      <Button className="rounded-lg px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold drop-shadow">
        <Search className="w-5 h-5 mr-1" /> Search
      </Button>
    </div>
  );
}
