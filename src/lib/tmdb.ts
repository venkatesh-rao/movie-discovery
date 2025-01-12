import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const POSTER_IMAGE_PLACEHOLDER = "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg";

export const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getImageUrl = (path: string, size: 'w200' | 'w300' | 'w500' | 'original' = 'w300') =>
  path ? `${IMAGE_BASE_URL}/${size}${path}` : undefined;

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string; logo_path: string }[];
  budget: number;
  revenue: number;
  status: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string;
}

export interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details: {
    rating: number;
    avatar_path: string | null;
    username: string;
  };
}

interface MovieParams {
  page: number;
  with_genres?: string;
  year?: number;
  'vote_average.gte'?: number;
  'vote_average.lte'?: number;
}

export const getPopularMovies = async (page: MovieParams['page']) => {
  const response = await tmdbApi.get<{ results: Movie[]; total_pages: number }>(
    '/movie/popular',
    { params: { page } }
  );
  return response.data;
};

export const searchMovies = async (query: string, page: MovieParams['page']) => {
  const response = await tmdbApi.get<{ results: Movie[]; total_pages: number }>(
    '/search/movie',
    { params: { query, page } }
  );
  return response.data;
};

export const discoverMovies = async (params: MovieParams) => {
  const response = await tmdbApi.get<{ results: Movie[]; total_pages: number }>(
    '/discover/movie',
    { params }
  );
  return response.data;
};

export const getMovieDetails = async (id: number) => {
  const response = await tmdbApi.get<MovieDetails>(`/movie/${id}`);
  return response.data;
};

export const getMovieCredits = async (id: number) => {
  const response = await tmdbApi.get<{ cast: Cast[]; crew: Crew[] }>(
    `/movie/${id}/credits`
  );
  return response.data;
};

export const getSimilarMovies = async (id: number) => {
  const response = await tmdbApi.get<{ results: Movie[] }>(
    `/movie/${id}/similar`
  );
  return response.data;
};

export const getMovieReviews = async (id: number, page = 1) => {
  const response = await tmdbApi.get<{ results: Review[]; total_pages: number }>(
    `/movie/${id}/reviews`,
    { params: { page } }
  );
  return response.data;
};