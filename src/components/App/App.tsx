import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import SearchBar from "../SearchBar/SearchBar";

import css from "./App.module.css";

const App = () => {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Paginate = (ReactPaginate as any).default || ReactPaginate;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
  });

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  const movies = data?.hits || [];
  const totalPages = data?.nbPages ? Math.min(data.nbPages, 500) : 0;

  useEffect(() => {
    if (query && data && data.hits.length === 0 && !isLoading) {
      toast.error("Нічого не знайдено за вашим запитом.");
    }
  }, [data, query, isLoading]);

  useEffect(() => {
    if (page > 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />

      {isError && <ErrorMessage />}

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {movies.length > 0 && (
            <>
              {totalPages > 1 && (
                <div className={css.paginationWrapper}>
                  <Paginate
                    pageCount={totalPages}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={1}
                    onPageChange={({ selected }: { selected: number }) =>
                      setPage(selected + 1)
                    }
                    forcePage={page - 1}
                    containerClassName={css.pagination}
                    pageClassName={css.pageItem}
                    pageLinkClassName={css.pageLink}
                    activeClassName={css.active}
                    previousClassName={css.pageItem}
                    nextClassName={css.pageItem}
                    previousLinkClassName={css.pageLink}
                    nextLinkClassName={css.pageLink}
                    breakLabel="..."
                    breakClassName={css.pageItem}
                    breakLinkClassName={css.pageLink}
                    nextLabel="→"
                    previousLabel="←"
                  />
                </div>
              )}

              <MovieGrid movies={movies} onSelect={setSelectedMovie} />
            </>
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default App;
