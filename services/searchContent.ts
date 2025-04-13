import { api, options } from "./api";
import { MovieSearchProps } from "@/interfaces/search-interface";
import React from "react";

export const requestContents = async (
  mediaSearch: string,
  setMedias: React.Dispatch<React.SetStateAction<MovieSearchProps[]>>,
) => {
  const defaultUrl = `query=${mediaSearch}&include_adult=false&language=pt-BR&page=1`;
  try {
    const resp = await api.get(`3/search/movie?${defaultUrl}`, options);
    const resp2 = await api.get(`3/search/tv?${defaultUrl}`, options);

    setMedias([...resp.data.results, ...resp2.data.results]);
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
  }
};

const fetchCategory = async (
  mediaType: "movie" | "tv",
  genreId: number,
  maxLength: number
): Promise<MovieSearchProps[]> => {
  const resp = await api.get(
    `3/discover/${mediaType}?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=${genreId}`,
    options
  );
  return resp.data.results.slice(0, maxLength);
};

const fetchTrending = async (
  mediaType: "movie" | "tv",
  maxLength: number
): Promise<MovieSearchProps[]> => {
  const resp = await api.get(
    `3/trending/${mediaType}/day?language=pt-BR&region=BR&page=1`,
    options
  );
  return resp.data.results.slice(0, maxLength);
};

const fetchIntercalatedCategory = async (
  genreId: number,
  maxLength: number
): Promise<MovieSearchProps[]> => {
  const movie = await fetchCategory("movie", genreId, maxLength);
  const tv = await fetchCategory("tv", genreId, maxLength);
  const result: MovieSearchProps[] = [];

  for (let i = 0; i < maxLength; i++) {
    if (movie[i]) result.push(movie[i]);
    if (tv[i]) result.push(tv[i]);
  }

  return result;
};

const fetchIntercalatedTrending = async (
  maxLength: number
): Promise<MovieSearchProps[]> => {
  const movie = await fetchTrending("movie", maxLength);
  const tv = await fetchTrending("tv", maxLength);
  const result: MovieSearchProps[] = [];

  for (let i = 0; i < maxLength; i++) {
    if (movie[i]) result.push(movie[i]);
    if (tv[i]) result.push(tv[i]);
  }

  return result;
};

// 🔀 Mantém mistura de filmes + séries
export const initialRequest = async (): Promise<MovieSearchProps[][]> => {
  try {
    const maxLength = 21;

    const nowPlaying = await api.get(
      "3/movie/now_playing?language=pt-BR&region=BR&page=1",
      options
    );

    const trending = await fetchIntercalatedTrending(maxLength);
    const action = await fetchIntercalatedCategory(28, maxLength);
    const drama = await fetchIntercalatedCategory(18, maxLength);
    const comedy = await fetchIntercalatedCategory(35, maxLength);
    const animation = await fetchIntercalatedCategory(16, maxLength);
    const documentary = await fetchIntercalatedCategory(99, maxLength);
    const terror = await fetchIntercalatedCategory(27, maxLength);
    const romance = await fetchIntercalatedCategory(10749, maxLength);
    const scienceFiction = await fetchIntercalatedCategory(878, maxLength);
    const musical = await fetchIntercalatedCategory(10402, maxLength);
    const history = await fetchIntercalatedCategory(36, maxLength);

    const thrillerMovie = await fetchCategory("movie", 53, maxLength);
    const thrillerTV = await fetchCategory("tv", 9648, maxLength);
    const thriller: MovieSearchProps[] = [];
    for (let i = 0; i < maxLength; i++) {
      if (thrillerMovie[i]) thriller.push(thrillerMovie[i]);
      if (thrillerTV[i]) thriller.push(thrillerTV[i]);
    }

    return [
      nowPlaying.data.results,
      trending,
      action,
      drama,
      comedy,
      animation,
      documentary,
      terror,
      romance,
      scienceFiction,
      musical,
      history,
      thriller,
    ];
  } catch (error) {
    console.error("Erro ao buscar dados iniciais:", error);
    return [];
  }
};

// 🎬 Apenas FILMES
export const initialRequestMovie = async (): Promise<MovieSearchProps[][]> => {
  try {
    const maxLength = 21;

    const trending = await fetchTrending("movie", maxLength);
    const action = await fetchCategory("movie", 28, maxLength);
    const drama = await fetchCategory("movie", 18, maxLength);
    const comedy = await fetchCategory("movie", 35, maxLength);
    const animation = await fetchCategory("movie", 16, maxLength);
    const documentary = await fetchCategory("movie", 99, maxLength);
    const terror = await fetchCategory("movie", 27, maxLength);
    const romance = await fetchCategory("movie", 10749, maxLength);
    const scienceFiction = await fetchCategory("movie", 878, maxLength);
    const musical = await fetchCategory("movie", 10402, maxLength);
    const history = await fetchCategory("movie", 36, maxLength);
    const thriller = await fetchCategory("movie", 53, maxLength);

    return [
      trending,
      action,
      drama,
      comedy,
      animation,
      documentary,
      terror,
      romance,
      scienceFiction,
      musical,
      history,
      thriller,
    ];
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    return [];
  }
};

// 📺 Apenas SÉRIES DE TV
export const initialRequestTVShow = async (): Promise<MovieSearchProps[][]> => {
  try {
    const maxLength = 21;

    const trending = await fetchTrending("tv", maxLength);
    const action = await fetchCategory("tv", 28, maxLength);
    const drama = await fetchCategory("tv", 18, maxLength);
    const comedy = await fetchCategory("tv", 35, maxLength);
    const animation = await fetchCategory("tv", 16, maxLength);
    const documentary = await fetchCategory("tv", 99, maxLength);
    const terror = await fetchCategory("tv", 27, maxLength);
    const romance = await fetchCategory("tv", 10749, maxLength);
    const scienceFiction = await fetchCategory("tv", 878, maxLength);
    const musical = await fetchCategory("tv", 10402, maxLength);
    const history = await fetchCategory("tv", 36, maxLength);
    const mystery = await fetchCategory("tv", 9648, maxLength); // equivalente a thriller em TV

    return [
      trending,
      action,
      drama,
      comedy,
      animation,
      documentary,
      terror,
      romance,
      scienceFiction,
      musical,
      history,
      mystery,
    ];
  } catch (error) {
    console.error("Erro ao buscar séries:", error);
    return [];
  }
};

export const RequestMediabyId = async (id : string | string[]) => {
  if (id[id.length - 1] === "1")
  {
    const movie = await api.get(
      `3/movie/${id.slice(0, -1)}?language=pt-BR`,
      options, 
    );
  
    return movie.data;
  }

  const show = await api.get(
    `3/tv/${id.slice(0, -1)}?language=pt-BR`,
    options, 
  );

  return show.data;
}