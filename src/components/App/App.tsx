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

const createEmptyTMDBResponse = (): TMDBResponse => ({
  page: 1,
  total_pages: 0,
  total_results: 0,
  results: []
});

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

const {
  data,
  error,
  isSuccess,
  isError,
  isFetching,
} = useQuery<TMDBResponse, Error, TMDBResponse, [string, string, number]>({
  queryKey: ['movies', query, page],
  queryFn: () => fetchMovies({ query, page }),
  enabled: !!query,
  placeholderData: (prevData) => prevData ?? {
    page: 1,
    total_pages: 0,
    total_results: 0,
    results: []
  }
});

  
  const safeData = data ?? createEmptyTMDBResponse();

  useEffect(() => {
    if (isSuccess && query && safeData.total_results === 0) {
      toast('No movies found for your query.');
    }
  }, [isSuccess, query, safeData]);

  const handleSearchSubmit = (newQuery: string) => {
    const trimmedQuery = newQuery.trim();
    if (!trimmedQuery) {
      toast.error('Please enter your search query.');
      return;
    }

    setQuery(trimmedQuery);
    setPage(1);
    setSelectedMovie(null);
  };

  const results = safeData.results;
  const totalPages = safeData.total_pages;

  const hasResults = results.length > 0;
  const hasPagination = totalPages > 1;

  return (
    <div className={css.container}>
      <Toaster position="top-right" />
      <h1>🎬 Movie Explorer</h1>

      <SearchBar onSubmit={handleSearchSubmit} />

      {isFetching && <Loader />}
      {isError && (
        <ErrorMessage
          message={error instanceof Error ? error.message : 'Failed to fetch movies.'}
        />
      )}

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