import { api, options } from "./api";
import { MovieSearchProps } from "@/interfaces/search-interface";
import axios from "axios";
import React from "react";

export const requestContents = async (
  mediaSearch: string,
  setMedias: React.Dispatch<React.SetStateAction<MovieSearchProps[]>>,
  selectFilter: number[],
) => {
  const defaultUrl = `query=${mediaSearch}&language=pt-BR&Region=BR&page=1`;
  const defaultUrlEn = `query=${mediaSearch}&page=1`;

  const results: any[] = [];

  const filter1 = selectFilter.includes(1);
  const filter2 = selectFilter.includes(2);
  const filter3 = selectFilter.includes(3);

  // Se selectFilter está vazio ou é [1,2,3], buscar tudo
  const fetchAll = selectFilter.length === 0 || (filter1 && filter2 && filter3) || selectFilter.sort().toString() === '1,2,3';

  const fetchMovies = async () => {
    const [resp, respEn] = await Promise.all([
      api.get(`3/search/movie?${defaultUrl}`, options),
      api.get(`3/search/movie?${defaultUrlEn}`, options),
    ]);

    const mapOverviewsEn = new Map();
    respEn.data.results.forEach((movie: any) => {
      mapOverviewsEn.set(movie.id, movie.overview?.trim());
    });

    const filteredMovies = resp.data.results.filter((movie: any) => {
      const overviewPt = movie.overview?.trim();
      const overviewEn = mapOverviewsEn.get(movie.id);
      return overviewPt !== overviewEn;
    });

    const nowPlaying = await api.get(`3/movie/now_playing?language=pt-BR&region=BR&page=1`, options);
    const nowPlayingIds = new Set(nowPlaying.data.results.map((movie: any) => movie.id));

    const filteredMovies2 = filteredMovies.filter((movie: any) => 
      !nowPlayingIds.has(movie.id)
    );

    return filteredMovies2;
  };

  const fetchTvShows = async () => {
    const [resp, respEn] = await Promise.all([
      api.get(`3/search/tv?${defaultUrl}`, options),
      api.get(`3/search/tv?${defaultUrlEn}`, options),
    ]);

    const mapOverviewsEn = new Map();
    respEn.data.results.forEach((tvShow: any) => {
      mapOverviewsEn.set(tvShow.id, tvShow.overview?.trim());
    });

    const filteredTvShows = resp.data.results.filter((tvShow: any) => {
      const overviewPt = tvShow.overview?.trim();
      const overviewEn = mapOverviewsEn.get(tvShow.id);
      return overviewPt !== overviewEn;
    });

    return filteredTvShows;
  };

  const fetchNowPlaying = async () => {
    const [searchResp, searchRespEn] = await Promise.all([
      api.get(`3/search/movie?${defaultUrl}`, options),
      api.get(`3/search/movie?${defaultUrlEn}`, options),
    ]);

    const mapOverviewsEn = new Map();
    searchRespEn.data.results.forEach((movie: any) => {
      mapOverviewsEn.set(movie.id, movie.overview?.trim());
    });

    const filteredSearchMovies = searchResp.data.results.filter((movie: any) => {
      const overviewPt = movie.overview?.trim();
      const overviewEn = mapOverviewsEn.get(movie.id);
      return overviewPt !== overviewEn;
    });

    const nowPlaying = await api.get(`3/movie/now_playing?language=pt-BR&region=BR&page=1`, options);
    const nowPlayingIds = new Set(nowPlaying.data.results.map((movie: any) => movie.id));

    // Filtra os filmes para que apareçam na busca somente aqueles em cartaz
    // Precisou implementar assim por não existir search apenas para os filmes em cartaz
    const filteredNowPlaying = filteredSearchMovies.filter((movie: any) =>
      nowPlayingIds.has(movie.id)
    );

    return filteredNowPlaying;
  };

  try {
    const promises: Promise<any[]>[] = [];

    if (fetchAll || filter1) {
      promises.push(fetchMovies());
    }

    if (fetchAll || filter2) {
      promises.push(fetchTvShows());
    }

    if (fetchAll || filter3) {
      promises.push(fetchNowPlaying());
    }

    const resolvedResults = await Promise.all(promises);

    // Junta os arrays em um só
    resolvedResults.forEach((res) => {
      results.push(...res);
    });

    results.sort((a, b) => b.vote_count - a.vote_count);

    setMedias(results);
  } catch (error) {
    console.error("Erro ao buscar conteúdos:", error);
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
  let resp
  if(genreId !== 0){
    resp = await api.get(
    `3/discover/${mediaType}?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=${genreId}`,
    options,
  );
  }else{
    resp = await api.get(
    `3/trending/${mediaType}/day?language=pt-BR&region=BR&page=1`,
    options,
  );
  }
 
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


export const initialRequest = async (): Promise<MovieSearchProps[][]> => {
  try {
    const maxLength = 21;

    let nowPlaying: MovieSearchProps[] = []
    let nowPlaying2: MovieSearchProps[] = []

    const currentYear = new Date().getFullYear();

    const NowPlayingResponse = await axios.get("https://server-find-to-watch.vercel.app/api/get-films", {
      params: {
        code: 0
      },
    });

    const nowPlayingPromises = NowPlayingResponse.data.map(async (res: string) => {
      const searchNowPlayingResponse = await api.get(
        `3/search/movie?language=pt-BR&query=${encodeURIComponent(res)}`,
        options
      );

      const filteredResults = searchNowPlayingResponse.data.results.filter(
      (movie: any) => {
      const movieYear = new Date(movie.release_date).getFullYear();
      return movieYear === currentYear || movieYear === (currentYear + 1)
      })

      return filteredResults.length > 0 ? filteredResults[0] : undefined;
    });

    const NowPlayingResultsArrays = await Promise.all(nowPlayingPromises);

    nowPlaying = NowPlayingResultsArrays.flat();

    nowPlaying = nowPlaying.filter((film) => film !== undefined)

    const NowPlaying2Response = await axios.get("https://server-find-to-watch.vercel.app/api/get-films", {
      params: {
        code: 2
      },
    });

    const nowPlaying2Promises = NowPlaying2Response.data.map(async (res: string) => {
      const searchNowPlaying2Response = await api.get(
        `3/search/movie?language=pt-BR&query=${encodeURIComponent(res)}`,
        options
      );

      const filteredResults = searchNowPlaying2Response.data.results.filter(
      (movie: any) => {
      const movieYear = new Date(movie.release_date).getFullYear();
      return movieYear === currentYear || movieYear === (currentYear + 1) || movieYear === (currentYear - 1)
      }
      );

      return filteredResults.length > 0 ? filteredResults[0] : undefined;
    });

    const NowPlaying2ResultsArrays = await Promise.all(nowPlaying2Promises);

    nowPlaying2 = NowPlaying2ResultsArrays.flat();

    nowPlaying2 = nowPlaying2.filter(
      (filme2) =>
        filme2 !== undefined &&
        !nowPlaying.some((filme1) => filme1?.id === filme2.id)
    );

    const trending = await fetchIntercalatedCategory(0, maxLength);
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
      [...nowPlaying, ...nowPlaying2],
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

    const trending = await fetchCategory("movie", 0, maxLength);
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

    const trending = await fetchCategory("tv", 0, maxLength);
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

export const initialRequestCinema = async (): Promise<MovieSearchProps[][]> => {
  try {
    let upComing: MovieSearchProps[] = []
    let nowPlaying: MovieSearchProps[] = []
    let nowPlaying2: MovieSearchProps[] = []

    const currentYear = new Date().getFullYear();

    const NowPlayingResponse = await axios.get("https://server-find-to-watch.vercel.app/api/get-films", {
      params: {
        code: 0
      },
    });

    const nowPlayingPromises = NowPlayingResponse.data.map(async (res: string) => {
      const searchNowPlayingResponse = await api.get(
        `3/search/movie?language=pt-BR&query=${encodeURIComponent(res)}`,
        options
      );

      const filteredResults = searchNowPlayingResponse.data.results.filter(
      (movie: any) => {
      const movieYear = new Date(movie.release_date).getFullYear();
      return movieYear === currentYear || movieYear === (currentYear + 1)
      })

      return filteredResults.length > 0 ? filteredResults[0] : undefined;
    });

    const NowPlayingResultsArrays = await Promise.all(nowPlayingPromises);

    nowPlaying = NowPlayingResultsArrays.flat();

    nowPlaying = nowPlaying.filter((film) => film !== undefined)

    const upComingResponse = await axios.get("https://server-find-to-watch.vercel.app/api/get-films", {
      params: {
        code: 1
      },
    });
    
    const upComingPromises = upComingResponse.data.map(async (res: string) => { 
        const searchUpComingResponse = await api.get(
        `3/search/movie?language=pt-BR&query=${encodeURIComponent(res)}`,
        options
      );

      const filteredResults = searchUpComingResponse.data.results.filter(
      (movie: any) => {
      const movieYear = new Date(movie.release_date).getFullYear();
      return movieYear === currentYear || movieYear === (currentYear + 1)
    }
  );

      return filteredResults.length > 0 ? filteredResults[0] : undefined;
    });

    const UpComingResultsArrays = await Promise.all(upComingPromises);

    upComing = UpComingResultsArrays.flat();

    upComing = upComing.filter((film) => film !== undefined)

    const NowPlaying2Response = await axios.get("https://server-find-to-watch.vercel.app/api/get-films", {
      params: {
        code: 2
      },
    });

    const nowPlaying2Promises = NowPlaying2Response.data.map(async (res: string) => {
      const searchNowPlaying2Response = await api.get(
        `3/search/movie?language=pt-BR&query=${encodeURIComponent(res)}`,
        options
      );

      const filteredResults = searchNowPlaying2Response.data.results.filter(
      (movie: any) => {
      const movieYear = new Date(movie.release_date).getFullYear();
      return movieYear === currentYear || movieYear === (currentYear + 1) || movieYear === (currentYear - 1)
      }
      );

      return filteredResults.length > 0 ? filteredResults[0] : undefined;
    });

    const NowPlaying2ResultsArrays = await Promise.all(nowPlaying2Promises);

    nowPlaying2 = NowPlaying2ResultsArrays.flat();

    nowPlaying2 = nowPlaying2.filter(
      (filme2) =>
        filme2 !== undefined &&
        !nowPlaying.some((filme1) => filme1?.id === filme2.id)
    );

    const getTrailerKey = async (movieId: number): Promise<string | undefined> => {
      const response = await api.get(`3/movie/${movieId}/videos?language=pt-BR`, options);
      const trailers = response.data.results;

      
      const trailer = trailers.find(
        (t: any) => t.type === "Trailer" && t.site === "YouTube"
      );

      return trailer?.key;
    };

    upComing = await Promise.all(
        upComing.map(async (movie: MovieSearchProps) => {
          const key = await getTrailerKey(Number(movie.id));
          return { ...movie, key };
        })
    );

    nowPlaying = await Promise.all(
      nowPlaying.map(async (movie: MovieSearchProps) => {
        const key = await getTrailerKey(Number(movie.id));
        return { ...movie, key };
      })
    );

    nowPlaying2 = await Promise.all(
      nowPlaying2.map(async (movie: MovieSearchProps) => {
        const key = await getTrailerKey(Number(movie.id));
        return { ...movie, key };
      })
    );

    return [nowPlaying, nowPlaying2, upComing];
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
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
