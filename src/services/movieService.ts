import axios from "axios";
import type { Movie } from "../types/movie";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface TMDBResponse {
  results: Movie[];
  total_pages: number;
}

const movieInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${TMDB_TOKEN}`,
  },
});

export const fetchMovies = async (
  query: string,
  page: number
): Promise<TMDBResponse> => {
  const response = await movieInstance.get<TMDBResponse>("/search/movie", {
    params: {
      query: query,
      page: page,
    },
  });
  return response.data;
};
