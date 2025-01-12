import { Movie } from '@/lib/tmdb';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie, index) => (
        <MovieCard key={movie.id} movie={movie} shouldLazyLoad={index >= 8} />
      ))}
    </div>
  );
}