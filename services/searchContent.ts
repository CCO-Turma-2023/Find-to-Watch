import { api, options } from "./api";
import { MovieSearchProps } from "@/interfaces/search-interface";
import React from "react";

export const requestContents = async (
  mediaSearch: string,
  setMedias: React.Dispatch<React.SetStateAction<MovieSearchProps[]>>,
  selectFilter: number[],
) => {
  const defaultUrl = `query=${mediaSearch}&include_adult=false&language=pt-BR&Region=BR&page=1`;
  const defaultUrlEn = `query=${mediaSearch}&include_adult=false&page=1`;
  try {
    const resp = await api.get(`3/search/movie?${defaultUrl}`, options);
    const resp2 = await api.get(`3/search/movie?${defaultUrlEn}`, options);
    const resp3 = await api.get(`3/search/tv?${defaultUrl}`, options);
    const resp4 = await api.get(`3/search/tv?${defaultUrlEn}`, options);

    const mapOverviewsEn = new Map();
    resp2.data.results.forEach((movie: any) => {
      mapOverviewsEn.set(movie.id, movie.overview?.trim());
    });

    resp.data.results = resp.data.results.filter((movie: any) => {
      const overviewPt = movie.overview?.trim();
      const overviewEn = mapOverviewsEn.get(movie.id);
      return overviewPt !== overviewEn;
    });

    const mapTvOverviewsEn = new Map();
    resp4.data.results.forEach((tvShow: any) => {
      mapTvOverviewsEn.set(tvShow.id, tvShow.overview?.trim());
    });

    resp3.data.results = resp3.data.results.filter((tvShow: any) => {
      const overviewPt = tvShow.overview?.trim();
      const overviewEn = mapTvOverviewsEn.get(tvShow.id);
      return overviewPt !== overviewEn;
    });

    const combined = [...resp.data.results, ...resp3.data.results];

    combined.sort((a, b) => b.vote_count - a.vote_count);

    setMedias(combined);
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
  }
};

const filterNowPlaying = async (list: any[]) => {
  const nowPlaying = await api.get(
    "3/movie/now_playing?language=pt-BR&region=BR&page=1",
    options,
  );

  // Pegando os ids dos filmes "Em Cartaz" para filtrar e retirá-los dos outros tópicos de gênero:
  const idsNowPlaying = new Set<number>(
    nowPlaying.data.results.map((movie: any) => movie.id),
  );
  return list.filter((item) => !idsNowPlaying.has(item.id));
};

const fetchCategory = async (
  mediaType: "movie" | "tv",
  genreId: number,
  maxLength: number,
): Promise<MovieSearchProps[]> => {
  const resp = await api.get(
    `3/discover/${mediaType}?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=${genreId}`,
    options,
  );

  resp.data.results = resp.data.results.filter(
    (item: any) => item.overview?.trim() !== "",
  );

  if (mediaType === "movie") {
    // Filtrando os resultados ao retirar os filmes "Em Cartaz"
    const respFiltered = await filterNowPlaying(resp.data.results);
    return respFiltered.slice(0, maxLength);
  } else {
    return resp.data.results.slice(0, maxLength);
  }
};

const fetchTrending = async (
  mediaType: "movie" | "tv",
  maxLength: number,
): Promise<MovieSearchProps[]> => {
  const resp = await api.get(
    `3/trending/${mediaType}/day?language=pt-BR&region=BR&page=1`,
    options,
  );

  resp.data.results = resp.data.results.filter(
    (item: any) => item.overview?.trim() !== "",
  );

  if (mediaType === "movie") {
    // Filtrando os resultados ao retirar os filmes "Em Cartaz"
    const respFiltered = await filterNowPlaying(resp.data.results);
    return respFiltered.slice(0, maxLength);
  } else {
    return resp.data.results.slice(0, maxLength);
  }
};

const fetchIntercalatedCategory = async (
  genreId: number,
  maxLength: number,
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
  maxLength: number,
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

export const initialRequest = async (): Promise<MovieSearchProps[][]> => {
  try {
    const maxLength = 21;

    const nowPlaying = await api.get(
      "3/movie/now_playing?language=pt-BR&region=BR&page=1",
      options,
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

    // Para "thriller" precisa ser diferente, pois o id do gênero se altera para filmes e séries
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

export const initialRequestMovie = async (): Promise<MovieSearchProps[][]> => {
  try {
    const maxLength = 21;

    const nowPlaying = await api.get(
      "3/movie/now_playing?language=pt-BR&region=BR&page=1",
      options,
    );

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

export const initialRequestTVShow = async (): Promise<MovieSearchProps[][]> => {
  try {
    const maxLength = 21;

    const nowPlaying = await api.get(
      "3/movie/now_playing?language=pt-BR&region=BR&page=1",
      options,
    );

    const trending = await fetchTrending("tv", maxLength);
    const actionNadventure = await fetchCategory("tv", 10759, maxLength);
    const drama = await fetchCategory("tv", 18, maxLength);
    const comedy = await fetchCategory("tv", 35, maxLength);
    const animation = await fetchCategory("tv", 16, maxLength);
    const documentary = await fetchCategory("tv", 99, maxLength);
    const kids = await fetchCategory("tv", 10762, maxLength);
    const romance = await fetchCategory("tv", 10749, maxLength);
    const fantasy = await fetchCategory("tv", 10765, maxLength);
    const reality = await fetchCategory("tv", 10764, maxLength);
    const history = await fetchCategory("tv", 36, maxLength);
    const mistery = await fetchCategory("tv", 9648, maxLength);

    return [
      trending,
      actionNadventure,
      drama,
      comedy,
      animation,
      documentary,
      kids,
      romance,
      fantasy,
      reality,
      history,
      mistery,
    ];
  } catch (error) {
    console.error("Erro ao buscar séries:", error);
    return [];
  }
};

export const RequestMediabyId = async (id: string | string[]) => {
  if (id[id.length - 1] === "1") {
    const movie = await api.get(
      `3/movie/${id.slice(0, -1)}?language=pt-BR&Region=BR`,
      options,
    );

    return movie.data;
  }

  const tvshow = await api.get(
    `3/tv/${id.slice(0, -1)}?language=pt-BR&Region=BR`,
    options,
  );

  return tvshow.data;
};
