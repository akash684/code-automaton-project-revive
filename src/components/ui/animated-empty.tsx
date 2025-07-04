import { motion } from "framer-motion";
import { Button } from "./button";

export function AnimatedEmpty({ message = "No items found.", onReset }: { message?: string; onReset?: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-60 gap-4 bg-card text-foreground rounded-2xl shadow-md border border-border"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <img src="/placeholder.svg" alt="" className="w-16 h-16 mb-2 opacity-40" />
      <span className="text-lg font-semibold text-muted">{message}</span>
      {onReset && (
        <Button variant="outline" className="mt-2" onClick={onReset}>
          Reset Filters
        </Button>
      )}
    </motion.div>
  );
}
