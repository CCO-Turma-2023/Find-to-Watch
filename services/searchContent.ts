import axios from "axios";
import { api, options } from "./api";
import { MovieSearchProps } from "@/interfaces/search-interface";
import React, { useState } from "react";
import { useContextHome } from "@/contexts/ContextHome";

export const requestContents = async (
  mediaSearch: string,
  setMedias: React.Dispatch<React.SetStateAction<MovieSearchProps[]>>,
) => {
  const defaultUrl = `query=${mediaSearch}&include_adult=false&language=pt-BR&page=1`;
  try {
    const resp = await api.get(`3/search/movie?${defaultUrl}`, options);
    const resp2 = await api.get(`3/search/tv?${defaultUrl}`, options);

    for (let i in resp2.data.results) {
      resp2.data.results[i]["title"] = resp2.data.results[i]["name"];
      delete resp2.data.results[i]["nome"];
      resp2.data.results[i]["movie"] = false;
    }

    for (let i in resp.data.results) {
      resp.data.results[i]["movie"] = true;
    }

    setMedias([...resp.data.results, ...resp2.data.results]);
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
  }
};

export const initialRequest = async (): Promise<MovieSearchProps[][]> => {
  try {
    const maxLength = 21;
    const nowPlaying = await api.get(
      "3/movie/now_playing?language=pt-BR&region=BR&page=1",
      options, 
    );

    for (let i in nowPlaying.data.results) {
      nowPlaying.data.results[i]["movie"] = true;
    }

    const actionMovie = await api.get(
      "3/discover/movie?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=28",
      options, 
    );

    const actionTVShow = await api.get(
      "3/discover/tv?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=28",
      options,
    );

    for (let i in actionMovie.data.results) {
      actionMovie.data.results[i]["movie"] = true;
    }

    // intercala os resultados entre filmes e séries
    const actionMovies = actionMovie.data.results;
    const actionTVShows = actionTVShow.data.results;
    const action = [];

    for (let i = 0; i < maxLength; i++) {
      if (actionMovies[i]) action.push(actionMovies[i]);
      if (actionTVShows[i]) action.push(actionTVShows[i]);
    }

    const dramaMovie = await api.get(
      "3/discover/movie?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=18",
      options, 
    );

    const dramaTVShow = await api.get(
      "3/discover/tv?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=18",
      options,
    );

    for (let i in dramaMovie.data.results) {
      dramaMovie.data.results[i]["movie"] = true;
    }

    // intercala os resultados entre filmes e séries
    const dramaMovies = dramaMovie.data.results;
    const dramaTVShows = dramaTVShow.data.results;
    const drama = [];

    for (let i = 0; i < maxLength; i++) {
      if (dramaMovies[i]) drama.push(dramaMovies[i]);
      if (dramaTVShows[i]) drama.push(dramaTVShows[i]);
    }

    const comedyMovie = await api.get(
      "3/discover/movie?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=35",
      options, 
    );

    const comedyTVShow = await api.get(
      "3/discover/tv?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=35",
      options,
    );

    for (let i in comedyMovie.data.results) {
      comedyMovie.data.results[i]["movie"] = true;
    }

    // intercala os resultados entre filmes e séries
    const comedyMovies = comedyMovie.data.results;
    const comedyTVShows = comedyTVShow.data.results;
    const comedy = [];

    for (let i = 0; i < maxLength; i++) {
      if (comedyMovies[i]) comedy.push(comedyMovies[i]);
      if (comedyTVShows[i]) comedy.push(comedyTVShows[i]);
    }

    const animationMovie = await api.get(
      "3/discover/movie?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=16",
      options, 
    );

    const animationTVShow = await api.get(
      "3/discover/tv?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=16",
      options,
    );

    for (let i in animationMovie.data.results) {
      animationMovie.data.results[i]["movie"] = true;
    }

    // intercala os resultados entre filmes e séries
    const animationMovies = animationMovie.data.results;
    const animationTVShows = animationTVShow.data.results;
    const animation = [];

    for (let i = 0; i < maxLength; i++) {
      if (animationMovies[i]) animation.push(animationMovies[i]);
      if (animationTVShows[i]) animation.push(animationTVShows[i]);
    }

    const documentaryMovie = await api.get(
      "3/discover/movie?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=99",
      options, 
    );

    const documentaryTVShow = await api.get(
      "3/discover/tv?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=99",
      options,
    );

    for (let i in documentaryMovie.data.results) {
      documentaryMovie.data.results[i]["movie"] = true;
    }

    // intercala os resultados entre filmes e séries
    const documentaryMovies = documentaryMovie.data.results;
    const documentaryTVShows = documentaryTVShow.data.results;
    const documentary = [];

    for (let i = 0; i < maxLength; i++) {
      if (documentaryMovies[i]) documentary.push(documentaryMovies[i]);
      if (documentaryTVShows[i]) documentary.push(documentaryTVShows[i]);
    }

    const terrorMovie = await api.get(
      "3/discover/movie?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=27",
      options, 
    );

    const terrorTVShow = await api.get(
      "3/discover/tv?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=27",
      options,
    );

    for (let i in terrorMovie.data.results) {
      terrorMovie.data.results[i]["movie"] = true;
    }

    // intercala os resultados entre filmes e séries
    const terrorMovies = terrorMovie.data.results;
    const terrorTVShows = terrorTVShow.data.results;
    const terror = [];

    for (let i = 0; i < maxLength; i++) {
      if (terrorMovies[i]) terror.push(terrorMovies[i]);
      if (terrorTVShows[i]) terror.push(terrorTVShows[i]);
    }

    const romanceMovie = await api.get(
      "3/discover/movie?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=10749",
      options, 
    );

    const romanceTVShow = await api.get(
      "3/discover/tv?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=10749",
      options,
    );

    for (let i in romanceMovie.data.results) {
      romanceMovie.data.results[i]["movie"] = true;
    }

    // intercala os resultados entre filmes e séries
    const romanceMovies = romanceMovie.data.results;
    const romanceTVShows = romanceTVShow.data.results;
    const romance = [];

    for (let i = 0; i < maxLength; i++) {
      if (romanceMovies[i]) romance.push(romanceMovies[i]);
      if (romanceTVShows[i]) romance.push(romanceTVShows[i]);
    }

    const scienceFictionMovie = await api.get(
      "3/discover/movie?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=878",
      options, 
    );

    const scienceFictionTVShow = await api.get(
      "3/discover/tv?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=878",
      options,
    );

    for (let i in scienceFictionMovie.data.results) {
      scienceFictionMovie.data.results[i]["movie"] = true;
    }

    // intercala os resultados entre filmes e séries
    const scienceFictionMovies = scienceFictionMovie.data.results;
    const scienceFictionTVShows = scienceFictionTVShow.data.results;
    const scienceFiction = [];

    for (let i = 0; i < maxLength; i++) {
      if (scienceFictionMovies[i]) scienceFiction.push(scienceFictionMovies[i]);
      if (scienceFictionTVShows[i]) scienceFiction.push(scienceFictionTVShows[i]);
    }

    const musicalMovie = await api.get(
      "3/discover/movie?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=10402",
      options, 
    );

    const musicalTVShow = await api.get(
      "3/discover/tv?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=10402",
      options,
    );

    for (let i in musicalMovie.data.results) {
      musicalMovie.data.results[i]["movie"] = true;
    }

    // intercala os resultados entre filmes e séries
    const musicalMovies = musicalMovie.data.results;
    const musicalTVShows = musicalTVShow.data.results;
    const musical = [];

    for (let i = 0; i < maxLength; i++) {
      if (musicalMovies[i]) musical.push(musicalMovies[i]);
      if (musicalTVShows[i]) musical.push(musicalTVShows[i]);
    }

    const historyMovie = await api.get(
      "3/discover/movie?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=36",
      options, 
    );

    const historyTVShow = await api.get(
      "3/discover/tv?language=pt-BR&region=BR&page=1&sort_by=popularity.desc&with_genres=36",
      options,
    );

    for (let i in historyMovie.data.results) {
      historyMovie.data.results[i]["movie"] = true;
    }

    // intercala os resultados entre filmes e séries
    const historyMovies = historyMovie.data.results;
    const historyTVShows = historyTVShow.data.results;
    const history = [];

    for (let i = 0; i < maxLength; i++) {
      if (historyMovies[i]) history.push(historyMovies[i]);
      if (historyTVShows[i]) history.push(historyTVShows[i]);
    }

    // Filtra os filmes do gênero, removendo os que também estão em cartaz:
    const nowPlayingIds = new Set(nowPlaying.data.results.map((movie: any) => movie.id));

    const actionFiltered = action.filter((movie: any) => !nowPlayingIds.has(movie.id));
    const dramaFiltered = drama.filter((movie: any) => !nowPlayingIds.has(movie.id));
    const comedyFiltered = comedy.filter((movie: any) => !nowPlayingIds.has(movie.id));
    const animationFiltered = animation.filter((movie: any) => !nowPlayingIds.has(movie.id));
    const documentaryFiltered = documentary.filter((movie: any) => !nowPlayingIds.has(movie.id));
    const terrorFiltered = terror.filter((movie: any) => !nowPlayingIds.has(movie.id));
    const romanceFiltered = romance.filter((movie: any) => !nowPlayingIds.has(movie.id));
    const scienceFictionFiltered = scienceFiction.filter((movie: any) => !nowPlayingIds.has(movie.id));
    const musicalFiltered = musical.filter((movie: any) => !nowPlayingIds.has(movie.id));
    const historyFiltered = history.filter((movie: any) => !nowPlayingIds.has(movie.id));

    return [
      nowPlaying.data.results,
      actionFiltered,
      dramaFiltered,
      comedyFiltered,
      animationFiltered,
      documentaryFiltered,
      terrorFiltered,
      romanceFiltered,
      scienceFictionFiltered,
      musicalFiltered,
      historyFiltered,
    ];
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    return [[], [], [], [], []]; // Retorna array vazio se der erro
  }
};


export const RequestMediabyId = async (id : string | string[]) => {
  if (id[id.length - 1] === "1")
  {
    const movie = await api.get(
      `3/movie/${id.slice(0, -1)}?language=pt-BR`,
      options, 
    );

    movie.data["movie"] = true;
  
    return movie.data;
  }

  const show = await api.get(
    `3/tv/${id.slice(0, -1)}?language=pt-BR`,
    options, 
  );

  show.data["title"] = show.data["name"];
  delete show.data["nome"];
  show.data["movie"] = false;

  return show.data;
}