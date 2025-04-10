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
    const maxLength = 16;
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

    // Filtra os filmes do gênero, removendo os que também estão em cartaz:
    const nowPlayingIds = new Set(nowPlaying.data.results.map((movie: any) => movie.id));

    const actionFiltered = action.filter((movie: any) => !nowPlayingIds.has(movie.id));
    const dramaFiltered = drama.filter((movie: any) => !nowPlayingIds.has(movie.id));
    const comedyFiltered = comedy.filter((movie: any) => !nowPlayingIds.has(movie.id));
    const animationFiltered = animation.filter((movie: any) => !nowPlayingIds.has(movie.id));

    return [
      nowPlaying.data.results,
      actionFiltered,
      dramaFiltered,
      comedyFiltered,
      animationFiltered,
    ];
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    return [[], [], [], [], []]; // Retorna array vazio se der erro
  }
};


export const RequestMediabyId = async (id : string | string[]) => {
  console.log(id[-1]);
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