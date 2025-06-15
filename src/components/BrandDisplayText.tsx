
import * as React from "react";
import { cn } from "@/lib/utils";
type Props = { children: React.ReactNode; className?: string };
/** Usage: <BrandDisplayText>Main Hero Title</BrandDisplayText> */
export const BrandDisplayText = ({ children, className }: Props) => (
  <h1 className={cn(
    "font-heading uppercase text-display tracking-tight text-[--primary] text-balance",
    className
  )}>
    {children}
  </h1>
);
