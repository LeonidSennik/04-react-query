'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Toaster, toast } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import type { TMDBResponse } from '../../services/movieService';
import { Loader } from '../Loader/Loader';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { SearchBar } from '../SearchBar/SearchBar';
import { MovieGrid } from '../MovieGrid/MovieGrid';
import { MovieModal } from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import css from './App.module.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, error, isSuccess } = useQuery<TMDBResponse>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies({ query, page }),
    enabled: !!query,
  });

  
  useEffect(() => {
    if (isSuccess && query && data?.total_results === 0) {
      toast('No movies found for your query.');
    }
  }, [isSuccess, query, data]);

  const handleSearchSubmit = (newQuery: string) => {
    const trimmedQuery = newQuery.trim();
    if (!trimmedQuery) {
      toast.error('Please enter your search query.');
      return;
    }

    setQuery(trimmedQuery);
    setPage(1);
  };

  const results = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  const hasResults = results.length > 0;
  const hasPagination = totalPages > 1;

  return (
    <div className={css.container}>
      <Toaster position="top-right" />
      <h1>🎬 Movie Explorer</h1>

      <SearchBar onSubmit={handleSearchSubmit} />

      {isLoading && <Loader />}
      {error && <ErrorMessage message="Failed to fetch movies. Please try again." />}

      {hasResults && (
        <>
          <MovieGrid movies={results} onSelect={setSelectedMovie} />

          {hasPagination && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}