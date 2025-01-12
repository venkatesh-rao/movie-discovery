import { Movie, POSTER_IMAGE_PLACEHOLDER, getImageUrl } from '@/lib/tmdb';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface MovieCardProps {
  movie: Movie;
  shouldLazyLoad?: boolean;
}

export function MovieCard({ movie, shouldLazyLoad = true }: MovieCardProps) {
  const releaseYear = new Date(movie.release_date).getFullYear();
  const rating = movie.vote_average.toFixed(1);
  const posterPath = getImageUrl(movie.poster_path);
  return (
    <Link to={`/movie/${movie.id}`}>
      <Card className="group overflow-hidden transition-transform hover:scale-105">
        <div className="relative aspect-[2/3]">
          <img
            src={posterPath || POSTER_IMAGE_PLACEHOLDER}
            alt={movie.title}
            className={clsx("h-full w-full", posterPath ? "object-cover" : "object-contain p-20 bg-slate-50")}
            loading={!shouldLazyLoad ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity group-hover:opacity-100">
            <p className="line-clamp-2 text-sm">{movie.overview}</p>
          </div>
        </div>
        <CardContent className="p-4">
          <h2 className="line-clamp-1 text-lg font-semibold">{movie.title}</h2>
          <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
            <span>{releaseYear}</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{rating}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}