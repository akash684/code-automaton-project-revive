
import * as React from "react";
import { cn } from "@/lib/utils";
type BrandCardProps = { children: React.ReactNode; className?: string };
/** Usage: <BrandCard> ... </BrandCard> */
export const BrandCard = ({ children, className }: BrandCardProps) => (
  <div
    className={cn(
      "rounded-2xl bg-white shadow-md hover:shadow-lg transition-all p-6",
      className
    )}
  >
    {children}
  </div>
);
