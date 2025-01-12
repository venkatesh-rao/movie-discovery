# Popular Movies

A modern web application for discovering and exploring movies, powered by TMDB API. Browse popular movies, search for specific titles, and get detailed information about your favorite films.

## Features

- 🎬 Browse popular movies with infinite scroll
- 🔍 Search movies by title
- 🎯 Advanced filtering:
  - Genre selection
  - Release year
  - Rating range
- 📑 Detailed movie information:
  - Cast and crew details
  - User reviews
  - Similar movie recommendations
- 🎨 Responsive design
- ⚡ Optimized performance with lazy loading
- 🔄 Real-time search with debouncing

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Styling**: 
  - Tailwind CSS
  - shadcn/ui components
  - CSS Variables for theming
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Type Checking**: TypeScript
- **Linting**: ESLint

## Setup Guide

1. Clone the repository:

```bash
git clone <repository-url>
cd popular-movies
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
```

4. Start the development server:

```bash
pnpm dev
```