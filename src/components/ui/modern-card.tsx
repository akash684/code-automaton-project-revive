
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function ModernCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: "0 12px 32px 0 rgba(15,61,145,0.13)" }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`rounded-2xl border p-4 bg-card text-foreground transition-shadow hover:shadow-lg ${className}`}
    >
      {children}
    </motion.div>
  );
}
