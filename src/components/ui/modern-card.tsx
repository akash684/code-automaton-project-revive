
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export function ModernCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: "0 12px 32px 0 rgba(13,71,161,0.13)" }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`rounded-2xl shadow-lg bg-white/70 dark:bg-gray-900/50 backdrop-blur-lg border border-blue-100 dark:border-gray-800 ${className}`}
    >
      {children}
    </motion.div>
  );
}
