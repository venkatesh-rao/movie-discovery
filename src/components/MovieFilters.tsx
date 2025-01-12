import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DualRangeSlider } from '@/components/ui/dual-range-slider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { MovieFilters as MovieFiltersType } from '@/lib/types';
import { MOVIE_GENRES } from '@/lib/types';
import { SlidersHorizontal, X } from 'lucide-react';
import { useMemo } from 'react';

interface MovieFiltersProps {
  filters: Partial<MovieFiltersType>;
  onFiltersChange: (filters: Partial<MovieFiltersType>) => void;
}

export function MovieFilters({ filters: _filters, onFiltersChange }: MovieFiltersProps) {
  const filters = useMemo(() => ({
    genres: _filters.genres || [],
    year: _filters.year || null,
    rating: _filters.rating || { min: 0, max: 10 },
  }), [_filters]);

  const handleGenreToggle = (genreId: number) => {
    const newGenres = filters.genres?.includes(genreId)
      ? filters.genres?.filter((id) => id !== genreId)
      : [...(filters.genres || []), genreId];
    onFiltersChange({ ...filters, genres: newGenres });
  };

  const handleYearChange = (year: number | null) => {
    onFiltersChange({ ...filters, year });
  };
  
  const handleClearFilters = () => onFiltersChange({})

  const handleRatingChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      rating: { min: value[0], max: value[1] },
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => currentYear - i
  );

  const hasFilters = filters.genres.length > 0 || filters.year || filters.rating.min > 0;

  const filtersCount = filters.genres.length +
    (filters.year ? 1 : 0) +
    (filters.rating.min > 0 ? 1 : 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={hasFilters ? "default" : "outline"} className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasFilters && (
            <Badge variant="secondary" className="ml-2 rounded-sm px-1">
              {filtersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      {hasFilters && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className='bg-transparent hover:bg-transparent -ml-4 p-2' onClick={handleClearFilters}>
                <X />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear filters</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <SheetContent className="w-[300px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Refine your movie search with these filters
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {MOVIE_GENRES.map((genre) => (
                <Button
                  key={genre.id}
                  variant={filters.genres.includes(genre.id) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleGenreToggle(genre.id)}
                >
                  {genre.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Release Year</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filters.year === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleYearChange(null)}
              >
                All Years
              </Button>
              {years.slice(0, 10).map((year) => (
                <Button
                  key={year}
                  variant={filters.year === year ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleYearChange(year)}
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Rating</h3>
            <div className="px-2 pt-6">
              <DualRangeSlider
                min={0}
                max={10}
                step={0.5}
                value={[filters.rating.min, filters.rating.max]}
                onValueChange={handleRatingChange}
                formatValue={(v) => v.toFixed(1)}
                className="py-4"
              />
            </div>
          </div>

          {(filters.genres.length > 0 ||
            filters.year ||
            filters.rating.min > 0) && (
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleClearFilters}
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
        </div>
      </SheetContent>
    </Sheet>
  );
} 