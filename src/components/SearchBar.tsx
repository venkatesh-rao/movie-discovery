import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onSearch: (query: string) => void;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onSearch, onChange }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim()); // Remove the condition to allow empty searches
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search movies..."
        className="w-full pl-9"
        type='search'
      />
    </form>
  );
}