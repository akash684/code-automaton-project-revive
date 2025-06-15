
/**
 * Example Background Section for Home Hero
 * Style: blurred overlay, big font, strong primary/contrast
 */
import * as React from "react";
type Props = { imgUrl?: string; children?: React.ReactNode };
export const HomeHeroBg = ({ imgUrl, children }: Props) => (
  <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-[#0D47A1]/60 to-[#232323]/70 overflow-hidden">
    <img
      src={
        imgUrl ||
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600"
      }
      alt="AutoBazaar India Hero"
      className="absolute inset-0 w-full h-full object-cover z-0"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-[#0D47A1]/60 z-10" />
    <div className="relative z-20 w-full flex justify-center px-2">
      <div className="w-full max-w-3xl text-center text-white py-20">
        {children}
      </div>
    </div>
  </section>
);
