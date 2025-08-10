'use client';

import { useId } from 'react';
import { toast } from 'react-hot-toast';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSubmit: (query: string) => void | Promise<void>;
}

export const SearchBar = ({ onSubmit }: SearchBarProps) => {
  const id = useId();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          className={styles.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>

<form
  className={styles.form}
  action={async (formData) => {
    const rawQuery = formData.get('query');
    const trimmedQuery = typeof rawQuery === 'string' ? rawQuery.trim() : '';

    if (!trimmedQuery) {
      toast.error('Please enter your search query.');
      return;
    }

    await onSubmit(trimmedQuery);
  }}
>
   <input
            className={styles.input}  
            type="text"
            name="query"
            id={`${id}-query`}
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={styles.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
};