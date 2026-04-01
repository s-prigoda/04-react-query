import axios from "axios";
import type { Movie } from "../types/movie";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export interface CustomResponse {
  hits: Movie[];
  hitsPerPage: number;
  nbHits: number;
  nbPages: number;
  page: number;
}

interface TMDBRawResponse {
  results: Movie[];
  total_results: number;
  total_pages: number;
  page: number;
}

const movieInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${TMDB_TOKEN}`,
    Accept: "application/json",
  },
});

export async function fetchMovies(
  query: string,
  page: number = 1
): Promise<CustomResponse> {
  const { data } = await movieInstance.get<TMDBRawResponse>("/search/movie", {
    params: {
      query: query,
      page: page,
    },
  });

  return {
    hits: data.results,
    hitsPerPage: 20,
    nbHits: data.total_results,
    nbPages: data.total_pages,
    page: data.page,
  };
}
