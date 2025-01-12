import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
  getMovieReviews,
  getImageUrl,
  POSTER_IMAGE_PLACEHOLDER,
} from '@/lib/tmdb';
import { MovieGrid } from '@/components/MovieGrid';
import { Button } from '@/components/ui/button';
import {
  Clock,
  Calendar,
  Star,
  Users,
  ArrowLeft,
  Loader2,
  MessageSquare,
  Film,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import clsx from 'clsx';

export function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: movie, status } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieDetails(Number(id)),
  });

  const { data: credits } = useQuery({
    queryKey: ['credits', id],
    queryFn: () => getMovieCredits(Number(id)),
    enabled: !!movie,
  });

  const { data: similar } = useQuery({
    queryKey: ['similar', id],
    queryFn: () => getSimilarMovies(Number(id)),
    enabled: !!movie,
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getMovieReviews(Number(id)),
    enabled: !!movie,
  });

  if (status === 'pending') {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-destructive">Error loading the movie details</p>
      </div>
    );
  }

  const posterPath = getImageUrl(movie.poster_path);

  return (
    <div className="space-y-12 pb-12 min-h-screen">
      <div className="relative min-h-[11rem] md:min-h-[22rem]">

        <div 
          className="hidden md:block absolute inset-0 h-[22rem]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(31.5, 31.5, 31.5, 1) calc((50vw - 170px) - 340px), rgba(31.5, 31.5, 31.5, 0.84) 50%, rgba(31.5, 31.5, 31.5, 0.84) 100%), url(${getImageUrl(movie.backdrop_path, 'original')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
          }}
        />
        <div 
          className="md:hidden absolute inset-0 h-[11rem]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(10, 10, 10, 1) 10%, rgba(31.5, 31.5, 31.5, 0.3) 50%, rgba(31.5, 31.5, 31.5, 0.3) 100%), url(${getImageUrl(movie.backdrop_path, 'original')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
          }}
        />

        <Button
          onClick={() => navigate(-1)}
          className="hidden md:block absolute top-4 left-4 z-10 p-2 rounded-full bg-black/0 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </Button>
        
        <div className="flex flex-col md:flex-row md:space-x-6 relative pt-6 md:pt-12 z-10 container mx-auto px-4">
          <div className='flex space-x-2 md:space-x-0'>
            <img
              src={posterPath || POSTER_IMAGE_PLACEHOLDER}
              alt={movie.title}
              className={clsx("bg-slate-50 rounded-lg max-h-32 md:max-h-64", { "p-16 h-64 w-48 opacity-50": !posterPath })}
              loading='eager'
            />
          </div>
          <div className="mt-12 md:mt-0 space-y-4 md:flex-1">
            <h1 className="text-3xl md:text-4xl font-bold md:text-white">{movie.title}</h1>
            <div className="flex flex-wrap gap-4 md:text-slate-200">
              {movie.release_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(movie.release_date), 'yyyy')}</span>
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{movie.runtime} min</span>
                </div>
              )}
              {movie.vote_average > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              )}
            </div>
            <p className="md:text-slate-200">{movie.overview}</p>
            <div className='flex flex-wrap gap-2'>
              {movie.genres.map(genre => (
                <div key={genre.id} className='px-4 py-1 bg-black/5 md:bg-white/10 rounded-full text-sm md:text-white'>{genre.name}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='container mx-auto px-4 space-y-12'>
        {credits && credits.cast.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <h2 className="text-2xl font-semibold">Cast</h2>
            </div>
            <div className="relative">
              <div className="space-x-4 flex items-start overflow-auto cast-container pb-4">
                {credits.cast.slice(0, 10).map((person) => (
                  <div key={person.id} className="flex items-center space-x-4 shrink-0 pr-4 bg-slate-100 rounded-md">
                    <Avatar className='w-20 h-20 rounded-md rounded-r-none'>
                      {person.profile_path ? (
                        <AvatarImage
                          src={getImageUrl(person.profile_path, 'w200')}
                          alt={person.name}
                          className='object-cover'
                        />
                      ) : (
                        <AvatarFallback className='font-bold'>
                          {person.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className='flex flex-col'>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {person.character}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            </div>
          </div>
        )}
        {credits && credits.crew.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Film className="h-5 w-5" />
              <h2 className="text-2xl font-semibold">Crew</h2>
            </div>
            <div className="relative">
              <div className="space-x-4 flex items-start overflow-auto cast-container pb-4">
                {credits.crew.slice(0, 10).map((person) => (
                  <div key={person.id} className="flex items-center space-x-4 shrink-0 pr-4 bg-slate-100 rounded-md">
                    <Avatar className='w-20 h-20 rounded-md rounded-r-none'>
                      {person.profile_path ? (
                        <AvatarImage
                          src={getImageUrl(person.profile_path, 'w200')}
                          alt={person.name}
                          className='object-cover'
                        />
                      ) : (
                        <AvatarFallback className='font-bold'>
                          {person.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className='flex flex-col'>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {person.job}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            </div>
          </div>
        )}
        {reviews && reviews.results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h2 className="text-2xl font-semibold">User Reviews</h2>
            </div>
            <div className="space-y-6">
              {reviews.results.slice(0, 5).map((review) => (
                <div key={review.id} className="space-y-2 border-b pb-6">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={
                          review.author_details.avatar_path
                            ? getImageUrl(review.author_details.avatar_path, 'w200')
                            : undefined
                        }
                        alt={review.author}
                      />
                      <AvatarFallback>
                        {review.author.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.author}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {review.author_details.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{review.author_details.rating}</span>
                          </div>
                        )}
                        <span>•</span>
                        <time>
                          {format(new Date(review.created_at), 'MMM d, yyyy')}
                        </time>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-800 line-clamp-2" dangerouslySetInnerHTML={{ __html: review.content }} />
                </div>
              ))}
            </div>
          </div>
        )}
        {similar && similar.results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Similar Movies</h2>
            <MovieGrid movies={similar.results.slice(0, 5)} />
          </div>
        )}
      </div>
    </div>
  );
}