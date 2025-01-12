import { useInfiniteQuery } from '@tanstack/react-query';
import { discoverMovies, getPopularMovies, searchMovies } from '@/lib/tmdb';
import { MovieGrid } from '@/components/MovieGrid';
import { SearchBar } from '@/components/SearchBar';
import { Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { MovieFilters } from '@/components/MovieFilters';
import type { MovieFilters as MovieFiltersType } from '@/lib/types';
import { useDebounce } from '@/hooks/useDebounce';

export function Home() {
  const { ref, inView } = useInView();
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);
  const [filters, setFilters] = useState<Partial<MovieFiltersType>>({});
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['movies', debouncedSearch, filters],
    queryFn: ({ pageParam = 1 }) => {
      const params = {
        page: pageParam,
        with_genres: filters.genres?.join(','),
        year: filters.year || undefined,
        'vote_average.gte': filters.rating?.min,
        'vote_average.lte': filters.rating?.max,
      };

      if (debouncedSearch) {
        return searchMovies(debouncedSearch, params.page);
      } else if (Object.keys(filters).length > 0) {
        return discoverMovies(params);
      } else {
        return getPopularMovies(params.page);
      }
    },
    getNextPageParam: (lastPage, pages) =>
      pages.length < lastPage.total_pages ? pages.length + 1 : undefined,
    initialPageParam: 1
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const handleSearch = (query: string) => {
    setSearchInput(query);
  };

  const movies = data?.pages.flatMap((page) => page.results) || [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-screen">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">
          {debouncedSearch ? 'Search Results' : 'Popular Movies'}
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchInput}
              onSearch={handleSearch}
              onChange={setSearchInput}
            />
          </div>
          <MovieFilters filters={filters} onFiltersChange={setFilters} />
        </div>
      </div>
      
      {status === 'pending' ? (
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : status === 'error' ? (
        <div className="flex h-96 items-center justify-center">
          <p className="text-destructive">Error loading movies</p>
        </div>
      ) : (
        <>
          {movies.length > 0 ? (
            <MovieGrid movies={movies} />
          ) : (
            <div className="flex h-96 items-center justify-center">
              <p className="text-muted-foreground">No movies found</p>
            </div>
          )}
        </>
      )}
      <div className="flex justify-center" ref={ref}>
        {isFetchingNextPage && (
          <Loader2 className="h-8 w-8 animate-spin" />
        )}
      </div>
    </div>
  );
}