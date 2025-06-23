import { api, options } from "./api";
import {
  MovieSearchProps,
  contentProvider,
} from "@/interfaces/search-interface";
import axios from "axios";
import React from "react";

const SearchCache = new Map<string, MovieSearchProps[]>();

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

    const cast = filtered[0] ? (await api.get(`3/movie/${filtered[0].id}/credits`, options)).data.cast : []
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

export const mergeNowPlaying = async () => {
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

  const overviewDif = getOverviewDifference(res.data.results, resEn.data.results);

  let filteredWithProviders = [];

  if(type === "movie"){
    for (const item of overviewDif) {
      const providers = await requestWatchProvides(item.id + '1');
      if (providers !== undefined) {
        filteredWithProviders.push(item);
      }
    }
  }else{
    for (const item of overviewDif) {
      const providers = await requestWatchProvides(item.id + '0');
      if (providers !== undefined) {
        filteredWithProviders.push(item);
      }
    }
  }

  return filteredWithProviders;
};

const fetchCategory = async (
  mediaType: "movie" | "tv",
  genreId: number,
  page:number
): Promise<MovieSearchProps[]> => {
  let url = genreId
    ? `3/discover/${mediaType}?include_adult=false&include_null_first_air_dates=false&language=pt-BR&page=${page}&sort_by=vote_count.desc&with_genres=${genreId}`
    : `3/trending/${mediaType}/day?language=pt-BR&region=BR&page=${page}`;

  let res = await api.get(url, options);

  const filteredOverview = res.data.results.flat().filter(
    (item: any) => item.overview?.trim() !== "",
  );

  let filteredWithProviders = [];

  if (mediaType === "movie") {
    for (const item of filteredOverview) {
      const providers = await requestWatchProvides(item.id + '1');
      if (providers !== undefined) {
        filteredWithProviders.push(item);
      }
    }
    const filteredMovies = await filterOutNowPlaying(filteredWithProviders);
    return filteredMovies;
  }

  for (const item of filteredOverview) {
    const providers = await requestWatchProvides(item.id + '0');
    if (providers !== undefined) {
      filteredWithProviders.push(item);
    }
  }

  return filteredWithProviders
};


export const fetchIntercalatedCategory = async (
  genreId: number,
  page: number,
) => {
  const movie = await fetchCategory("movie", genreId, page);
  const tv = await fetchCategory("tv", genreId, page);
  const result: MovieSearchProps[] = [];

  const maxLength = Math.max(movie.length, tv.length);

  for (let i = 0; i < maxLength; i++) {
    if (movie[i]) result.push(movie[i]);
    if (tv[i]) result.push(tv[i]);
  }

  return result;
}

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

  // Gera chave única para o cache com base na busca + filtros
  const cacheKey = `${mediaSearch.toLowerCase().trim()}|${selectFilter.sort().join(",")}`;
  if (SearchCache.has(cacheKey)) {
    setMedias(SearchCache.get(cacheKey)!);
    return;
  }

  try {
    const promises: Promise<MovieSearchProps[]>[] = [];

    if (fetchAll || filters[0]) {
      promises.push(fetchMediaWithFilter("movie", defaultUrl, defaultUrlEn));
    }

    if (fetchAll || filters[1]) {
      promises.push(fetchMediaWithFilter("tv", defaultUrl, defaultUrlEn));
    }

    const data = await Promise.all(promises);
    results = data.flat();

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

    // Salva no cache
    SearchCache.set(cacheKey, results);

    setMedias(results);
  } catch (err) {
    console.error("Erro ao buscar conteúdos:", err);
  }
};

const usedPagesMap: Record<number, Set<number>> = {};

export const initialRequestMovie = async (
  filters: {
    titulo: string;
    index: number;
    id: number;
    page: number;
  },
): Promise<MovieSearchProps[]> => {
  try {
    const genreId = filters.id;

    // Inicializa se for a primeira vez
    if (!usedPagesMap[genreId]) {
      usedPagesMap[genreId] = new Set();
    }

    let page = filters.page;
    const maxPage = 10;

    // Tenta encontrar uma página ainda não usada
    while (usedPagesMap[genreId].has(page) && page <= maxPage) {
      page++;
    }

    // Se ultrapassou o limite, pode retornar vazio ou tentar reiniciar com outra lógica
    if (page > maxPage) {
      console.warn("Todas as páginas possíveis foram usadas para o gênero:", genreId);
      return [];
    }

    // Marca a página como usada
    usedPagesMap[genreId].add(page);

    // Faz a requisição com a nova página
    const result = await fetchCategory("movie", genreId, page);
    const allResults = result.flat();

    const uniqueResults = allResults.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
    );

    return uniqueResults;
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    return [];
  }
};

// Armazena páginas usadas por gênero de séries
const usedPagesMapTV: Record<number, Set<number>> = {};

export const initialRequestTVShow = async (
  filters: {
    titulo: string;
    index: number;
    id: number;
    page: number;
  },
): Promise<MovieSearchProps[]> => {
  try {
    const genreId = filters.id;

    // Inicializa a estrutura para o gênero, se ainda não existir
    if (!usedPagesMapTV[genreId]) {
      usedPagesMapTV[genreId] = new Set();
    }

    let page = filters.page;
    const maxPage = 10;

    // Evita páginas já usadas, incrementando até encontrar uma livre
    while (usedPagesMapTV[genreId].has(page) && page <= maxPage) {
      page++;
    }

    // Se ultrapassar o máximo, encerra
    if (page > maxPage) {
      console.warn("Todas as páginas possíveis foram usadas para o gênero de série:", genreId);
      return [];
    }

    // Marca a página como usada
    usedPagesMapTV[genreId].add(page);

    // Faz a requisição com a página válida
    const fetched = await fetchCategory("tv", genreId, page);

    // Achata o array e remove duplicatas por `id`
    const allResults = fetched.flat();

    const uniqueResults = allResults.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
    );

    return uniqueResults;
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
  const cast = isMovie ? (await api.get(`3/movie/${id.slice(0, -1)}/credits`, options)).data.cast : 
  (await api.get(`3/tv/${id.slice(0, -1)}/credits`, options)).data.cast
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

  const resultsBR = res.data.results?.["BR"];

  if (!resultsBR) {
    return undefined; // Nenhum provedor no Brasil
  }

  let contentArray: contentProvider[] = [];

  if (resultsBR.ads) {
    contentArray = [...resultsBR.ads];
  }

  if (resultsBR.flatrate) {
    contentArray = [...contentArray, ...resultsBR.flatrate];
  }

  return contentArray.length > 0 ? contentArray : undefined;
};

