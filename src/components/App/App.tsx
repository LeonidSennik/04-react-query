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

  const { data, isLoading, error } = useQuery<TMDBResponse>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies({ query, page }),
    enabled: !!query,
    initialData: {
      page: 1,
      total_pages: 0,
      total_results: 0,
      results: []
    }
  });

 useEffect(() => {
  if (!isLoading && query && data.results.length === 0) {
    toast('No movies found for your query.');
  }
}, [isLoading, data, query]);

  const handleSearchSubmit = (newQuery: string) => {
    const trimmedQuery = newQuery.trim();
    if (!trimmedQuery) {
      toast.error('Please enter your search query.');
      return;
    }

    setQuery(trimmedQuery);
    setPage(1);
  };

  return (
    <div className={css.container}>
      <Toaster position="top-right" />
      <h1>🎬 Movie Explorer</h1>

      <SearchBar onSubmit={handleSearchSubmit} />

      {isLoading && <Loader />}
      {error && <ErrorMessage message="Failed to fetch movies. Please try again." />}

      {data.results.length > 0 && (
        <>
          <MovieGrid movies={data.results} onSelect={setSelectedMovie} />

          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
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
