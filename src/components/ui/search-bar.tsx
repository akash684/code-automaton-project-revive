
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-md px-3 py-2 shadow border">
      <Search className="w-5 h-5 text-gray-400" />
      <Input
        className="w-full bg-transparent outline-none border-0 shadow-none focus:ring-0"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
      />
    </div>
  );
}
