import { api, options } from "./api";
import {
  MovieSearchProps,
  contentProvider,
} from "@/interfaces/search-interface";
import axios from "axios";
import React from "react";

const getOverviewDifference = (original: any[], translated: any[]) => {
  const map = new Map(
    translated.map((item) => [item.id, item.overview?.trim()]),
  );
  return original.filter((item) => item.overview?.trim() !== map.get(item.id));
};

const fetchFromServer = async (
  code: number,
  yearRange: number[],
): Promise<MovieSearchProps[]> => {
  const response = await axios.get(
    "https://server-find-to-watch.vercel.app/api/get-films",
    { params: { code } },
  );

  const promises = response.data.map(async (res: any) => {
    const searchResp = await api.get(
      `3/search/movie?language=pt-BR&query=${encodeURIComponent(res.title)}`,
      options,
    );
    const filtered = searchResp.data.results.filter((movie: any) => {      
      const year = new Date(movie.release_date).getFullYear();
      return yearRange.includes(year);
    });
    if (filtered.length > 0 && res.overview.trim()) {
      filtered[0].overview = res.overview;
    }
    return filtered[0];
  });

  const results = await Promise.all(promises);
  return results.filter(Boolean);
};

const filterOutNowPlaying = async (
  movieList: MovieSearchProps[],
): Promise<MovieSearchProps[]> => {
  const nowPlaying = await mergeNowPlaying();
  const nowPlayingIds = new Set(nowPlaying.map((movie) => movie.id));

  return movieList.filter((movie) => !nowPlayingIds.has(movie.id));
};

const mergeNowPlaying = async () => {
  const currentYear = new Date().getFullYear();
  const now = await fetchFromServer(0, [currentYear -1, currentYear, currentYear + 1]);
  const pastFuture = await fetchFromServer(2, [currentYear - 1, currentYear, currentYear + 1,]);

  const ids = new Set(now.map((m) => String(m.id)));
  const unique = pastFuture.filter((m) => !ids.has(String(m.id)));

  return [...now, ...unique];
};

const fetchMediaWithFilter = async (
  type: "movie" | "tv",
  defaultUrl: string,
  defaultUrlEn: string,
) => {
  const [res, resEn] = await Promise.all([
    api.get(`3/search/${type}?${defaultUrl}`, options),
    api.get(`3/search/${type}?${defaultUrlEn}`, options),
  ]);

  return getOverviewDifference(res.data.results, resEn.data.results);
};

const fetchCategory = async (
  mediaType: "movie" | "tv",
  genreId: number,
  maxLength: number,
): Promise<MovieSearchProps[]> => {
  const url = genreId
    ? `3/discover/${mediaType}?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=${genreId}`
    : `3/trending/${mediaType}/day?language=pt-BR&region=BR&page=1`;

  const res = await api.get(url, options);
  const filteredOverview = res.data.results.filter(
    (item: any) => item.overview?.trim() !== "",
  );

  if (mediaType === "movie") {
    // Filtrando para retirar os filmes Em Cartaz das outras categorias
    const filteredMovies = await filterOutNowPlaying(filteredOverview);
    return filteredMovies;
  }

  return filteredOverview.slice(0, maxLength);
};

const fetchIntercalatedCategory = async (
  genreId: number,
  maxLength: number,
) => {
  const movie = await fetchCategory("movie", genreId, maxLength);
  const tv = await fetchCategory("tv", genreId, maxLength);
  const result: MovieSearchProps[] = [];
  for (let i = 0; i < maxLength; i++) {
    if (movie[i]) result.push(movie[i]);
    if (tv[i]) result.push(tv[i]);
  }
  return result;
};

export const requestContents = async (
  mediaSearch: string,
  setMedias: React.Dispatch<React.SetStateAction<MovieSearchProps[]>>,
  selectFilter: number[],
) => {
  if (!mediaSearch.trim()) {
    setMedias([]);
    return;
  }
  const defaultUrl = `query=${mediaSearch}&language=pt-BR&region=BR&page=1`;
  const defaultUrlEn = `query=${mediaSearch}&page=1`;
  let results: MovieSearchProps[] = [];

  const filters = [1, 2, 3].map((v) => selectFilter.includes(v));
  const fetchAll =
    selectFilter.length === 0 ||
    filters.every(Boolean) ||
    selectFilter.sort().toString() === "1,2,3";

  try {
    const promises: Promise<MovieSearchProps[]>[] = [];

    if (fetchAll || filters[0]) {
      promises.push(fetchMediaWithFilter("movie", defaultUrl, defaultUrlEn));
    }

    if (fetchAll || filters[1]) {
      promises.push(fetchMediaWithFilter("tv", defaultUrl, defaultUrlEn));
    }

    const data = await Promise.all(promises);
    results = data.flat(); // transforma um array [][] em []

    let filteredNowPlaying: MovieSearchProps[] = [];

    if (filters[2] || fetchAll) {
      const nowPlaying = await mergeNowPlaying();
      filteredNowPlaying = nowPlaying.filter((movie) => {
        const title = movie.title?.toLowerCase() || "";
        const query = mediaSearch.toLowerCase().trim();
        return title.includes(query);
      });

      if (filters[0] || filters[1] || fetchAll) {
        const nowPlayingIds = new Set(filteredNowPlaying.map((m) => m.id));
        results = results.filter((m) => !nowPlayingIds.has(m.id));
      }

      results.push(...filteredNowPlaying);
    }

    results.sort((a: any, b: any) => b.vote_count - a.vote_count);
    setMedias(results);
  } catch (err) {
    console.error("Erro ao buscar conteúdos:", err);
  }
};

export const initialRequest = async (): Promise<MovieSearchProps[][]> => {
  try {
    const maxLength = 21;
    const nowPlaying = await mergeNowPlaying();

    // Gêneros a serem requisitados da API
    const genres = [0, 28, 18, 35, 16, 99, 27, 10749, 878, 10402, 36];
    // Função para séries e filmes serem intercalados na visualização da Home
    const intercalated = await Promise.all(
      genres.map((id) => fetchIntercalatedCategory(id, maxLength)),
    );

    // Para os filmes do gênero Thriller, o id é diferente quando se é série ou filme, por isso a chamada é separada
    const thrillerMovie = await fetchCategory("movie", 53, maxLength);
    const thrillerTV = await fetchCategory("tv", 9648, maxLength);
    const thriller: MovieSearchProps[] = [];
    // Intercala os filmes do gênero Thriller filtrando aqueles que estão Em Cartaz
    for (let i = 0; i < maxLength; i++) {
      if (thrillerMovie[i]) thriller.push(thrillerMovie[i]);
      if (thrillerTV[i]) thriller.push(thrillerTV[i]);
    }

    return [nowPlaying, ...intercalated, thriller];
  } catch (error) {
    console.error("Erro ao buscar dados iniciais:", error);
    return [];
  }
};

export const initialRequestMovie = async (): Promise<MovieSearchProps[][]> => {
  try {
    const maxLength = 21;
    // Gêneros a serem requisitados da API
    const genres = [0, 28, 18, 35, 16, 99, 27, 10749, 878, 10402, 36, 53];
    // Função para buscar todos os filmes pelos gêneros
    const results = await Promise.all(
      genres.map((id) => fetchCategory("movie", id, maxLength)),
    );

    return results;
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    return [];
  }
};

export const initialRequestTVShow = async (): Promise<MovieSearchProps[][]> => {
  try {
    const maxLength = 21;
    const genres = [
      0, 10759, 18, 35, 16, 99, 10762, 10749, 10765, 10764, 36, 9648,
    ];
    const results = await Promise.all(
      genres.map((id) => fetchCategory("tv", id, maxLength)),
    );
    return results;
  } catch (error) {
    console.error("Erro ao buscar séries:", error);
    return [];
  }
};

export const initialRequestCinema = async (): Promise<MovieSearchProps[][]> => {
  try {
    const currentYear = new Date().getFullYear();
    const nowPlaying = await fetchFromServer(0, [currentYear - 1, currentYear, currentYear + 1]);
    const upComing = await fetchFromServer(1, [currentYear -1, currentYear, currentYear + 1]);
    const nowPlaying2 = await fetchFromServer(2, [currentYear - 1, currentYear, currentYear + 1]);

    const existingIds = new Set(nowPlaying.map((m) => String(m.id)));
    const uniqueNowPlaying2 = nowPlaying2.filter(
      (m) => !existingIds.has(String(m.id)),
    );

    const getTrailerKey = async (id: number) => {
      const res = await api.get(`3/movie/${id}/videos?language=pt-BR`, options);
      return res.data.results.find(
        (t: any) => t.type === "Trailer" && t.site === "YouTube",
      )?.key;
    };

    const withKey = async (list: MovieSearchProps[]) =>
      Promise.all(
        list.map(async (m) => ({
          ...m,
          key: await getTrailerKey(Number(m.id)),
        })),
      );

    return [
      await withKey(nowPlaying),
      await withKey(uniqueNowPlaying2),
      await withKey(upComing),
    ];
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    return [];
  }
};

export const RequestMediabyId = async (id: string | string[]) => {
  const isMovie = id[id.length - 1] === "1";
  const endpoint = isMovie
    ? `3/movie/${id.slice(0, -1)}`
    : `3/tv/${id.slice(0, -1)}`;
  const res = await api.get(`${endpoint}?language=pt-BR&region=BR`, options);
  return res.data;
};

export const requestWatchProvides = async (id: string | string[]) => {
  let request;

  if (id[id.length - 1] === "1") {
    request = `3/movie/${id.slice(0, -1)}/watch/providers`;
  } else {
    request = `3/tv/${id.slice(0, -1)}/watch/providers`;
  }

  const res = await api.get(request, options);

  let contentArray: contentProvider[] = [];

  if (res.data.results["BR"].ads) {
    contentArray = [...res.data.results["BR"].ads];
  }

  if (res.data.results["BR"].flatrate) {
    contentArray = [...contentArray, ...res.data.results["BR"].flatrate];
  }

  return contentArray.length > 0 ? contentArray : undefined;
};
