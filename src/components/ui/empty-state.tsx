
import { Button } from "@/components/ui/button";

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center gap-4 text-center">
      <img src="/placeholder.svg" alt="" className="w-16 h-16 mb-2 opacity-40" />
      <div className="text-xl font-medium text-gray-600">No results found</div>
      <Button variant="outline" onClick={onReset}>Reset Filters</Button>
    </div>
  );
}
