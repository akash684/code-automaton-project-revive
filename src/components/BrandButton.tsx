
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Usage: <BrandButton>Primary Action</BrandButton>
 */
export const BrandButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      // Brand look
      "bg-accent text-white px-6 py-3 rounded-2xl font-heading font-bold transition-all shadow-md hover:shadow-lg hover:bg-[#FF8126] focus:ring-2 focus:ring-accent focus:ring-offset-2 active:scale-95",
      "text-base flex items-center justify-center gap-2",
      className
    )}
    {...props}
  />
));
BrandButton.displayName = "BrandButton";
